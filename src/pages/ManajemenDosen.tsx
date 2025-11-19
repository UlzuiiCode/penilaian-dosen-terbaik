import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dosen } from '@/types/dosen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, UserCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const dosenSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  nip: z.string().min(10, 'NIP minimal 10 karakter').max(20, 'NIP maksimal 20 karakter'),
  email: z.string().email('Email tidak valid'),
  jabatan: z.string().min(3, 'Jabatan minimal 3 karakter'),
  mataKuliah: z.string().min(3, 'Mata kuliah minimal 3 karakter'),
  foto: z.string().url('URL foto tidak valid').optional().or(z.literal('')),
});

type DosenFormData = z.infer<typeof dosenSchema>;

const ManajemenDosen = () => {
  const navigate = useNavigate();
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDosen, setEditingDosen] = useState<Dosen | null>(null);

  const form = useForm<DosenFormData>({
    resolver: zodResolver(dosenSchema),
    defaultValues: {
      nama: '',
      nip: '',
      email: '',
      jabatan: '',
      mataKuliah: '',
      foto: '',
    },
  });

  useEffect(() => {
    loadDosen();
  }, []);

  const loadDosen = () => {
    const storedDosen = localStorage.getItem('dosen');
    if (storedDosen) {
      setDosenList(JSON.parse(storedDosen));
    }
  };

  const saveDosen = (dosen: Dosen[]) => {
    localStorage.setItem('dosen', JSON.stringify(dosen));
    setDosenList(dosen);
  };

  const handleSubmit = (data: DosenFormData) => {
    const mataKuliahArray = data.mataKuliah.split(',').map(mk => mk.trim()).filter(mk => mk !== '');
    
    if (editingDosen) {
      // Update existing dosen
      const updatedDosen = dosenList.map(d => 
        d.id === editingDosen.id 
          ? { 
              ...d, 
              nama: data.nama,
              nip: data.nip,
              email: data.email,
              jabatan: data.jabatan,
              mataKuliah: mataKuliahArray,
              foto: data.foto || d.foto,
            }
          : d
      );
      saveDosen(updatedDosen);
      toast.success('Dosen berhasil diperbarui');
    } else {
      // Create new dosen
      const newDosen: Dosen = {
        id: `D${String(dosenList.length + 1).padStart(3, '0')}`,
        nama: data.nama,
        nip: data.nip,
        email: data.email,
        jabatan: data.jabatan,
        mataKuliah: mataKuliahArray,
        foto: data.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nama}`,
      };
      saveDosen([...dosenList, newDosen]);
      toast.success('Dosen berhasil ditambahkan');
    }

    handleCloseDialog();
  };

  const handleEdit = (dosen: Dosen) => {
    setEditingDosen(dosen);
    form.reset({
      nama: dosen.nama,
      nip: dosen.nip,
      email: dosen.email,
      jabatan: dosen.jabatan,
      mataKuliah: dosen.mataKuliah.join(', '),
      foto: dosen.foto,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedDosen = dosenList.filter(d => d.id !== id);
    saveDosen(updatedDosen);
    
    // Also delete related penilaian
    const storedPenilaian = localStorage.getItem('penilaian');
    if (storedPenilaian) {
      const penilaianList = JSON.parse(storedPenilaian);
      const updatedPenilaian = penilaianList.filter((p: any) => p.dosenId !== id);
      localStorage.setItem('penilaian', JSON.stringify(updatedPenilaian));
    }
    
    toast.success('Dosen berhasil dihapus');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDosen(null);
    form.reset({
      nama: '',
      nip: '',
      email: '',
      jabatan: '',
      mataKuliah: '',
      foto: '',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manajemen Dosen</h1>
          <p className="text-muted-foreground">Kelola data dosen dengan fitur CRUD lengkap</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Daftar Dosen</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDosen(null)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Dosen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingDosen ? 'Edit Dosen' : 'Tambah Dosen Baru'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Ahmad Fauzi, M.Kom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIP</FormLabel>
                          <FormControl>
                            <Input placeholder="198501152010121001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="dosen@university.ac.id" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jabatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan</FormLabel>
                          <FormControl>
                            <Input placeholder="Lektor Kepala" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mataKuliah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mata Kuliah (pisahkan dengan koma)</FormLabel>
                          <FormControl>
                            <Input placeholder="Pemrograman Web, Basis Data, Algoritma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Foto (opsional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/foto.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Batal
                      </Button>
                      <Button type="submit">
                        {editingDosen ? 'Perbarui' : 'Simpan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Belum ada data dosen. Klik "Tambah Dosen" untuk menambahkan.
                    </TableCell>
                  </TableRow>
                ) : (
                  dosenList.map((dosen) => (
                    <TableRow key={dosen.id}>
                      <TableCell>
                        <img 
                          src={dosen.foto} 
                          alt={dosen.nama}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{dosen.nama}</TableCell>
                      <TableCell>{dosen.nip}</TableCell>
                      <TableCell>{dosen.email}</TableCell>
                      <TableCell>{dosen.jabatan}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {dosen.mataKuliah.slice(0, 2).map((mk, idx) => (
                            <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {mk}
                            </span>
                          ))}
                          {dosen.mataKuliah.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{dosen.mataKuliah.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/profil/${dosen.id}`)}
                            className="gap-1"
                          >
                            <UserCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(dosen)}
                            className="gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Dosen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Anda yakin ingin menghapus {dosen.nama}? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua penilaian terkait.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(dosen.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManajemenDosen;
