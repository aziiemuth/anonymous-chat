# 🤫 Anonymous Chat Board

**Berbagi Cerita, Tanpa Identitas.**

Anonymous Chat adalah platform papan pesan realtime yang memungkinkan siapa saja untuk mengirimkan pesan secara anonim. Di bangun dengan estetika modern, performa tinggi, dan fitur interaktif untuk menciptakan ruang berekspresi yang aman dan menyenangkan.

---

## ✨ Fitur Utama

- **🚀 Realtime Feed**: Pesan muncul secara instan tanpa perlu refresh halaman berkat integrasi Supabase.
- **🛡️ Admin Command Center**: Dashboard khusus untuk mengelola pesan (Love, Pin, Highlight, & Delete).
- **🎭 Avatar Dinamis**: Setiap pesan memiliki avatar unik yang dihasilkan secara otomatis menggunakan DiceBear.
- **💬 Reply System**: Komunikasi dua arah antara anonim dan admin (Owner Response).
- **🌓 Modern UI/UX**: Desain premium dengan Glassmorphism, animasi halus (Framer Motion), dan dukungan Dark Mode yang nyaman.
- **🕒 Accurate Time**: Sinkronisasi waktu otomatis dengan zona waktu Indonesia (WIB).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Icons**: [FontAwesome](https://fontawesome.com/) & [Lucide React](https://lucide.dev/)
- **UI Components**: [SweetAlert2](https://sweetalert2.github.io/)

---

## 🚦 Memulai

### Prasyarat

- Node.js 18.x atau versi terbaru
- Akun Supabase

### Instalasi

1. **Clone repository:**

   ```bash
   git clone https://github.com/your-username/anonymous-chat.git
   cd anonymous-chat
   ```

2. **Instal dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env.local` di root direktori dan tambahkan kredensial berikut:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Setup Database:**
   Gunakan file `database_fix.sql` untuk membuat tabel `messages` dan `replies` di SQL Editor Supabase Anda.

5. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan portofolio. Bebas digunakan dan dimodifikasi.

**Dibuat dengan ❤️ untuk kebebasan berekspresi.**
