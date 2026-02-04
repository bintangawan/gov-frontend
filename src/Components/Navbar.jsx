import { useAuthStore } from "../auth/useAuthStore";
import { LogOut, Menu, User, Bell } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center transition-all duration-300">
      
      {/* KIRI: Toggle Button & Branding (Mobile) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu size={24} />
        </button>
        
        {/* Judul Halaman di Mobile / Tablet */}
        <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            Sistem Layanan Digital
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">Pemerintah Kota - Portal Terpadu</p>
        </div>
      </div>

      {/* KANAN: User Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Notifikasi (Hiasan) */}
        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || "Pengguna"}</p>
            <p className="text-xs text-slate-500 capitalize mt-1">{user?.role || "Citizen"}</p>
          </div>
          
          <div className="relative group cursor-pointer">
             {/* Avatar Image */}
            {user?.avatar ? (
                <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-all" 
                />
            ) : (
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center border-2 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <User size={20} />
                </div>
            )}
            
            {/* Status Indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <button 
            onClick={logout} 
            className="ml-1 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Keluar Aplikasi"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}