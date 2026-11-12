"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Home, FileText, CheckCircle, AlertTriangle, TrendingUp, Award } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem("consultationResult");
    if (!data) { router.push("/consultation"); return; }
    try {
      setResult(JSON.parse(data));
    } catch {
      router.push("/consultation");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat hasil...</p>
        </div>
      </div>
    );
  }
  if (!result) return null;

  const { consultation, results } = result;
  const topResult = results[0];
  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"];

  const chartData = results.map((r) => ({
    name: r.diseaseName.length > 18 ? r.diseaseName.substring(0, 18) + "…" : r.diseaseName,
    fullName: r.diseaseName,
    probabilitas: parseFloat((r.probability * 100).toFixed(2)),
  }));

  const handlePrint = () => window.print();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{payload[0].payload.fullName}</p>
          <p className="text-lg font-bold text-indigo-300">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#080818] text-white">
      {/* Background orbs */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[150px] opacity-8 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-80 h-80 bg-violet-600 rounded-full filter blur-[150px] opacity-8 pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">PakarKhodam</span>
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={handlePrint} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
                Cetak Hasil
              </button>
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/15 border border-green-500/20 rounded-2xl mb-5">
            <CheckCircle className="w-9 h-9 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Hasil Diagnosis</h1>
          <p className="text-gray-400">Analisis berdasarkan gejala yang Anda alami menggunakan Teorema Bayes</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Result Hero */}
            <div className="relative p-8 rounded-2xl overflow-hidden border border-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Diagnosis Utama</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-5">{topResult.diseaseName}</h2>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Probabilitas</p>
                    <p className="text-5xl font-black text-indigo-300">{(topResult.probability * 100).toFixed(1)}%</p>
                  </div>
                  <div className="flex-1 mb-2">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                        style={{ width: `${topResult.probability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-6 rounded-2xl border border-white/8 bg-white/3">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-semibold">Grafik Probabilitas</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="probabilitas" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detail Results */}
            <div className="p-6 rounded-2xl border border-white/8 bg-white/3">
              <h3 className="font-semibold mb-5">Detail Probabilitas Per Kondisi</h3>
              <div className="space-y-4">
                {results.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-medium text-white truncate">{item.diseaseName}</span>
                        <span className="text-sm font-bold ml-3 shrink-0" style={{ color: COLORS[index % COLORS.length] }}>
                          {(item.probability * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.probability * 100}%`, backgroundColor: COLORS[index % COLORS.length], opacity: 0.8 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600 shrink-0 w-10 text-right">{item.diseaseCode}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Patient Info */}
            {(consultation.patientName || consultation.patientAge > 0 || consultation.patientGender) && (
              <div className="p-6 rounded-2xl border border-white/8 bg-white/3">
                <h3 className="font-semibold mb-4 text-sm">Informasi Pasien</h3>
                <div className="space-y-3">
                  {consultation.patientName && (
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Nama</p>
                      <p className="text-sm font-semibold">{consultation.patientName}</p>
                    </div>
                  )}
                  {consultation.patientAge > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Usia</p>
                      <p className="text-sm font-semibold">{consultation.patientAge} tahun</p>
                    </div>
                  )}
                  {consultation.patientGender && (
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Jenis Kelamin</p>
                      <p className="text-sm font-semibold">{consultation.patientGender}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Symptoms */}
            <div className="p-6 rounded-2xl border border-white/8 bg-white/3">
              <h3 className="font-semibold mb-4 text-sm">Gejala yang Dipilih</h3>
              <div className="flex flex-wrap gap-2">
                {consultation.symptoms.map((item, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {item.symptom.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-2">Catatan Penting</p>
                  <ul className="space-y-1.5 text-xs text-amber-200/60">
                    <li>• Hasil bersifat <strong className="text-amber-200/80">prediktif</strong>, bukan diagnosis final</li>
                    <li>• Menggunakan Teorema Bayes + Forward Chaining</li>
                    <li>• Segera konsultasikan dengan <strong className="text-amber-200/80">profesional</strong></li>
                    <li>• Jangan untuk self-diagnosis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 print:hidden">
              <Link
                href="/consultation"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20"
              >
                Konsultasi Lagi
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl font-medium text-sm transition-all"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
