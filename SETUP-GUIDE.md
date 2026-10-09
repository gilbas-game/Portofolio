# LensaKu - Setup & Deploy Guide

Panduan lengkap untuk menjalankan website + CMS dari nol sampai online.

---

## FASE 1: Test Lokal (Verifikasi Semua Berfungsi)

### 1.1 Jalankan Local Server

Buka terminal di folder project, lalu jalankan:

```bash
# Python (paling mudah, sudah terinstall di kebanyakan komputer)
python -m http.server 8080

# atau jika punya Node.js
npx serve -p 8080
```

Buka browser → `http://localhost:8080`

**Yang harus terlihat:**
- Website LensaKu tampil lengkap (hero, about, portfolio, services, contact)
- Semua foto dan teks termuat dari file JSON di folder `content/`

### 1.2 Test CMS Lokal (Opsional)

Untuk test CMS tanpa GitHub (mode lokal):

```bash
# Install decap-server
npx decap-server

# Buka admin di browser
# http://localhost:8080/admin/
```

> Catatan: Mode lokal ini hanya untuk testing. Untuk produksi, gunakan GitHub backend (Fase 3).

---

## FASE 2: Push ke GitHub

### 2.1 Inisialisasi Git Repository

```bash
cd "C:/Users/damar/WorkBuddy AI/2026-10-09-22-48-51"

# Inisialisasi repo lokal
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: LensaKu data-driven + CMS + image optimization"
```

### 2.2 Hubungkan ke Repo GitHub yang Sudah Ada

Repo kamu sudah ada di `gilbas-game/Portofolio`. Ada 2 opsi:

**OPSI A: Replace isi repo lama (RECOMMENDED)**

```bash
# Tambah remote ke repo yang sudah ada
git remote add origin https://github.com/gilbas-game/Portofolio.git

# Force push untuk mengganti semua isi repo lama dengan yang baru
git push -f origin main
```

> PERINGATAN: `git push -f` akan menghapus semua file lama di repo GitHub.
> Pastikan tidak ada file penting di repo lama yang belum di-backup.

**OPSI B: Buat repo baru (Lebih Aman)**

1. Buka https://github.com/new
2. Repository name: `LensaKu-Portofolio` (atau nama lain)
3. Jangan centang "Add README"
4. Klik **Create repository**
5. Jalankan:
```bash
git remote add origin https://github.com/gilbas-game/LensaKu-Portofolio.git
git push -u origin main
```

### 2.3 Verifikasi GitHub Pages

1. Buka repo di GitHub → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → Folder: **/ (root)**
4. Klik **Save**
5. Tunggu 2-5 menit, lalu akses:
   - `https://gilbas-game.github.io/Portofolio/` (jika pakai repo lama)
   - `https://gilbas-game.github.io/LensaKu-Portofolio/` (jika repo baru)

> Jika URL berubah (repo baru), update `admin/config.yml`:
> - `site_url`
> - `display_url`
> - Dan callback URL di OAuth App (Fase 3)

---

## FASE 3: Setup CMS (Decap CMS + GitHub OAuth)

### 3.1 Buat GitHub OAuth App

Decap CMS butuh otentikasi via GitHub OAuth agar bisa baca/tulis file di repo kamu.

1. Buka **https://github.com/settings/developers**
2. Klik **"New OAuth App"**
3. Isi form:

| Field | Isi dengan |
|-------|-----------|
| Application name | `LensaKu CMS` |
| Homepage URL | `https://gilbas-game.github.io/Portofolio/` |
| Authorization callback URL | `https://gilbas-game.github.io/Portofolio/admin/` |

4. Klik **Register application**
5. Di halaman app yang baru dibuat, klik **"Generate a new client secret"**
6. **COPY Client ID** (contoh: `Iv1.abc123def456`)

> Simpan Client ID dan Client Secret di tempat aman.
> Client Secret tidak perlu dimasukkan ke config.yml (PKCE auth tidak membutuhkannya).

### 3.2 Masukkan Client ID ke config.yml

Buka file `admin/config.yml`, cari baris:

```yaml
backend:
  name: github
  repo: gilbas-game/Portofolio
  branch: main
  auth_type: pkce
  app_id: ""  # <-- GANTI dengan GitHub OAuth App Client ID kamu
```

Ganti `app_id: ""` menjadi:

```yaml
  app_id: "Iv1.abc123def456"  # Client ID dari OAuth App kamu
```

### 3.3 Commit & Push Perubahan

```bash
git add admin/config.yml
git commit -m "config: add GitHub OAuth app_id for CMS"
git push
```

### 3.4 Login ke CMS

1. Tunggu GitHub Pages selesai deploy (2-5 menit setelah push)
2. Buka browser → `https://gilbas-game.github.io/Portofolio/admin/`
3. Klik **"Login with GitHub"**
4. Authorize app (popup GitHub akan muncul)
5. CMS panel akan terbuka dengan 5 koleksi:
   - **Pengaturan Website** (logo, navigasi, hero, footer)
   - **Tentang Saya** (bio, statistik, spesialisasi)
   - **Portfolio Foto** (daftar foto + kategori)
   - **Layanan** (jasa fotografi)
   - **Kontak** (info kontak, kartu, CTA)

