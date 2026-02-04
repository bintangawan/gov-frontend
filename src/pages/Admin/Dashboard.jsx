import { LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Administrator</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <LayoutDashboard size={32} />
            </div>
            <h2 className="text-xl font-semibold">Selamat Datang, Admin!</h2>
            <p className="text-gray-500 mt-2">Silakan kelola layanan dan permohonan masuk melalui menu di samping.</p>
        </div>
    </div>
  );
}