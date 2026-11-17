# 🔮 PakarKhodam — Sistem Pakar Diagnosis Kesehatan Mental

Aplikasi Sistem Pakar (*Expert System*) berbasis web modern untuk skrining dan diagnosis awal masalah kesehatan mental menggunakan kombinasi metode **Forward Chaining** (penalaran kaidah gejala) dan **Teorema Bayes** (perhitungan probabilitas keyakinan matematis).

---

## ✨ Fitur Utama

- **🔮 Skrining & Terawang Gejala**: Kuesioner interaktif untuk memilih gejala yang dialami pasien.
- **📊 Analisis Probabilitas Bayes**: Visualisasi hasil probabilitas kondisi mental tertinggi ke terendah dalam bentuk grafik interaktif (Recharts).
- **🔒 Panel Administrator**:
  - **Dashboard**: Statistik ringkas penyakit, gejala, aturan, dan konsultasi.
  - **Kelola Penyakit**: CRUD data penyakit mental (Depresi Mayor, GAD, Gangguan Panik, dll).
  - **Kelola Gejala**: CRUD data indikator gejala klinis.
  - **Basis Pengetahuan**: Visualisasi matriks probabilitas Bayes dan kaidah inferensi Forward Chaining (*IF ... THEN*).

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Recharts
- **Database & ORM**: SQLite, [Prisma ORM](https://www.prisma.io/) dengan Driver Adapter `better-sqlite3`
- **Autentikasi**: JWT (JSON Web Token) & bcryptjs

---

## 🚀 Panduan Memulai (*Quick Start*)

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi pada berkas `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="pakarkhodam-super-secret-key-jwt"
```

### 4. Setup Database & Seeding
Jalankan migrasi database dan masukkan data awal (*seed*):
```bash
npx prisma db push
npm run prisma:seed
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

---

## 👤 Akun Admin Default

- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Akses Panel**: [http://localhost:3000/login](http://localhost:3000/login)

---

## ⚠️ Disclaimer Medis

Aplikasi ini ditujukan untuk tujuan edukasi, penelitian, dan rujukan awal (*early screening*). Hasil diagnosis sistem pakar ini tidak menggantikan konsultasi medis langsung dengan psikolog atau psikiater berlisensi.
