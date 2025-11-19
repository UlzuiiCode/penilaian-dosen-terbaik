import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Penilaian from "./pages/Penilaian";
import Dashboard from "./pages/Dashboard";
import ProfilDosen from "./pages/ProfilDosen";
import ManajemenDosen from "./pages/ManajemenDosen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/penilaian" element={<Penilaian />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil/:id" element={<ProfilDosen />} />
          <Route path="/manajemen" element={<ManajemenDosen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
