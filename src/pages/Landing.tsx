import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BarChart3, Star, TrendingUp, Users } from 'lucide-react';
import heroImage from '@/assets/hero-education.jpg';

const Landing = () => {
  const features = [
    {
      icon: Star,
      title: 'Penilaian Objektif',
      description: 'Sistem penilaian berbasis kriteria yang terukur dan transparan'
    },
    {
      icon: BarChart3,
      title: 'AI Decision Support',
      description: 'Menggunakan metode Weighted Product untuk ranking otomatis'
    },
    {
      icon: TrendingUp,
      title: 'Analisis Real-time',
      description: 'Visualisasi data dan statistik yang mudah dipahami'
    },
    {
      icon: Users,
      title: 'Transparansi',
      description: 'Hasil penilaian yang akurat dan dapat dipertanggungjawabkan'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                Sistem Penilaian Dosen Terbaik
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Platform modern untuk menilai dan menentukan dosen terbaik menggunakan teknologi AI Decision Support System dengan metode Weighted Product
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg">
                  <Link to="/penilaian">
                    Mulai Menilai
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <Link to="/dashboard">
                    Lihat Ranking
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <img 
                src={heroImage}
                alt="Sistem Penilaian Dosen"
                className="rounded-2xl shadow-lg hover-lift"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">AI-Powered</div>
                <div className="text-sm">Decision Support System</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistem penilaian yang komprehensif dengan teknologi terkini
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift border-2">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Mulai Memberikan Penilaian Sekarang
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Bantu kami meningkatkan kualitas pendidikan dengan memberikan penilaian yang objektif
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg">
            <Link to="/penilaian">
              Beri Penilaian Sekarang
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
