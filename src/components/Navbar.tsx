import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, BarChart3, ClipboardCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Beranda', icon: GraduationCap },
    { path: '/penilaian', label: 'Penilaian', icon: ClipboardCheck },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/manajemen', label: 'Kelola Dosen', icon: Settings }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Penilaian Dosen</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={path} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
