import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dosen, Penilaian, HasilRanking } from '@/types/dosen';
import { hitungRankingDosen } from '@/lib/spk';
import { initializeDummyData } from '@/lib/dummyData';
import { ArrowLeft, Mail, BookOpen, Award, MessageSquare } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const ProfilDosen = () => {
  const { id } = useParams<{ id: string }>();
  const [dosen, setDosen] = useState<Dosen | null>(null);
  const [penilaianDosen, setPenilaianDosen] = useState<Penilaian[]>([]);
  const [hasilRanking, setHasilRanking] = useState<HasilRanking | null>(null);

  useEffect(() => {
    initializeDummyData();
    const daftarDosen: Dosen[] = JSON.parse(localStorage.getItem('dosen') || '[]');
    const daftarPenilaian: Penilaian[] = JSON.parse(localStorage.getItem('penilaian') || '[]');
    
    const dosenData = daftarDosen.find(d => d.id === id);
    setDosen(dosenData || null);

    if (dosenData) {
      const penilaian = daftarPenilaian.filter(p => p.dosenId === id);
      setPenilaianDosen(penilaian);

      const ranking = hitungRankingDosen(daftarDosen, daftarPenilaian);
      const hasilDosen = ranking.find(r => r.dosen.id === id);
      setHasilRanking(hasilDosen || null);
    }
  }, [id]);

  if (!dosen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Dosen tidak ditemukan</h2>
          <Button asChild>
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Data untuk radar chart
  const radarData = hasilRanking ? [
    { kriteria: 'Kompetensi', nilai: hasilRanking.kriteria.kompetensiMengajar },
    { kriteria: 'Penyampaian', nilai: hasilRanking.kriteria.penyampaianMateri },
    { kriteria: 'Disiplin', nilai: hasilRanking.kriteria.disiplinWaktu },
    { kriteria: 'Interaksi', nilai: hasilRanking.kriteria.interaksiSikap }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>

        {/* Header Profile */}
        <Card className="mb-8 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img 
                src={dosen.foto} 
                alt={dosen.nama} 
                className="w-32 h-32 rounded-full shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{dosen.nama}</h1>
                    <Badge className="mb-2">{dosen.jabatan}</Badge>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span>{dosen.email}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">NIP: {dosen.nip}</div>
                  </div>
                  {hasilRanking && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Ranking</div>
                      <div className="text-4xl font-bold text-primary">#{hasilRanking.ranking}</div>
                      <div className="text-sm font-semibold text-primary">{hasilRanking.persentase.toFixed(2)}%</div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <strong>Mata Kuliah:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dosen.mataKuliah.map((mk, idx) => (
                        <Badge key={idx} variant="secondary">{mk}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {hasilRanking && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Kompetensi Mengajar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {hasilRanking.kriteria.kompetensiMengajar.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">dari 10.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Penyampaian Materi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {hasilRanking.kriteria.penyampaianMateri.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">dari 10.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Disiplin Waktu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {hasilRanking.kriteria.disiplinWaktu.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">dari 10.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Interaksi & Sikap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {hasilRanking.kriteria.interaksiSikap.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">dari 10.0</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Radar Chart */}
        {hasilRanking && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analisis Performa</CardTitle>
              <CardDescription>Visualisasi nilai per kriteria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="kriteria" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name={dosen.nama.split(',')[0]}
                    dataKey="nilai"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Komentar Mahasiswa */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Komentar Mahasiswa</CardTitle>
            </div>
            <CardDescription>
              {penilaianDosen.length} penilaian dari mahasiswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {penilaianDosen.length > 0 ? (
              <div className="space-y-4">
                {penilaianDosen.map((p) => (
                  p.komentar && (
                    <div key={p.id} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{p.namaMahasiswa}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(p.timestamp).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{p.komentar}</p>
                    </div>
                  )
                ))}
                {penilaianDosen.filter(p => p.komentar).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Belum ada komentar dari mahasiswa
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Belum ada penilaian untuk dosen ini
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilDosen;
