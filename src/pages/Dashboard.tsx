import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { HasilRanking, Dosen, Penilaian } from '@/types/dosen';
import { hitungRankingDosen, getStatistikUmum, getRataRataPerKriteria, KRITERIA } from '@/lib/spk';
import { initializeDummyData } from '@/lib/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, TrendingUp, Users, Award, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

const Dashboard = () => {
  const [hasilRanking, setHasilRanking] = useState<HasilRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    initializeDummyData();
    const dosen: Dosen[] = JSON.parse(localStorage.getItem('dosen') || '[]');
    const penilaian: Penilaian[] = JSON.parse(localStorage.getItem('penilaian') || '[]');
    
    const hasil = hitungRankingDosen(dosen, penilaian);
    setHasilRanking(hasil);
    setLoading(false);
  };

  const handleResetPenilaian = () => {
    // Hapus semua penilaian menjadi kosong
    localStorage.setItem('penilaian', JSON.stringify([]));
    loadData();
    toast.success('Semua penilaian berhasil dihapus');
  };

  const statistik = getStatistikUmum(hasilRanking);
  const rataRataKriteria = getRataRataPerKriteria(hasilRanking);

  // Data untuk bar chart
  const barChartData = hasilRanking.map(h => ({
    nama: h.dosen.nama.split(',')[0],
    'Nilai Total': parseFloat(h.persentase.toFixed(2))
  }));

  // Data untuk pie chart
  const pieChartData = [
    { name: 'Kompetensi Mengajar', value: rataRataKriteria.kompetensiMengajar, bobot: KRITERIA[0].bobot },
    { name: 'Penyampaian Materi', value: rataRataKriteria.penyampaianMateri, bobot: KRITERIA[1].bobot },
    { name: 'Disiplin Waktu', value: rataRataKriteria.disiplinWaktu, bobot: KRITERIA[2].bobot },
    { name: 'Interaksi & Sikap', value: rataRataKriteria.interaksiSikap, bobot: KRITERIA[3].bobot }
  ];

  // Data untuk radar chart (top 3)
  const radarData = KRITERIA.map((k, i) => {
    const data: any = { kriteria: k.nama };
    hasilRanking.slice(0, 3).forEach(h => {
      const namaShort = h.dosen.nama.split(',')[0];
      const values = Object.values(h.kriteria);
      data[namaShort] = values[i];
    });
    return data;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold flex-1">Dashboard Ranking Dosen</h1>
            <div className="flex-1 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset Penilaian
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Semua Penilaian?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus semua data penilaian menjadi kosong (nilai 0). 
                      Semua penilaian yang telah diinput akan hilang dan tidak dapat dikembalikan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetPenilaian}>
                      Ya, Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Hasil analisis menggunakan metode Weighted Product (WP)
          </p>
        </div>

        {/* Statistik Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dosen Terbaik</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistik.dosenTerbaik ? statistik.dosenTerbaik.dosen.nama.split(',')[0] : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {statistik.dosenTerbaik ? `${statistik.dosenTerbaik.persentase.toFixed(2)}%` : '-'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Penilaian</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistik.totalPenilaian}</div>
              <p className="text-xs text-muted-foreground">Responden aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistik.rataRataKeseluruhan.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Performa keseluruhan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistik.totalDosen}</div>
              <p className="text-xs text-muted-foreground">Telah dinilai</p>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ranking Dosen</CardTitle>
            <CardDescription>Urutan berdasarkan perhitungan Weighted Product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Dosen</th>
                    <th className="text-center p-4 font-semibold">Kompetensi</th>
                    <th className="text-center p-4 font-semibold">Penyampaian</th>
                    <th className="text-center p-4 font-semibold">Disiplin</th>
                    <th className="text-center p-4 font-semibold">Interaksi</th>
                    <th className="text-center p-4 font-semibold">Nilai Total</th>
                    <th className="text-center p-4 font-semibold">Penilai</th>
                    <th className="text-center p-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {hasilRanking.map((hasil) => (
                    <tr key={hasil.dosen.id} className="border-b hover:bg-secondary/50 transition-colors">
                      <td className="p-4">
                        {hasil.ranking === 1 && <Badge className="bg-yellow-500">🥇 #{hasil.ranking}</Badge>}
                        {hasil.ranking === 2 && <Badge className="bg-gray-400">🥈 #{hasil.ranking}</Badge>}
                        {hasil.ranking === 3 && <Badge className="bg-orange-600">🥉 #{hasil.ranking}</Badge>}
                        {hasil.ranking > 3 && <Badge variant="outline">#{hasil.ranking}</Badge>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={hasil.dosen.foto} alt={hasil.dosen.nama} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-semibold">{hasil.dosen.nama}</div>
                            <div className="text-sm text-muted-foreground">{hasil.dosen.jabatan}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">{hasil.kriteria.kompetensiMengajar.toFixed(1)}</td>
                      <td className="p-4 text-center">{hasil.kriteria.penyampaianMateri.toFixed(1)}</td>
                      <td className="p-4 text-center">{hasil.kriteria.disiplinWaktu.toFixed(1)}</td>
                      <td className="p-4 text-center">{hasil.kriteria.interaksiSikap.toFixed(1)}</td>
                      <td className="p-4 text-center">
                        <Badge className="text-base">{hasil.persentase.toFixed(2)}%</Badge>
                      </td>
                      <td className="p-4 text-center">{hasil.jumlahPenilai}</td>
                      <td className="p-4 text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/profil/${hasil.dosen.id}`}>Lihat</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Nilai Total</CardTitle>
              <CardDescription>Grafik nilai akhir setiap dosen</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Nilai Total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rata-rata per Kriteria</CardTitle>
              <CardDescription>Distribusi nilai kriteria penilaian</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        {hasilRanking.length >= 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Top 3 Dosen</CardTitle>
              <CardDescription>Analisis detail kriteria dosen terbaik</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="kriteria" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  {hasilRanking.slice(0, 3).map((h, idx) => (
                    <Radar
                      key={h.dosen.id}
                      name={h.dosen.nama.split(',')[0]}
                      dataKey={h.dosen.nama.split(',')[0]}
                      stroke={COLORS[idx]}
                      fill={COLORS[idx]}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Informasi Metode */}
        <Card className="mt-8 bg-secondary/50">
          <CardHeader>
            <CardTitle>Tentang Metode Weighted Product (WP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Weighted Product (WP)</strong> adalah metode pengambilan keputusan multi-kriteria yang menggunakan perkalian untuk menghubungkan rating atribut, dimana rating setiap atribut harus dipangkatkan dengan bobot atribut yang bersangkutan.
            </p>
            <div>
              <strong>Bobot Kriteria yang Digunakan:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {KRITERIA.map(k => (
                  <li key={k.nama}>
                    <strong>{k.nama}</strong>: {(k.bobot * 100).toFixed(0)}%
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Formula: S = (X₁^W₁) × (X₂^W₂) × (X₃^W₃) × (X₄^W₄)
              <br />
              Dimana S adalah nilai preferensi, X adalah nilai kriteria, dan W adalah bobot kriteria.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
