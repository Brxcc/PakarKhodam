"use client";

import { useEffect, useState } from "react";
import { Stethoscope, Activity, BookOpen, Users, Database, ArrowUpRight, Cpu } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ diseases: 0, symptoms: 0, rules: 0, consultations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [diseasesRes, symptomsRes, rulesRes, consultationsRes] = await Promise.all([
        fetch("/api/diseases", { cache: "no-store" }),
        fetch("/api/symptoms", { cache: "no-store" }),
        fetch("/api/rules", { cache: "no-store" }),
        fetch("/api/consultations", { cache: "no-store" }),
      ]);
      const diseases = await diseasesRes.json();
      const symptoms = await symptomsRes.json();
      const rules = await rulesRes.json();
      const consultations = await consultationsRes.json();
      setStats({
        diseases: Array.isArray(diseases) ? diseases.length : 0,
        symptoms: Array.isArray(symptoms) ? symptoms.length : 0,
        rules: Array.isArray(rules) ? rules.length : 0,
        consultations: Array.isArray(consultations) ? consultations.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Penyakit", value: stats.diseases, icon: Stethoscope, color: "indigo", href: "/admin/diseases" },
    { title: "Total Gejala", value: stats.symptoms, icon: Activity, color: "violet", href: "/admin/symptoms" },
    { title: "Aturan Bayes", value: stats.rules, icon: BookOpen, color: "blue", href: "/admin/rules" },
    { title: "Total Konsultasi", value: stats.consultations, icon: Users, color: "emerald", href: null },
  ];

  const colorMap = {
    indigo: { bg: "bg-indigo-500/15 border-indigo-500/30", icon: "text-indigo-400", text: "text-indigo-300", glow: "from-indigo-600/15" },
    violet: { bg: "bg-violet-500/15 border-violet-500/30", icon: "text-violet-400", text: "text-violet-300", glow: "from-violet-600/15" },
    blue: { bg: "bg-blue-500/15 border-blue-500/30", icon: "text-blue-400", text: "text-blue-300", glow: "from-blue-600/15" },
    emerald: { bg: "bg-emerald-500/15 border-emerald-500/30", icon: "text-emerald-400", text: "text-emerald-300", glow: "from-emerald-600/15" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-300 mt-1.5 text-base font-normal">
          Pantau status basis pengetahuan, gejala, penyakit, dan riwayat diagnosis sistem pakar
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          const CardWrapper = stat.href ? Link : "div";
          return (
            <CardWrapper
              key={stat.title}
              href={stat.href || undefined}
              className={`group relative p-6 rounded-2xl border border-slate-800 bg-[#101022] hover:border-slate-700 hover:bg-[#14142a] transition-all duration-300 shadow-md ${
                stat.href ? "cursor-pointer hover:-translate-y-1" : ""
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${c.bg}`}>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  {stat.href && (
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-300 mb-1">{stat.title}</p>
                <p className={`text-4xl font-extrabold ${c.text}`}>{stat.value}</p>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      {/* Info Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Algorithm Info */}
        <div className="p-7 rounded-2xl border border-slate-800 bg-[#101022] shadow-md">
          <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Metode Sistem Pakar</h3>
              <p className="text-xs text-gray-400">Kombinasi Forward Chaining dan Teorema Bayes</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <p>
              Sistem menggunakan metode hibrida untuk menghasilkan diagnosis yang akurat:
            </p>
            <div className="space-y-3 mt-4">
              {[
                { step: "01", label: "Forward Chaining", desc: "Mencocokkan gejala pasien dengan basis aturan untuk menyaring kandidat penyakit yang relevan" },
                { step: "02", label: "Teorema Bayes", desc: "Menghitung nilai probabilitas matematis dari setiap gejala berdasarkan bobot keyakinan pakar" },
                { step: "03", label: "Ranking & Rekomendasi", desc: "Mengurutkan kemungkinan penyakit dari persentase tertinggi sebagai hasil rujukan awal" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-1 rounded-md mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.label}</p>
                    <p className="text-xs text-gray-300 mt-1 leading-normal">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-7 rounded-2xl border border-slate-800 bg-[#101022] shadow-md">
          <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30">
              <Database className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Kelola Basis Pengetahuan</h3>
              <p className="text-xs text-gray-400">Pintasan navigasi data master sistem pakar</p>
            </div>
          </div>
          <div className="space-y-3.5">
            {[
              { href: "/admin/diseases", label: "Kelola Data Penyakit", desc: `${stats.diseases} jenis penyakit mental terdaftar`, color: "indigo" },
              { href: "/admin/symptoms", label: "Kelola Data Gejala", desc: `${stats.symptoms} indikator gejala medis terdaftar`, color: "violet" },
              { href: "/admin/rules", label: "Matriks & Aturan Bayes", desc: `${stats.rules} relasi probabilitas gejala ke penyakit`, color: "blue" },
            ].map((item) => {
              const c = colorMap[item.color];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-indigo-500/40 bg-white/[0.03] hover:bg-indigo-950/20 transition-all duration-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 group-hover:text-indigo-300 transition-colors">
                    <span>Buka</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
