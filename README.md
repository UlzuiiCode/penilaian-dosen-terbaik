# Sistem Penilaian Dosen Terbaik 🎓

Website interaktif untuk membantu mahasiswa memberikan penilaian terhadap dosen, kemudian sistem **SPK (Sistem Pendukung Keputusan)** otomatis menghitung **peringkat dosen terbaik** menggunakan metode **Weighted Product (WP)**.

Website ini dibangun dengan tampilan **modern, minimalis, responsif**, dan mengutamakan **user experience yang bersih**. Warna utama: **biru–putih** dengan animasi ringan.

---

## 🎯 Tujuan Sistem

- Memberikan sarana bagi mahasiswa untuk menilai dosen secara objektif.
- Mengolah penilaian mahasiswa menggunakan **metode SPK (Weighted Product)**.
- Menampilkan **ranking dosen terbaik** berdasarkan beberapa kriteria penilaian.

---

## 🧠 Metode SPK yang Digunakan: Weighted Product (WP)

Metode **Weighted Product (WP)** digunakan untuk menghitung skor akhir masing-masing dosen berdasarkan bobot kriteria:

- **Kompetensi Mengajar**
- **Penyampaian Materi**
- **Disiplin Waktu**
- **Interaksi & Sikap**

Secara singkat, langkah perhitungannya:

1. Menentukan bobot tiap kriteria (misal: Kompetensi 0.3, Penyampaian 0.3, Disiplin 0.2, Interaksi 0.2).
2. Menormalisasi bobot agar total = 1.
3. Menghitung nilai \( S_i \) tiap dosen dengan:
   \[
   S_i = \prod_{j} (x_{ij})^{w_j}
   \]
   di mana:
   - \( x_{ij} \) = nilai rata-rata dosen ke-i pada kriteria ke-j  
   - \( w_j \) = bobot kriteria ke-j
4. Menghitung nilai preferensi:
   \[
   V_i = \frac{S_i}{\sum S_i}
   \]
5. Mengurutkan dosen berdasarkan nilai \( V_i \) (semakin besar, semakin baik).

Output:
- **Ranking otomatis dosen**
- **Nilai total & persentase performa**
- **Rata-rata tiap kriteria**

---

## ✨ Fitur Utama

### 1. AI Decision Support System (SPK) – Auto Ranking Dosen Terbaik

- Menggunakan metode **Weighted Product (WP)**.
- Menghitung:
  - Nilai rata-rata tiap kriteria per dosen
  - Skor WP & persentase performa
  - **Ranking dosen terbaik** secara otomatis
- Hasil ditampilkan dalam:
  - **Tabel ranking dosen**
  - **Grafik (Bar / Pie) perbandingan nilai**

---

### 2. Landing Page

- Judul: **"Sistem Penilaian Dosen Terbaik"**
- Deskripsi singkat tujuan sistem.
- Tombol CTA: **"Mulai Menilai"**.
- Ilustrasi bertema pendidikan/kampus modern.
- Desain minimalis dengan warna **biru–putih** dan animasi hover/scroll ringan.

---

### 3. Halaman Form Penilaian Dosen

Mahasiswa dapat:

- Mengisi **nama mahasiswa**
- Memilih **dosen** dari dropdown
- Memberikan nilai:
  - Kompetensi Mengajar
  - Penyampaian Materi
  - Disiplin Waktu
  - Interaksi & Sikap

Format input:
- Slider (1–5) atau rating bintang (1–5).
- Kolom **komentar** (opsional).
- Validasi input sebelum submit.
- Notifikasi sukses setelah penilaian tersimpan.

Data penilaian disimpan di:

- **LocalStorage** (default, untuk demo & prototipe), atau
- Basis data (MongoDB/Firebase) jika diintegrasikan lebih lanjut.

---

### 4. Dashboard / Hasil Penilaian

Menampilkan:

- **Tabel ranking dosen** berdasarkan hasil SPK.
- **Grafik (Chart.js / Recharts)**:
  - Rata-rata tiap kriteria per dosen.
  - Perbandingan performa dosen.
- Statistik ringkas:
  - Dosen dengan nilai tertinggi.
  - Jumlah penilai.
  - Nilai rata-rata keseluruhan.

---

### 5. Halaman Profil Dosen

Untuk setiap dosen:

- Foto profil & biodata singkat.
- Mata kuliah yang diajar.
- Rekap nilai rata-rata tiap kriteria.
- Komentar mahasiswa (review).
- (Opsional) **Grafik radar** skill dosen.

---

## 🧱 Teknologi yang Digunakan

Proyek ini dibangun dengan:

- **Vite**
- **React + TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (komponen UI modern)
- **Recharts / Chart.js** untuk visualisasi grafik
- **LocalStorage** untuk penyimpanan sederhana di browser

---

## 📁 Struktur Folder (Ringkas)

```bash
src/
  components/
    Layout/
    LandingPage/
    RatingForm/
    Dashboard/
    LecturerProfile/
  data/
    lecturers.ts       # Dummy data dosen
  utils/
    wp.ts              # Perhitungan metode Weighted Product
  hooks/
    useRatings.ts      # (opsional) manajemen state penilaian
  App.tsx
  main.tsx
