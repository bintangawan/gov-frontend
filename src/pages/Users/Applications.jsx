import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function UserApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/my-applications")
       .then(res => setApps(res.data.data))
       .catch(err => console.error(err));
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
        case 'approved': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> Disetujui</span>;
        case 'rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> Ditolak</span>;
        default: return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-slate-800">Riwayat Pengajuan Saya</h1>
       
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {apps.length === 0 ? (
             <div className="p-8 text-center text-gray-500">Belum ada riwayat pengajuan.</div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                      <tr>
                         <th className="p-4">Layanan</th>
                         <th className="p-4">Tanggal</th>
                         <th className="p-4">Catatan Saya</th>
                         <th className="p-4">Status</th>
                         <th className="p-4">Feedback Admin</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {apps.map((item) => (
                         <tr key={item.id} className="hover:bg-blue-50/50">
                            <td className="p-4 font-medium">{item.service_name}</td>
                            <td className="p-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{item.notes}</td>
                            <td className="p-4">{getStatusBadge(item.status)}</td>
                            <td className="p-4 text-sm text-gray-500 italic">{item.admin_feedback || "-"}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
       </div>
    </div>
  );
}