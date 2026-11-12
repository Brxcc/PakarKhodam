"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Activity, X } from "lucide-react";

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ code: "", name: "", description: "" });
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => { fetchSymptoms(); }, []);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const fetchSymptoms = async () => {
    try {
      const response = await fetch("/api/symptoms", { cache: "no-store" });
      if (!response.ok) throw new Error("Gagal mengambil data");
      const data = await response.json();
      setSymptoms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      setSymptoms([]);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSymptom ? `/api/symptoms/${editingSymptom.id}` : "/api/symptoms";
      const method = editingSymptom ? "PUT" : "POST";
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (response.ok) {
        fetchSymptoms();
        closeModal();
        showToast(editingSymptom ? "Gejala berhasil diupdate" : "Gejala berhasil ditambahkan");
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) { alert("Terjadi kesalahan"); }
  };

  const handleEdit = (symptom) => {
    setEditingSymptom(symptom);
    setFormData({ code: symptom.code, name: symptom.name, description: symptom.description || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus gejala ini?")) return;
    try {
      const response = await fetch(`/api/symptoms/${id}`, { method: "DELETE" });
      if (response.ok) { fetchSymptoms(); showToast("Gejala berhasil dihapus"); }
      else { const data = await response.json(); alert(data.error || "Terjadi kesalahan"); }
    } catch (error) { alert("Terjadi kesalahan"); }
  };

  const closeModal = () => { setShowModal(false); setEditingSymptom(null); setFormData({ code: "", name: "", description: "" }); };

  const filteredSymptoms = symptoms.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-xl shadow-indigo-500/30">
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kelola Data Gejala</h1>
          <p className="text-gray-300 mt-1.5 text-base">{symptoms.length} indikator gejala terdaftar dalam sistem pakar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4" />
          Tambah Gejala
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
        <input
          type="text"
          placeholder="Cari gejala berdasarkan kode atau nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#121226] border border-slate-700/80 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#101022] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/90 text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-300 uppercase tracking-wider w-28">Kode</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-300 uppercase tracking-wider w-72">Nama Gejala</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-300 uppercase tracking-wider">Deskripsi Klinis</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSymptoms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-14 text-center">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-60" />
                    <p className="text-gray-300 text-base font-medium">Tidak ada data gejala yang cocok</p>
                    <p className="text-gray-500 text-xs mt-1">Coba kata kunci pencarian lain atau tambahkan data gejala baru</p>
                  </td>
                </tr>
              ) : filteredSymptoms.map((symptom) => (
                <tr key={symptom.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4.5 align-top">
                    <span className="inline-block text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/40">
                      {symptom.code}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 align-top">
                    <span className="text-base font-semibold text-white block leading-snug">{symptom.name}</span>
                  </td>
                  <td className="px-6 py-4.5 align-top">
                    <p className="text-sm text-gray-300 leading-relaxed font-normal">{symptom.description || "—"}</p>
                  </td>
                  <td className="px-6 py-4.5 text-right align-top">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(symptom)}
                        className="p-2 rounded-lg text-gray-300 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/20 border border-white/10 transition-all"
                        title="Edit Gejala"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(symptom.id)}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-300 bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all"
                        title="Hapus Gejala"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e0e1e] border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full text-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">{editingSymptom ? "Edit Gejala" : "Tambah Gejala Baru"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">Kode Gejala *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Contoh: G01"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">Nama Gejala *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Contoh: Kesedihan berkepanjangan (>2 minggu)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">Deskripsi Klinis</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14142a] border border-slate-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                  rows="4"
                  placeholder="Deskripsi detail tentang bagaimana gejala ini dirasakan oleh pasien..."
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
                  {editingSymptom ? "Perbarui" : "Simpan Gejala"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
