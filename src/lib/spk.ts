import { Penilaian, Dosen, HasilRanking, Kriteria } from '@/types/dosen';

// Bobot kriteria untuk metode Weighted Product
export const KRITERIA: Kriteria[] = [
  { nama: 'Kompetensi Mengajar', bobot: 0.30, tipe: 'benefit' },
  { nama: 'Penyampaian Materi', bobot: 0.25, tipe: 'benefit' },
  { nama: 'Disiplin Waktu', bobot: 0.25, tipe: 'benefit' },
  { nama: 'Interaksi & Sikap', bobot: 0.20, tipe: 'benefit' }
];

/**
 * Metode Weighted Product (WP) untuk ranking dosen
 * Formula: S = Π (Xi^Wi) untuk setiap kriteria
 * Xi = nilai kriteria ke-i
 * Wi = bobot kriteria ke-i
 */
export const hitungRankingDosen = (
  daftarDosen: Dosen[],
  daftarPenilaian: Penilaian[]
): HasilRanking[] => {
  const hasilRanking: HasilRanking[] = [];

  daftarDosen.forEach(dosen => {
    // Filter penilaian untuk dosen ini
    const penilaianDosen = daftarPenilaian.filter(p => p.dosenId === dosen.id);
    
    if (penilaianDosen.length === 0) {
      // Skip dosen yang belum ada penilaian
      return;
    }

    // Hitung rata-rata setiap kriteria
    const rataKompetensi = penilaianDosen.reduce((sum, p) => sum + p.kompetensiMengajar, 0) / penilaianDosen.length;
    const rataPenyampaian = penilaianDosen.reduce((sum, p) => sum + p.penyampaianMateri, 0) / penilaianDosen.length;
    const rataDisiplin = penilaianDosen.reduce((sum, p) => sum + p.disiplinWaktu, 0) / penilaianDosen.length;
    const rataInteraksi = penilaianDosen.reduce((sum, p) => sum + p.interaksiSikap, 0) / penilaianDosen.length;

    // Normalisasi nilai (0-10 menjadi 0-1)
    const normKompetensi = rataKompetensi / 10;
    const normPenyampaian = rataPenyampaian / 10;
    const normDisiplin = rataDisiplin / 10;
    const normInteraksi = rataInteraksi / 10;

    // Hitung nilai S menggunakan Weighted Product
    // S = (X1^W1) * (X2^W2) * (X3^W3) * (X4^W4)
    const nilaiS = Math.pow(normKompetensi, KRITERIA[0].bobot) *
                   Math.pow(normPenyampaian, KRITERIA[1].bobot) *
                   Math.pow(normDisiplin, KRITERIA[2].bobot) *
                   Math.pow(normInteraksi, KRITERIA[3].bobot);

    // Konversi ke skala 0-100 untuk presentasi
    const nilaiTotal = nilaiS * 100;
    const persentase = nilaiTotal;

    hasilRanking.push({
      dosen,
      nilaiTotal,
      persentase,
      ranking: 0, // akan diset setelah sorting
      kriteria: {
        kompetensiMengajar: rataKompetensi,
        penyampaianMateri: rataPenyampaian,
        disiplinWaktu: rataDisiplin,
        interaksiSikap: rataInteraksi
      },
      jumlahPenilai: penilaianDosen.length
    });
  });

  // Sort berdasarkan nilai total (descending)
  hasilRanking.sort((a, b) => b.nilaiTotal - a.nilaiTotal);

  // Set ranking
  hasilRanking.forEach((hasil, index) => {
    hasil.ranking = index + 1;
  });

  return hasilRanking;
};

/**
 * Get statistik umum dari hasil ranking
 */
export const getStatistikUmum = (hasilRanking: HasilRanking[]) => {
  if (hasilRanking.length === 0) {
    return {
      dosenTerbaik: null,
      rataRataKeseluruhan: 0,
      totalPenilaian: 0,
      totalDosen: 0
    };
  }

  const totalPenilaian = hasilRanking.reduce((sum, h) => sum + h.jumlahPenilai, 0);
  const rataRataKeseluruhan = hasilRanking.reduce((sum, h) => sum + h.persentase, 0) / hasilRanking.length;

  return {
    dosenTerbaik: hasilRanking[0],
    rataRataKeseluruhan,
    totalPenilaian,
    totalDosen: hasilRanking.length
  };
};

/**
 * Get rata-rata per kriteria untuk semua dosen
 */
export const getRataRataPerKriteria = (hasilRanking: HasilRanking[]) => {
  if (hasilRanking.length === 0) {
    return {
      kompetensiMengajar: 0,
      penyampaianMateri: 0,
      disiplinWaktu: 0,
      interaksiSikap: 0
    };
  }

  const total = hasilRanking.length;
  
  return {
    kompetensiMengajar: hasilRanking.reduce((sum, h) => sum + h.kriteria.kompetensiMengajar, 0) / total,
    penyampaianMateri: hasilRanking.reduce((sum, h) => sum + h.kriteria.penyampaianMateri, 0) / total,
    disiplinWaktu: hasilRanking.reduce((sum, h) => sum + h.kriteria.disiplinWaktu, 0) / total,
    interaksiSikap: hasilRanking.reduce((sum, h) => sum + h.kriteria.interaksiSikap, 0) / total
  };
};
