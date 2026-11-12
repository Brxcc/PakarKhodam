"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  User,
  Calendar,
  Users,
  RefreshCw,
} from "lucide-react";

export default function ConsultationPage() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientData, setPatientData] = useState({
    patientName: "",
    patientAge: 0,
    patientGender: "",
  });

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/symptoms", {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) throw new Error("Gagal mengambil data dari server");
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data gejala belum tersedia di database.");
      }
      setSymptoms(data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      setLoadError("Gagal memuat data gejala. Pastikan database aktif dan data gejala sudah di-seed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert("Pilih minimal 1 gejala");
      return;
    }
    setProcessing(true);
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patientData, symptomIds: selectedSymptoms }),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("consultationResult", JSON.stringify(data));
        router.push("/consultation/result");
      } else {
        const error = await response.json();
        alert(error.error || "Terjadi kesalahan");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memproses konsultasi");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat data gejala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080818] text-white">
      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-[150px] opacity-8 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-600 rounded-full filter blur-[150px] opacity-8 pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">PakarKhodam</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Konsultasi Diagnosis</h1>
          <p className="text-gray-400">
            Isi data diri dan pilih gejala yang Anda alami untuk mendapatkan analisis sistem pakar.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-300">Penting untuk Diperhatikan: </span>
              Hasil diagnosis ini hanya sebagai rujukan awal dan tidak menggantikan konsultasi dengan profesional kesehatan mental. Jika Anda mengalami gejala berat, segera hubungi psikolog atau psikiater.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Data */}
          <div className="p-6 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Data Pasien (Opsional)</h2>
                <p className="text-xs text-gray-500">Membantu memberikan konteks hasil analisis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={patientData.patientName}
                  onChange={(e) => setPatientData({ ...patientData, patientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  placeholder="Masukkan nama lengkap (opsional)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Usia</label>
                  <input
                    type="number"
                    value={patientData.patientAge}
                    onChange={(e) => setPatientData({ ...patientData, patientAge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    placeholder="Usia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Jenis Kelamin</label>
                  <select
                    value={patientData.patientGender}
                    onChange={(e) => setPatientData({ ...patientData, patientGender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0d0d20] border border-white/8 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="" className="bg-[#0d0d20]">Pilih jenis kelamin</option>
                    <option value="Laki-laki" className="bg-[#0d0d20]">Laki-laki</option>
                    <option value="Perempuan" className="bg-[#0d0d20]">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="p-6 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Pilih Gejala yang Dialami</h2>
                  <p className="text-xs text-gray-500">Pilih semua gejala yang sesuai kondisi Anda</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                {selectedSymptoms.length}/{symptoms.length} dipilih
              </span>
            </div>

            {loadError ? (
              <div className="text-center py-10 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="font-semibold text-sm mb-1">{loadError}</p>
                <p className="text-xs text-red-300/70 mb-4">
                  Silakan periksa koneksi atau klik tombol di bawah untuk memuat ulang data.
                </p>
                <button
                  type="button"
                  onClick={fetchSymptoms}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Coba Muat Ulang Gejala
                </button>
              </div>
            ) : symptoms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="mb-3">Tidak ada data gejala di database.</p>
                <button
                  type="button"
                  onClick={fetchSymptoms}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Periksa Kembali
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {symptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom.id);
                  return (
                    <label
                      key={symptom.id}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-indigo-500/15 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                          : "bg-white/2 border-white/6 hover:border-white/15 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "bg-indigo-500 border-indigo-500" : "border-gray-600"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSymptom(symptom.id)}
                        className="sr-only"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {symptom.code}
                          </span>
                          <span className="text-sm font-medium text-white leading-tight">
                            {symptom.name}
                          </span>
                        </div>
                        {symptom.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mt-1">
                            {symptom.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-4 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-xl transition-all text-center font-medium"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing || selectedSymptoms.length === 0}
              className="flex-2 flex-grow-[2] px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses Diagnosis...
                </>
              ) : (
                <>
                  Mulai Analisis Diagnosis
                  <span className="text-xs font-normal opacity-70">
                    ({selectedSymptoms.length} dipilih)
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
