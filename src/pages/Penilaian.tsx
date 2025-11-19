import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import type { Dosen, Penilaian as PenilaianType } from '@/types/dosen';
import { initializeDummyData } from '@/lib/dummyData';
import { Send } from 'lucide-react';

const Penilaian = () => {
  const [daftarDosen, setDaftarDosen] = useState<Dosen[]>([]);
  const [selectedDosenId, setSelectedDosenId] = useState<string>('');
  const [namaMahasiswa, setNamaMahasiswa] = useState('');
  const [kompetensiMengajar, setKompetensiMengajar] = useState([8]);
  const [penyampaianMateri, setPenyampaianMateri] = useState([8]);
  const [disiplinWaktu, setDisiplinWaktu] = useState([8]);
  const [interaksiSikap, setInteraksiSikap] = useState([8]);
  const [komentar, setKomentar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeDummyData();
    const dosen = JSON.parse(localStorage.getItem('dosen') || '[]');
    setDaftarDosen(dosen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!namaMahasiswa.trim()) {
      toast({
        title: 'Error',
        description: 'Nama mahasiswa harus diisi',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedDosenId) {
      toast({
        title: 'Error',
        description: 'Pilih dosen terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    const penilaianBaru: PenilaianType = {
      id: `P${Date.now()}`,
      dosenId: selectedDosenId,
      namaMahasiswa: namaMahasiswa.trim(),
      kompetensiMengajar: kompetensiMengajar[0],
      penyampaianMateri: penyampaianMateri[0],
      disiplinWaktu: disiplinWaktu[0],
      interaksiSikap: interaksiSikap[0],
      komentar: komentar.trim(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const existingPenilaian = JSON.parse(localStorage.getItem('penilaian') || '[]');
    existingPenilaian.push(penilaianBaru);
    localStorage.setItem('penilaian', JSON.stringify(existingPenilaian));

    toast({
      title: 'Berhasil!',
      description: 'Penilaian Anda telah tersimpan. Terima kasih!',
    });

    // Reset form
    setNamaMahasiswa('');
    setSelectedDosenId('');
    setKompetensiMengajar([8]);
    setPenyampaianMateri([8]);
    setDisiplinWaktu([8]);
    setInteraksiSikap([8]);
    setKomentar('');
    setIsSubmitting(false);
  };

  const selectedDosen = daftarDosen.find(d => d.id === selectedDosenId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Form Penilaian Dosen</h1>
          <p className="text-lg text-muted-foreground">
            Berikan penilaian objektif untuk membantu meningkatkan kualitas pendidikan
          </p>
        </div>

        <Card className="shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle>Data Penilaian</CardTitle>
            <CardDescription>
              Isi semua kriteria penilaian dengan skala 1-10
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Mahasiswa */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Mahasiswa *</Label>
                <Input
                  id="nama"
                  placeholder="Masukkan nama lengkap Anda"
                  value={namaMahasiswa}
                  onChange={(e) => setNamaMahasiswa(e.target.value)}
                  required
                />
              </div>

              {/* Pilih Dosen */}
              <div className="space-y-2">
                <Label htmlFor="dosen">Pilih Dosen *</Label>
                <Select value={selectedDosenId} onValueChange={setSelectedDosenId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dosen yang akan dinilai" />
                  </SelectTrigger>
                  <SelectContent>
                    {daftarDosen.map((dosen) => (
                      <SelectItem key={dosen.id} value={dosen.id}>
                        {dosen.nama} - {dosen.mataKuliah.join(', ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDosen && (
                <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <img src={selectedDosen.foto} alt={selectedDosen.nama} className="w-16 h-16 rounded-full" />
                      <div>
                        <div className="font-semibold">{selectedDosen.nama}</div>
                        <div className="text-sm text-muted-foreground">{selectedDosen.jabatan}</div>
                        <div className="text-sm text-muted-foreground">{selectedDosen.mataKuliah.join(', ')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Kriteria Penilaian */}
              <div className="space-y-6 border-t pt-6">
                <h3 className="font-semibold text-lg">Kriteria Penilaian</h3>

                {/* Kompetensi Mengajar */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Kompetensi Mengajar</Label>
                    <span className="text-2xl font-bold text-primary">{kompetensiMengajar[0]}</span>
                  </div>
                  <Slider
                    value={kompetensiMengajar}
                    onValueChange={setKompetensiMengajar}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Kemampuan dosen dalam menguasai dan menyampaikan materi perkuliahan
                  </p>
                </div>

                {/* Penyampaian Materi */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Penyampaian Materi</Label>
                    <span className="text-2xl font-bold text-primary">{penyampaianMateri[0]}</span>
                  </div>
                  <Slider
                    value={penyampaianMateri}
                    onValueChange={setPenyampaianMateri}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Kejelasan dan kemudahan pemahaman dalam menyampaikan materi
                  </p>
                </div>

                {/* Disiplin Waktu */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Disiplin Waktu</Label>
                    <span className="text-2xl font-bold text-primary">{disiplinWaktu[0]}</span>
                  </div>
                  <Slider
                    value={disiplinWaktu}
                    onValueChange={setDisiplinWaktu}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Ketepatan waktu mulai dan selesai perkuliahan
                  </p>
                </div>

                {/* Interaksi & Sikap */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Interaksi & Sikap</Label>
                    <span className="text-2xl font-bold text-primary">{interaksiSikap[0]}</span>
                  </div>
                  <Slider
                    value={interaksiSikap}
                    onValueChange={setInteraksiSikap}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Sikap ramah, responsif, dan interaktif dengan mahasiswa
                  </p>
                </div>
              </div>

              {/* Komentar */}
              <div className="space-y-2">
                <Label htmlFor="komentar">Komentar (Opsional)</Label>
                <Textarea
                  id="komentar"
                  placeholder="Berikan komentar atau saran tambahan..."
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Penilaian'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Penilaian;
