import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FileText, Search, Send, X } from "lucide-react";

export default function UserDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // Untuk Modal
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.data); // Pastikan backend kirim { data: [] }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/applications", {
        service_id: selectedService.id,
        notes: notes
      });
      alert("Permohonan berhasil dikirim! Pantau status di menu Riwayat.");
      setSelectedService(null);
      setNotes("");
    } catch (err) {
      alert("Gagal mengirim permohonan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Layanan Publik Digital</h1>
            <p className="text-blue-200">Silakan pilih layanan yang Anda butuhkan dan ajukan permohonan secara online.</p>
         </div>
         <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/50 to-transparent"></div>
      </div>

      {/* Grid Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                    <FileText size={24} />
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{item.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{item.service_name}</h3>
            <p className="text-slate-500 text-sm flex-1 mb-4 line-clamp-3">{item.description}</p>
            
            <button 
                onClick={() => setSelectedService(item)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
                <Send size={16} /> Ajukan Sekarang
            </button>
          </div>
        ))}
      </div>

      {/* MODAL PENGAJUAN */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Formulir Pengajuan</h3>
                    <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                </div>
                <form onSubmit={handleApply} className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs text-blue-600 font-bold uppercase">Layanan Dipilih</p>
                        <p className="font-semibold text-blue-900">{selectedService.service_name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan / Keperluan</label>
                        <textarea 
                            required
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="4"
                            placeholder="Contoh: Saya butuh izin ini untuk usaha warung makan..."
                        ></textarea>
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 font-bold">
                        {loading ? "Mengirim..." : "Kirim Permohonan"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}