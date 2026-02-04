# GovSys - Sistem Manajemen Layanan Digital Pemerintahan

**GovSys** adalah platform layanan publik digital berbasis web yang dirancang untuk mempermudah instansi pemerintahan dalam mengelola layanan dan permohonan warga. Sistem ini mendukung autentikasi Hybrid (Google OAuth + Manual), Role-Based Access Control (Admin & Citizen), dan antarmuka yang responsif.

---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Keamanan
* **Hybrid Login:** Masuk menggunakan Akun Google (OAuth) atau Email & Password.
* **JWT Authentication:** Keamanan sesi berbasis token.
* **Role-Based Access Control:** Pemisahan hak akses antara **Admin** dan **Citizen (Warga)**.

### 🏛️ Fitur Admin (Pemerintah)
* **Dashboard Statistik:** Ringkasan jumlah layanan dan permohonan.
* **Manajemen Layanan (CRUD):** Tambah, Edit, Hapus, dan Cari layanan publik.
* **Validasi Permohonan:** Menyetujui atau menolak permohonan warga dengan memberikan catatan (Feedback) menggunakan modal interaktif.

### 👥 Fitur Citizen (Warga)
* **Katalog Layanan:** Mencari dan melihat detail layanan yang tersedia.
* **Pengajuan Permohonan:** Mengajukan layanan (misal: Izin UMKM, KTP) secara online.
* **Pelacakan Status:** Memantau status pengajuan (Pending, Disetujui, Ditolak) beserta catatan dari admin.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
* **React.js + Vite:** Framework UI super cepat.
* **Tailwind CSS:** Styling modern dan responsif (Government Blue Theme).
* **SweetAlert2:** Notifikasi dan modal interaktif.
* **Lucide React:** Ikon modern.
* **Axios:** HTTP Client.
* **Google OAuth:** Integrasi login Google.

### Backend
* **Node.js & Express.js:** Server REST API.
* **MySQL:** Database relasional.
* **JSON Web Token (JWT):** Autentikasi.
* **Bcrypt:** Hashing password.

---

## ⚙️ Cara Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal.

### 1. Persiapan Database
Buat database di MySQL (phpMyAdmin/Workbench) dan jalankan query berikut:

```sql
CREATE DATABASE gov_service_sys;
USE gov_service_sys;

-- Tabel User
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    google_id VARCHAR(255) UNIQUE DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    role ENUM('admin', 'staff', 'citizen') DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Tabel Layanan
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel Permohonan
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    notes TEXT, 
    admin_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);


### 2. Unzip File dsms-frontend yang Sudah Diberikan
* Buka Google OAuth, dan ambil Google Client ID yang diberikan.
* Copy .env.example, paste Google Client ID tersebut di file .env
* Lakukan NPM Install
* Running project dengan perintah "npm run dev"