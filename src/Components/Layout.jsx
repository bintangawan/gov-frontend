import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthStore } from "../auth/useAuthStore"; // Import Auth Store
import { 
  LayoutDashboard, Server, FileText, 
  Settings, X, Building2, History 
} from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore(); // Ambil data user yang sedang login

  // 1. INJECT FONT POPPINS
  useEffect(() => {
    if (!document.getElementById("font-poppins")) {
      const link = document.createElement("link");
      link.id = "font-poppins";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // 2. MENU BERDASARKAN ROLE
  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Kelola Layanan", path: "/admin/services", icon: <Server size={20} /> },
    { name: "Permohonan Masuk", path: "/admin/applications", icon: <FileText size={20} /> },
  ];

  const userMenu = [
    { name: "Beranda Layanan", path: "/user/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Riwayat Pengajuan", path: "/user/applications", icon: <History size={20} /> },
  ];

  // Pilih menu yang mana?
  const menuItems = user?.role === 'admin' ? adminMenu : userMenu;

  const SidebarItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 p-3 mx-3 rounded-lg transition-all duration-200 group relative ${
          isActive 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium" 
            : "text-blue-100 hover:bg-white/10 hover:text-white"
        }`}
      >
        {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></div>}
        <div className={`${isActive ? "text-white" : "text-blue-300 group-hover:text-white"}`}>
            {item.icon}
        </div>
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-[Poppins] antialiased text-slate-800 overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-2xl z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
           <div className="bg-blue-600 p-1.5 rounded-lg">
             <Building2 size={20} className="text-white"/>
           </div>
           <span className="text-xl font-bold tracking-wide">GovSys</span>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {user?.role === 'admin' ? 'Administrator' : 'Layanan Warga'}
          </p>
          {menuItems.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
          <p className="text-xs text-slate-500">&copy; 2026 Pemerintah Kota</p>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY & DRAWER (Sama seperti sebelumnya, ringkas kode) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transition-transform md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
           <span className="text-lg font-bold">GovSys</span>
           <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        <nav className="py-4 space-y-1">
          {menuItems.map((item) => <SidebarItem key={item.path} item={item} />)}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        <Navbar toggleSidebar={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-7xl mx-auto">
               <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}