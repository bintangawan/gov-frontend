import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Check, X, Search, FileText, AlertCircle } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
        const res = await api.get("/admin/applications");
        setApps(res.data.data);
    } catch (err) { console.error(err); }
  };

  // Fungsi untuk menangani Aksi (Approve/Reject) dengan SweetAlert2
  const handleAction = async (id, status, applicantName) => {
    const isApprove = status === 'approved';
    const actionText = isApprove ? "Menyetujui" : "Menolak";
    const confirmColor = isApprove ? "#059669" : "#DC2626"; // Hijau vs Merah

    // 1. Tampilkan Modal Input
    const { value: feedback } = await Swal.fire({
      title: `${actionText} Permohonan?`,
      text: `Anda akan ${actionText.toLowerCase()} permohonan dari ${applicantName}.`,
      icon: isApprove ? 'question' : 'warning',
      input: 'textarea',
      inputLabel: 'Catatan Admin (Feedback)',
      inputPlaceholder: 'Tulis alasan atau catatan untuk pemohon...',
      inputAttributes: {
        'aria-label': 'Tulis catatan disini'
      },
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Ya, ${isApprove ? 'Setujui' : 'Tolak'}`,
      cancelButtonText: 'Batal',
      showLoaderOnConfirm: true,
      preConfirm: async (inputValue) => {
        // Logika API call di dalam SweetAlert agar loadingnya rapi
        try {
            await api.put(`/admin/applications/${id}`, { 
                status: status, 
                admin_feedback: inputValue || (isApprove ? "Permohonan Disetujui" : "Maaf, permohonan ditolak.") 
            });
            return true;
        } catch (error) {
            Swal.showValidationMessage(`Request gagal: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    // 2. Jika sukses
    if (feedback !== undefined) { // feedback undefined jika user klik batal
        await Swal.fire({
            title: 'Berhasil!',
            text: `Status permohonan berhasil diperbarui menjadi ${status}.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        fetchApps(); // Refresh data
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Permohonan Masuk</h1>
                <p className="text-slate-500 text-sm">Validasi permohonan layanan dari warga.</p>
            </div>
            <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold">
                Total: {apps.length} Permohonan
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {apps.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <FileText size={32} />
                    </div>
                    <p>Belum ada permohonan baru.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="p-4">Pemohon</th>
                                <th className="p-4">Layanan</th>
                                <th className="p-4">Catatan Warga</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {apps.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{item.applicant_name}</span>
                                            <span className="text-xs text-slate-500">{item.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md text-sm">
                                            {item.service_name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs italic">
                                        "{item.notes || 'Tidak ada catatan'}"
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase flex items-center gap-1 w-fit ${
                                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                            item.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                            'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {item.status === 'pending' && <AlertCircle size={12}/>}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            {item.status === 'pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleAction(item.id, 'approved', item.applicant_name)} 
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition shadow-sm hover:shadow-md" 
                                                        title="Setujui"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(item.id, 'rejected', item.applicant_name)} 
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition shadow-sm hover:shadow-md" 
                                                        title="Tolak"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">Selesai</span>
                                            )}
                                        </div>
                                    </td>
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