---

## FASE 4: Setup Image Optimization (GitHub Actions)

### 4.1 Enable Workflow Permissions

1. Buka repo GitHub → **Settings** → **Actions** → **General**
2. Scroll ke bawah ke **"Workflow permissions"**
3. Pilih **"Read and write permissions"**
4. Klik **Save**

### 4.2 Cara Kerja Auto-Optimization

Setelah setup di atas, sistem akan otomatis berjalan:

1. Kamu upload foto baru via CMS → CMS menyimpan foto ke folder `images/`
2. CMS auto-commit perubahan ke repo GitHub
3. GitHub Action mendeteksi ada perubahan di `images/` → otomatis trigger
4. Action menjalankan `sharp` untuk:
   - Resize ke max 1920px lebar
   - Kompres JPEG/PNG/WebP/AVIF (quality 80)
   - Replace original hanya jika hasil lebih kecil
5. Bot auto-commit hasil optimasi → GitHub Pages auto-redeploy dengan foto yang sudah dioptimasi

### 4.3 Cek Status Action

- Repo GitHub → tab **Actions**
- Akan muncul workflow "Optimize Images" setiap kali ada push ke `images/`
- Klik untuk lihat detail log
- Icon hijau = sukses, merah = error

---

## FASE 5: Mulai Update Konten via CMS

### 5.1 Update Foto Portfolio

1. Login ke CMS (`/admin/`)
2. Klik **"Portfolio Foto"**
3. Klik item foto yang ingin diubah, atau klik **"Add"** untuk foto baru
4. Upload foto baru (drag & drop atau browse)
5. Isi judul, pilih kategori (portrait/landscape/street/blackwhite)
6. Tulis deskripsi
7. Klik **Publish** → foto tersimpan ke repo → auto-optimasi → website terupdate

### 5.2 Update Statistik (Jumlah Customer, dll)

1. CMS → **"Tentang Saya"**
2. Scroll ke **"Statistik"**
3. Ubah angka (contoh: Proyek Selesai = 5 → 10)
4. Publish → website langsung terupdate

### 5.3 Update Info Kontak

1. CMS → **"Kontak"**
2. Edit kartu kontak (WhatsApp, Instagram, Email)
3. Ubah nomor/username/link
4. Publish

---

## TROUBLESHOOTING

### Website blank / error "Gagal memuat file konten"

**Penyebab:** Folder `content/` tidak ter-upload atau URL salah.

**Solusi:**
1. Cek repo GitHub → pastikan folder `content/` ada dengan 5 file JSON
2. Jika website di subpath (contoh: `/Portofolio/`), fetch di `script.js` perlu relative path
3. Test buka langsung: `https://gilbas-game.github.io/Portofolio/content/settings.json`

### CMS login error / redirect gagal

**Penyebab:** OAuth App callback URL salah atau `app_id` kosong.

**Solusi:**
1. Cek callback URL di GitHub OAuth App = `https://gilbas-game.github.io/Portofolio/admin/`
2. Cek `app_id` di `config.yml` sudah diisi dengan Client ID yang benar
3. Pastikan tidak ada trailing slash yang salah

### GitHub Action tidak jalan

**Penyebab:** Permissions belum diset atau file `images/` tidak berubah.

**Solusi:**
1. Cek Settings → Actions → General → Workflow permissions = "Read and write"
2. Action hanya trigger jika ada perubahan di folder `images/**`
3. Cek tab Actions → apakah ada workflow yang error? Klik untuk lihat log

### Foto tidak muncul setelah upload via CMS

**Penyebab:** Path foto di JSON tidak cocok.

**Solusi:**
1. CMS menyimpan foto ke `images/` dan path di JSON jadi `images/namafoto.jpg`
2. Pastikan folder `images/` ada di repo (sudah ada `.gitkeep`)
3. Tunggu GitHub Pages redeploy (2-5 menit)

---

## FILE STRUCTURE REFERENCE

```
LensaKu/
├── index.html              # Frontend HTML skeleton
├── styles.css              # All CSS styling
├── script.js               # JS: fetch JSON → render DOM
├── content/                # Data layer (5 JSON files)
│   ├── settings.json       # Site meta, nav, hero, footer
│   ├── about.json          # Bio, stats, specializations
│   ├── portfolio.json      # Filters + photo items
│   ├── services.json       # Service offerings
│   └── contact.json        # Contact cards, info, CTA
├── admin/                  # Decap CMS
│   ├── index.html          # CMS entry point
│   └── config.yml          # CMS field configuration
├── images/                 # Uploaded photos (auto-optimized)
│   └── .gitkeep
├── scripts/                # Image optimization
│   ├── optimize-images.js  # sharp-based processor
│   └── package.json        # sharp dependency
├── .github/workflows/      # GitHub Actions
│   └── optimize-images.yml # Auto image optimization CI
├── .gitattributes          # Line endings + binary handling
└── data.json               # Legacy backup (not used)
```
