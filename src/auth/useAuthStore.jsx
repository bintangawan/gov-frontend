import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Inisialisasi state langsung kosong dulu
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Cek LocalStorage saat aplikasi mulai
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        // Coba parsing data user, kalau rusak error akan ditangkap catch
        const parsedUser = JSON.parse(storedUser);
        
        // Validasi tambahan: user harus punya nama/email
        if (parsedUser && parsedUser.email) {
            setToken(storedToken);
            setUser(parsedUser);
        } else {
            // Data user tidak valid, hapus!
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
      } catch (error) {
        // Jika JSON rusak, bersihkan storage
        console.error("Data storage korup, logout otomatis.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => useContext(AuthContext);