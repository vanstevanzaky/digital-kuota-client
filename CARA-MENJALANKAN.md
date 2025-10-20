# 🚀 CARA MENJALANKAN APLIKASI

## ⚡ Quick Start (5 Menit)

### 1️⃣ Persiapan
**Install dulu:**
- Node.js: https://nodejs.org/ (versi 16+)
- json-server: `npm install -g json-server`

### 2️⃣ Extract File
Extract `digital-kuota-client.zip` ke folder pilihan Anda

### 3️⃣ Buka 2 Terminal

**Terminal 1 - Backend:**
```bash
cd digital-kuota-client
json-server --watch db.json --port 3001
```
✅ Tunggu sampai muncul: `Resources http://localhost:3001/...`

**Terminal 2 - Frontend:**
```bash
cd digital-kuota-client/frontend
npm install
npm run dev
```
✅ Tunggu sampai muncul: `Local: http://localhost:5173/`

### 4️⃣ Buka Browser
```
http://localhost:5173
```

### 5️⃣ Login
```
Email: customer@test.com
Password: password123
```

---

## ✅ Fitur yang Bisa Dicoba

1. **Customer Dashboard** (`/customer`)
   - Edit profil
   - Lihat riwayat transaksi
   - Hapus transaksi

2. **Beli Paket** (`/transaksi`)
   - Filter paket by kategori
   - Search paket
   - Beli paket (saldo otomatis berkurang)

3. **Test Session**
   - Refresh browser → tetap login ✅
   - Logout → confirm modal

---

## 🐛 Troubleshooting

**Port 3001 sudah dipakai?**
```bash
json-server --watch db.json --port 3002
```
*(Jangan lupa update port di `frontend/src/services/api.js`)*

**Error saat npm install?**
```bash
npm cache clean --force
npm install
```

**Backend tidak jalan?**
```bash
npm install -g json-server
# atau
npx json-server --watch db.json --port 3001
```

---

## 📞 Kontak

Jika ada masalah saat menjalankan aplikasi:
- Email: [stevanzaky87@gmail.com]
- GitHub Issues: https://github.com/vanstevanzaky/digital-kuota-client/issues

---

**Total waktu setup: ±5 menit** ⏱️  
**Terima kasih sudah mencoba! 🙏**
