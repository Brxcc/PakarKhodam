"use client";

import Link from "next/link";
import { Brain, Stethoscope, ChartBar, Shield, ArrowRight, Zap, Lock, Activity, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-hidden">
      {/* Orb decorations */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[128px] opacity-10 pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-violet-600 rounded-full filter blur-[128px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full filter blur-[128px] opacity-8 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PakarKhodam</span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/consultation" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
                Konsultasi
              </Link>
              <Link
                href="/login"
                className="px-4.5 py-2 text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 text-sm font-semibold mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Bukan Dukun Online — Murni Teorema Bayes & Forward Chaining
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Terawang Dini{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Kesehatan Mental
                </span>
              </span>
              <br />Secara Ilmiah
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Sistem pakar yang siap menerawang &apos;khodam&apos; overthinking dan beban mental Anda secara ilmiah dengan Teorema Bayes. Bukan mistis atau dukun online—ini murni probabilitas matematika! Konsultasi gratis, hasil instan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold text-base transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Mulai Terawang Gejala
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white rounded-xl font-semibold text-base transition-all duration-300"
              >
                Cara Kerja
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { value: "0 Dukun", label: "100% Sains Bayes" },
              { value: "3+", label: "Kondisi Terdeteksi" },
              { value: "100%", label: "Gratis Tanpa Sesajen" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/8">
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Mengapa PakarKhodam?</h2>
            <p className="text-gray-300 max-w-xl mx-auto text-base">
              Menghilangkan stigma kesehatan mental dengan pendekatan kultural yang santai, namun berlandaskan metode kecerdasan buatan resmi.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Stethoscope,
                title: "Diagnosis Akurat & Matematis",
                desc: "Menggunakan Teorema Bayes untuk menghitung probabilitas diagnosis dengan tingkat kepercayaan tinggi berdasarkan kombinasi gejala yang Anda alami.",
                color: "from-indigo-500/20 to-indigo-600/5",
                iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
              },
              {
                icon: Activity,
                title: "Visualisasi Probabilitas Transparan",
                desc: "Menampilkan hasil kalkulasi dalam grafik batang interaktif, diurutkan dari persentase kecenderungan kondisi tertinggi ke terendah.",
                color: "from-violet-500/20 to-violet-600/5",
                iconBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
              },
              {
                icon: Lock,
                title: "Aman, Privat, Tanpa Stigma",
                desc: "Data konsultasi Anda terlindungi. Berfungsi sebagai skrining rujukan awal yang nyaman sebelum Anda berkonsultasi lebih lanjut ke psikolog profesional.",
                color: "from-blue-500/20 to-blue-600/5",
                iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`relative p-7 rounded-2xl border border-white/10 bg-gradient-to-br ${f.color} hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className={`inline-flex p-3 rounded-xl border ${f.iconBg} mb-5`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Cara Kerja Sistem</h2>
            <p className="text-gray-300 text-base">3 langkah mudah dari mengenali gejala hingga melihat hasil analisis</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { step: "01", title: "Pilih Gejala yang Dirasakan", desc: "Isi data diri opsional lalu centang indikator gejala emosional atau fisik yang sedang Anda alami." },
                { step: "02", title: "Inferensi & Hitung Bayes", desc: "Forward Chaining menyaring kelompok penyakit terkait, lalu Teorema Bayes mengkalkulasi probabilitas kondisinya." },
                { step: "03", title: "Lihat Hasil & Rekomendasi", desc: "Dapatkan persentase diagnosis awal lengkap dengan grafik visual dan catatan penting untuk tindak lanjut." },
              ].map((s) => (
                <div key={s.step} className="text-center relative">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6 shadow-md">
                      <span className="text-2xl font-black text-indigo-300">{s.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-300 mb-2 text-base">Disclaimer Medis Resmi</h3>
                <div className="space-y-2 text-sm text-amber-200/80 leading-relaxed">
                  <p>⚠️ Istilah &apos;PakarKhodam&apos; adalah metafora edukatif ramah pengguna. Hasil sistem ini bersifat <strong className="text-amber-200">skrining awal</strong> dan tidak menggantikan diagnosis klinis dokter, psikiater, atau psikolog.</p>
                  <p>✅ Jika gejala mengganggu produktivitas atau keseharian Anda, sangat dianjurkan untuk berkonsultasi langsung dengan profesional kesehatan mental berlisensi.</p>
                  <p>📞 <strong className="text-amber-200">Bantuan Darurat:</strong> Hubungi Hotline Kesehatan Jiwa Kemenkes 119 (ext. 8) jika Anda atau kerabat membutuhkan bantuan krisis segera.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">PakarKhodam</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 PakarKhodam — Sistem Pakar Diagnosis Kesehatan Mental</p>
          <p className="text-xs text-indigo-400 font-mono">Teorema Bayes + Forward Chaining</p>
        </div>
      </footer>
    </div>
  );
}
