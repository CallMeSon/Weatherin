<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/partly-cloudy-day.png" alt="Weatherin Logo" width="80" />
</p>

<h1 align="center">Weatherin</h1>

<p align="center">
  <strong>Dashboard cuaca modern & real-time — tanpa API key, 100% gratis.</strong>
</p>

<p align="center">
  <a href="#fitur"><img src="https://img.shields.io/badge/Fitur-8-blue?style=for-the-badge" alt="Features" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#api"><img src="https://img.shields.io/badge/API-Open--Meteo-22c55e?style=for-the-badge" alt="API" /></a>
  <a href="https://weatherin-project.vercel.app"><img src="https://img.shields.io/badge/Demo-Live-22c55e?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
</p>

<br />

---

## 🌤️ Tentang

**Weatherin** adalah dashboard cuaca modern yang dibangun dengan React dan Vite. Aplikasi ini menyajikan informasi cuaca real-time, prakiraan 6 hari, kualitas udara, waktu terbit/terbenam matahari dan lainnya.

> **✨ Tanpa API key!** — Menggunakan [Open-Meteo API](https://open-meteo.com/).

---

## 🚀 Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔍 **Pencarian Kota** | Cari kota manapun di dunia dengan autocomplete real-time |
| 📍 **Deteksi Lokasi** | Geolocation otomatis saat pertama kali dibuka |
| 🌡️ **Cuaca Real-Time** | Suhu, kelembapan, kecepatan angin, tekanan udara, dan visibilitas |
| 📅 **Prakiraan 6 Hari** | Forecast harian dengan suhu maks/min dan deskripsi cuaca |
| 🌅 **Terbit & Terbenam** | Informasi waktu sunrise dan sunset |
| 🏭 **Kualitas Udara** | Indeks AQI, PM2.5, PM10, dan SO2 |
| 🌙 **Mode Siang/Malam** | Tema otomatis berubah berdasarkan waktu di lokasi yang dicari |
| 📱 **Responsif** | Tampilan optimal di desktop, tablet, maupun mobile |

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vite.dev/) | Build tool & dev server |
| [Lucide React](https://lucide.dev/) | Ikon SVG |
| [date-fns](https://date-fns.org/) | Format tanggal |
| Vanilla CSS | Styling dengan CSS custom properties |

---

## 🌐 API

Weatherin menggunakan API yang **100% gratis** dan **tanpa registrasi**:

| API | Endpoint | Data |
|-----|----------|------|
| [Open-Meteo Weather](https://open-meteo.com/) | `api.open-meteo.com/v1/forecast` | Cuaca saat ini & prakiraan harian |
| [Open-Meteo Air Quality](https://open-meteo.com/) | `air-quality-api.open-meteo.com/v1/air-quality` | AQI, PM2.5, PM10, SO2 |
| [Open-Meteo Geocoding](https://open-meteo.com/) | `geocoding-api.open-meteo.com/v1/search` | Pencarian kota |
| [BigDataCloud](https://www.bigdatacloud.com/) | `api.bigdatacloud.net` | Reverse geocoding |

---

## 📦 Instalasi

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- npm (sudah termasuk dalam Node.js)

### Langkah-langkah

```bash
# 1. Clone repositori
git clone https://github.com/username/weatherin.git
cd weatherin

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

### Build untuk Produksi

```bash
npm run build
npm run preview
```

---

## 📁 Struktur Proyek

```
weatherin/
├── public/
├── src/
│   ├── components/
│   │   ├── AirQuality.jsx      # Kartu indeks kualitas udara
│   │   ├── CurrentWeather.jsx   # Hero card cuaca utama
│   │   ├── DetailCards.jsx      # Kelembapan, angin, visibilitas
│   │   ├── Forecast.jsx         # Prakiraan 6 hari
│   │   ├── Navbar.jsx           # Navigasi atas
│   │   ├── SearchBar.jsx        # Input pencarian + autocomplete
│   │   └── SunriseSunset.jsx    # Terbit & terbenam matahari
│   ├── services/
│   │   └── api.js               # Fungsi pemanggilan API
│   ├── App.jsx                  # Layout utama dashboard
│   ├── index.css                # Sistem desain & tema
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Tema

Weatherin secara otomatis menyesuaikan tema berdasarkan data `is_day` dari API:

| Mode | Tampilan |
|------|----------|
| ☀️ **Siang** | Latar abu-abu terang, kartu putih, aksen biru |
| 🌙 **Malam** | Latar navy gelap, kartu transparan, aksen biru terang |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buka **Issue** atau buat **Pull Request**.

1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur/fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/fitur-baru`)
5. Buka Pull Request

---