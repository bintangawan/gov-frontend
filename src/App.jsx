import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { useAuthStore } from "./auth/useAuthStore";

// Import Halaman Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminServices from "./pages/Admin/Services";
import AdminApplications from "./pages/Admin/Applications";

// Import Halaman User
import UserDashboard from "./pages/Users/Dashboard";
import UserApplications from "./pages/Users/Applications";

// Wrapper: Pastikan User Login
const ProtectedRoute = () => {
  const { token, loading } = useAuthStore();
  if (loading) return <div className="p-10 text-center">Memuat...</div>;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Wrapper: Khusus Admin
const AdminRoute = () => {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/user/dashboard" replace />;
};

export default function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Jika root '/', redirect sesuai role */}
      <Route path="/" element={
          user ? (user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />) 
               : <Navigate to="/login" />
      } />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
           
           {/* ROUTES UNTUK ADMIN */}
           <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
           </Route>

           {/* ROUTES UNTUK USER (CITIZEN) */}
           <Route path="/user/dashboard" element={<UserDashboard />} />
           <Route path="/user/applications" element={<UserApplications />} />

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}