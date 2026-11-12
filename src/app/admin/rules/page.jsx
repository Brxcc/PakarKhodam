"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Info, Grid, List, X, BookOpen } from "lucide-react";

export default function RulesPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("matrix"); // 'matrix' or 'rules'
  const [rules, setRules] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    diseaseId: "",
    symptomId: "",
    probability: "",
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesRes, diseasesRes, symptomsRes] = await Promise.all([
        fetch("/api/rules", { cache: "no-store" }),
        fetch("/api/diseases", { cache: "no-store" }),
        fetch("/api/symptoms", { cache: "no-store" }),
      ]);

      const rulesData = rulesRes.ok ? await rulesRes.json() : [];
      const diseasesData = diseasesRes.ok ? await diseasesRes.json() : [];
      const symptomsData = symptomsRes.ok ? await symptomsRes.json() : [];

      setRules(Array.isArray(rulesData) ? rulesData : []);
      setDiseases(Array.isArray(diseasesData) ? diseasesData : []);
      setSymptoms(Array.isArray(symptomsData) ? symptomsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRules([]);
      setDiseases([]);
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD OPERATIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const prob = parseFloat(formData.probability);
    if (isNaN(prob) || prob < 0 || prob > 1) {
      alert("Probabilitas harus antara 0 dan 1");
      return;
    }

    try {
      const url = editingRule ? `/api/rules/${editingRule.id}` : "/api/rules";
      const method = editingRule ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        closeModal();
        showToast(editingRule ? "Aturan berhasil diupdate" : "Aturan berhasil ditambahkan");
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error saving rule:", error);
      alert("Terjadi kesalahan saat menyimpan aturan");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus aturan ini?")) return;
    try {
      const response = await fetch(`/api/rules/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchData();
        showToast("Aturan berhasil dihapus");
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      diseaseId: rule.diseaseId,
      symptomId: rule.symptomId,
      probability: rule.probability.toString(),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setFormData({ diseaseId: "", symptomId: "", probability: "" });
  };

  // --- HELPERS ---
  const getRuleProbability = (symptomId, diseaseId) => {
    const rule = rules.find(
      (r) =>
        (r.symptomId === symptomId || r.symptom?.id === symptomId) &&
        (r.diseaseId === diseaseId || r.disease?.id === diseaseId)
    );
    return rule ? rule.probability : "-";
  };

  // Group rules by Disease for the "Rules Tab"
  const groupedRules = rules.reduce((acc, rule) => {
    const diseaseName = rule.disease?.name || "Unknown";
    const diseaseCode = rule.disease?.code || "-";
    const key = `${diseaseCode} - ${diseaseName}`;

    if (!acc[key]) {
      acc[key] = {
        diseaseName: diseaseName,
        diseaseCode: diseaseCode,
        items: [],
      };
    }
    acc[key].items.push(rule);
    return acc;
  }, {});

  // Generate Base Rule String: "IF (G01 AND G02 ...) THEN Penyakit"
  const generateBaseRuleText = (rulesList, diseaseName) => {
    if (!rulesList || rulesList.length === 0) return "Tidak ada aturan.";
    const conditions = rulesList.map((r) => r.symptom?.code || "?").join(" AND ");
    return `IF (${conditions}) THEN ${diseaseName}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-xl shadow-indigo-500/30">
          ✓ {toastMsg}
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Basis Pengetahuan Sistem Pakar</h1>
          <p className="text-gray-300 mt-1.5 text-base">
            Kelola matriks probabilitas Teorema Bayes dan kaidah inferensi Forward Chaining
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4" />
          Tambah Aturan
        </button>
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121226] border border-slate-700/80 rounded-2xl w-fit shadow-sm">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "matrix"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <Grid className="w-4 h-4" />
          Matriks Probabilitas Bayes
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "rules"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <List className="w-4 h-4" />
          Tabel Kaidah Forward Chaining
        </button>
      </div>

      {/* --- TAB CONTENT 1: MATRIKS VIEW --- */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Legend / Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Daftar Penyakit */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#101022] shadow-md">
              <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-violet-400" />
                Kode Penyakit (Kolom Matriks)
              </h4>
              <div className="h-40 overflow-y-auto pr-2 space-y-2.5 text-sm">
                {diseases.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    <span className="font-mono font-bold text-violet-300 bg-violet-500/20 px-2.5 py-1 rounded-md border border-violet-500/40 text-xs">
                      {d.code}
                    </span>
                    <span className="text-gray-200 font-medium truncate ml-3">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Gejala */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#101022] shadow-md">
              <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-indigo-400" />
                Kode Gejala (Baris Matriks)
              </h4>
              <div className="h-40 overflow-y-auto pr-2 space-y-2.5 text-sm">
                {symptoms.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    <span className="font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/40 text-xs">
                      {s.code}
                    </span>
                    <span className="text-gray-200 font-medium truncate ml-3">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel Matriks */}
          <div className="rounded-2xl border border-slate-700 bg-[#101022] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b-2 border-slate-700 bg-slate-900 text-left">
                    <th className="px-6 py-4 font-bold text-gray-200 border-r border-slate-700 uppercase tracking-wider text-sm w-72">
                      Gejala \ Penyakit
                    </th>
                    {diseases.map((disease) => (
                      <th
                        key={disease.id}
                        className="px-6 py-4 font-mono font-bold text-violet-300 text-center uppercase tracking-wider text-sm border-r border-slate-700 last:border-r-0"
                        title={disease.name}
                      >
                        <span className="block text-sm">{disease.code}</span>
                        <span className="text-xs text-gray-400 font-sans font-normal truncate block max-w-xs mx-auto">
                          {disease.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {symptoms.map((symptom) => (
                    <tr key={symptom.id} className="hover:bg-white/[0.03] transition-colors">
                      <td
                        className="px-6 py-4 text-left border-r border-slate-800"
                        title={symptom.name}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/40 shrink-0">
                            {symptom.code}
                          </span>
                          <span className="text-sm font-medium text-gray-200 truncate">
                            {symptom.name}
                          </span>
                        </div>
                      </td>
                      {diseases.map((disease) => {
                        const prob = getRuleProbability(symptom.id, disease.id);
                        const isValue = prob !== "-";
                        const numVal = parseFloat(prob);
                        return (
                          <td key={disease.id} className="px-6 py-4 border-r border-slate-800/80 last:border-r-0">
                            {isValue ? (
                              <span
                                className={`inline-block px-3 py-1.5 rounded-xl font-mono font-bold text-sm shadow-sm ${
                                  numVal >= 0.7
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : numVal >= 0.4
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                }`}
                              >
                                {prob}
                              </span>
                            ) : (
                              <span className="text-gray-500 font-mono font-bold text-base">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: TABEL ATURAN (FORWARD CHAINING) --- */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Cari penyakit atau gejala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#121226] border border-slate-700/80 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>

          {/* List Per Penyakit */}
          <div className="grid grid-cols-1 gap-6">
            {Object.keys(groupedRules).length === 0 ? (
              <div className="p-14 rounded-2xl border border-slate-800 bg-[#101022] text-center text-gray-400">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-60" />
                <p className="text-base font-medium text-gray-200">Belum ada aturan diagnosis yang dibuat</p>
                <p className="text-xs text-gray-500 mt-1">Klik tombol "Tambah Aturan" di atas untuk menghubungkan gejala dengan penyakit</p>
              </div>
            ) : (
              Object.entries(groupedRules)
                .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([key, data]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-slate-800 bg-[#101022] overflow-hidden shadow-lg"
                  >
                    {/* Header Penyakit & Logika Base Rule */}
                    <div className="p-6 border-b border-slate-800 bg-white/[0.02]">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono font-bold text-xs text-violet-300 bg-violet-500/20 px-3 py-1 rounded-lg border border-violet-500/40">
                          {data.diseaseCode}
                        </span>
                        <h3 className="text-lg font-bold text-white">{data.diseaseName}</h3>
                        <span className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg ml-auto">
                          {data.items.length} Gejala Terkait
                        </span>
                      </div>

                      {/* Base Rule Box */}
                      <div className="p-4 rounded-xl bg-[#090914] border border-indigo-500/30">
                        <span className="font-bold text-indigo-400 block mb-1 text-xs uppercase tracking-wider">
                          Base Rule (Kaidah Inferensi Forward Chaining):
                        </span>
                        <p className="text-sm font-mono text-gray-200 break-words leading-relaxed">
                          {generateBaseRuleText(data.items, data.diseaseName)}
                        </p>
                      </div>
                    </div>

                    {/* Tabel Rincian Gejala & Bobot Bayes */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-700 bg-slate-900/90">
                            <th className="px-6 py-4 font-bold text-gray-300 uppercase tracking-wider text-xs w-28">
                              Kode
                            </th>
                            <th className="px-6 py-4 font-bold text-gray-300 uppercase tracking-wider text-xs">
                              Nama Gejala
                            </th>
                            <th className="px-6 py-4 font-bold text-gray-300 uppercase tracking-wider text-xs w-64">
                              Nilai Probabilitas P(G|H)
                            </th>
                            <th className="px-6 py-4 text-right font-bold text-gray-300 uppercase tracking-wider text-xs w-32">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {data.items.map((rule) => (
                            <tr key={rule.id} className="hover:bg-white/[0.03] transition-colors group">
                              <td className="px-6 py-4">
                                <span className="font-mono font-bold text-xs text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/40">
                                  {rule.symptom?.code}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-base font-semibold text-white">
                                {rule.symptom?.name}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono font-bold text-sm text-indigo-300 w-12">
                                    {rule.probability}
                                  </span>
                                  <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                                    <div
                                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full"
                                      style={{ width: `${Math.min(rule.probability * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleEdit(rule)}
                                    className="p-2 rounded-lg text-gray-300 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/20 border border-white/10 transition-all"
                                    title="Edit Nilai Bobot"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(rule.id)}
                                    className="p-2 rounded-lg text-gray-300 hover:text-red-300 bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all"
                                    title="Hapus Aturan"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e0e1e] border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full text-white overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {editingRule ? "Edit Aturan Probabilitas" : "Tambah Aturan Probabilitas Baru"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Penyakit Terkait *
                </label>
                <select
                  required
                  value={formData.diseaseId}
                  onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                  disabled={Boolean(editingRule)}
                >
                  <option value="" className="bg-[#14142a]">
                    Pilih Penyakit
                  </option>
                  {diseases.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#14142a]">
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Indikator Gejala *
                </label>
                <select
                  required
                  value={formData.symptomId}
                  onChange={(e) => setFormData({ ...formData, symptomId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                  disabled={Boolean(editingRule)}
                >
                  <option value="" className="bg-[#14142a]">
                    Pilih Gejala
                  </option>
                  {symptoms.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#14142a]">
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Nilai Probabilitas Bayes P(Gejala|Penyakit) (0.00 – 1.00) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  placeholder="Contoh: 0.8"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-500/25"
                >
                  {editingRule ? "Perbarui" : "Simpan Aturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
