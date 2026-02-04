import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../auth/useAuthStore";
import api from "../api/axios";
import { LogIn, UserPlus, Building2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Ambil fungsi login dari store
  
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 1. Handle Manual Login/Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = isRegister ? "/auth/register" : "/auth/login";

    try {
      const res = await api.post(endpoint, formData);
      if (isRegister) {
        alert("Registrasi Berhasil! Silakan Login.");
        setIsRegister(false);
      } else {
        // Simpan data ke Context Store
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/google", {
        googleToken: credentialResponse.credential,
      });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Gagal login dengan Google. Pastikan akun valid.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-poppins">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
            <div className="bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
            {isRegister ? "Buat Akun Baru" : "Portal Layanan Digital"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sistem Pemerintahan Terpadu</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">Nama Lengkap</label>
              <input name="full_name" type="text" onChange={handleChange} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
            <input name="email" type="email" onChange={handleChange} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">Password</label>
            <input name="password" type="password" onChange={handleChange} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 transition font-medium flex justify-center gap-2 disabled:opacity-70">
            {loading ? "Memproses..." : (isRegister ? "Daftar Sekarang" : "Masuk Sistem")}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-medium">ATAU MASUK DENGAN</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Login Google Gagal")} />
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-700 font-semibold hover:underline">
            {isRegister ? "Login disini" : "Daftar disini"}
          </button>
        </p>
      </div>
    </div>
  );
}