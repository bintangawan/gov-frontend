import { useEffect, useState } from "react";
import api from "../../api/axios";
import ServiceForm from "../../Components/ServiceForm"; 
import { 
  Plus, Edit, Trash2, Search, Filter, 
  ChevronLeft, ChevronRight, FileX 
} from "lucide-react";
import Swal from "sweetalert2"; // Import Library Keren

export default function Services() {
  // --- STATE ---
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination Config
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH DATA ---
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      // Opsional: Swal.fire untuk error fetch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // --- LOGIC PAGINATION CLIENT-SIDE ---
  const filteredServices = services.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.service_name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // --- CRUD HANDLERS WITH SWEETALERT2 ---

  // 1. Handle Submit (Create / Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
      } else {
        await api.post("/services", formData);
      }
      setIsModalOpen(false);
      fetchServices(); 
      setSearchTerm(""); 
      
      // SweetAlert Sukses
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: editingService ? 'Data layanan berhasil diperbarui.' : 'Layanan baru berhasil ditambahkan.',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      // SweetAlert Error
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle Delete dengan Konfirmasi SweetAlert
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Layanan?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Merah
      cancelButtonColor: '#3085d6', // Biru
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/services/${id}`);
          
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Data layanan telah dihapus.',
            timer: 1500,
            showConfirmButton: false
          });
          
          fetchServices();
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: 'Terjadi kesalahan saat menghapus data.',
          });
        }
      }
    });
  };

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Layanan Digital</h1>
          <p className="text-slate-500 text-sm">Kelola seluruh layanan publik di sini.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition transform active:scale-95"
        >
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama layanan atau kategori..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition bg-slate-50 focus:bg-white" 
            />
        </div>
        <div className="text-sm text-gray-500 font-medium">
            Total: <span className="text-blue-900 font-bold">{filteredServices.length}</span> Layanan
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                <span>Memuat Data Layanan...</span>
            </div>
        ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wide border-b border-gray-100">
                <tr>
                  <th className="p-4 w-10 text-center">No</th>
                  <th className="p-4">Nama Layanan</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.length === 0 ? (
                   <tr>
                     <td colSpan="6" className="p-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                           <FileX size={32} />
                           <span>Tidak ada data layanan yang ditemukan.</span>
                        </div>
                     </td>
                   </tr>
                ) : currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-4 text-center text-gray-400 text-sm font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{item.service_name}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold border border-blue-200">
                          {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm truncate max-w-xs">{item.description}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border flex items-center gap-1 w-fit ${
                        item.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {item.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(item)} 
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition" 
                            title="Edit"
                          >
                              <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition" 
                            title="Hapus"
                          >
                              <Trash2 size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER - Tampil jika ada data > 0 */}
          {filteredServices.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50 gap-4">
                
                <p className="text-sm text-gray-500">
                    Menampilkan <span className="font-bold text-slate-800">{indexOfFirstItem + 1}</span> - <span className="font-bold text-slate-800">{Math.min(indexOfLastItem, filteredServices.length)}</span> dari {filteredServices.length} data
                </p>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    {/* Logika Tombol Nomor Halaman */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                           <button
                              key={number}
                              onClick={() => setCurrentPage(number)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                  currentPage === number 
                                  ? "bg-blue-900 text-white shadow-md shadow-blue-900/20" 
                                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                              }`}
                           >
                              {number}
                           </button>
                      ))}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          )}
        </>
        )}
      </div>

      {/* MODAL */}
      <ServiceForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={editingService}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}