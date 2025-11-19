export interface Dosen {
  id: string;
  nama: string;
  nip: string;
  foto: string;
  mataKuliah: string[];
  email: string;
  jabatan: string;
}

export interface Penilaian {
  id: string;
  dosenId: string;
  namaMahasiswa: string;
  kompetensiMengajar: number;
  penyampaianMateri: number;
  disiplinWaktu: number;
  interaksiSikap: number;
  komentar?: string;
  timestamp: string;
}

export interface HasilRanking {
  dosen: Dosen;
  nilaiTotal: number;
  persentase: number;
  ranking: number;
  kriteria: {
    kompetensiMengajar: number;
    penyampaianMateri: number;
    disiplinWaktu: number;
    interaksiSikap: number;
  };
  jumlahPenilai: number;
}

export interface Kriteria {
  nama: string;
  bobot: number;
  tipe: 'benefit' | 'cost';
}
