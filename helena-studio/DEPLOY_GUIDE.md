# 🚀 PANDUAN DEPLOY BACKEND KE RAILWAY - LENGKAP

## ✅ Yang Sudah Saya Siapkan

1. ✅ Backend server dengan Express.js (`backend/server.js`)
2. ✅ Gemini service untuk image generation (`backend/lib/geminiService.js`)
3. ✅ Input validator (`backend/lib/validator.js`)
4. ✅ Dependencies terinstall
5. ✅ Backend sudah test jalan di localhost:3000

---

## 📋 LANGKAH DEPLOY KE RAILWAY (Step by Step)

### **STEP 1: Buat Account Railway**
1. Buka browser → https://railway.app
2. Klik **"Login"** → **"Login with GitHub"**
3. Authorize Railway untuk akses GitHub
4. Verifikasi email jika diminta

---

### **STEP 2: Upload Backend ke GitHub**

#### Opsi A: Repository Baru (Rekomendasi)
```powershell
# Dari folder helena-studio/
cd backend
git init
git add .
git commit -m "Initial backend for Railway"
git branch -M main
```

Lalu buat repo baru di GitHub:
- Buka https://github.com/new
- Nama: `helena-studio-backend`
- Klik **Create repository**
- Copy command yang muncul:

```powershell
git remote add origin https://github.com/USERNAME/helena-studio-backend.git
git push -u origin main
```

#### Opsi B: Pakai Repository yang Ada
```powershell
# Dari folder root
cd C:\Users\WIN10\Documents\Helena-studio-project\helena-studio
git add backend/
git commit -m "Add backend for Railway deployment"
git push origin main
```

---

### **STEP 3: Deploy di Railway**

1. Di Railway dashboard → Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository: `helena-studio-backend` (atau repo utama)
4. Railway akan auto-detect sebagai **Node.js**

**PENTING - Set Root Directory:**
- Klik **Settings** (kiri bawah)
- Scroll ke **Root Directory**
- Isi dengan: `backend` (jika pakai repo utama) atau `/` (jika repo terpisah)
- Klik **Save**

---

### **STEP 4: Set Environment Variables**

Di Railway dashboard:
1. Klik tab **"Variables"** (di menu kiri)
2. Klik **"New Variable"** untuk setiap variable:

```
GEMINI_API_KEY = AIzaSyCRMhoLX6KIkv8N-5Nnv67kEMidFjnrINM
PORT = 3000
FRONTEND_URL = https://helena-studio.vercel.app
NODE_ENV = production
```

3. Setelah semua variable di-add, Railway akan auto-redeploy

---

### **STEP 5: Get Public URL**

1. Di Railway project → Klik tab **"Settings"**
2. Scroll ke **"Networking"** / **"Domains"**
3. Klik **"Generate Domain"**
4. Railway akan kasih URL seperti:
   ```
   https://helena-studio-backend-production.up.railway.app
   ```
5. **COPY URL ini!** Kita butuh untuk frontend

---

### **STEP 6: Test Backend**

Buka browser atau Postman, test endpoint:

```
GET https://your-railway-url.up.railway.app/health
```

Harus return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-23T..."
}
```

---

### **STEP 7: Update Frontend**

#### 7.1 Buat file `.env` di folder `helena-studio/`
```bash
# File: helena-studio/.env
VITE_API_BASE_URL=https://your-railway-url.up.railway.app
```

Ganti `your-railway-url` dengan URL dari Railway!

#### 7.2 Build dan Deploy Frontend
```powershell
cd helena-studio
npm run build
vercel --prod
```

#### 7.3 Update Environment Variable di Vercel
1. Buka https://vercel.com/dashboard
2. Pilih project **helena-studio**
3. Settings → Environment Variables
4. Add new variable:
   ```
   VITE_API_BASE_URL = https://your-railway-url.up.railway.app
   ```
5. Redeploy:
   ```powershell
   vercel --prod
   ```

---

## ✅ VERIFICATION CHECKLIST

Setelah semua selesai, test:

1. **Backend Health Check:**
   ```
   https://your-railway-url.up.railway.app/health
   ```
   Status: ✅ Should return `{"status":"healthy"}`

2. **Frontend Loading:**
   ```
   https://helena-studio.vercel.app
   ```
   Status: ✅ Should load website

3. **Upload Foto & Analisis:**
   - Upload foto
   - Klik "Analisis Sekarang"
   - Status: ✅ Should show analysis result

4. **Generate Gambar:**
   - Pilih style rekomendasi
   - Klik "Generate"
   - Status: ✅ Should generate image (will take 20-40 seconds - NO TIMEOUT!)

---

## 💰 Railway Free Tier Info

- **500 jam/bulan** gratis
- Backend auto-sleep kalau tidak ada traffic (hemat quota)
- Tidak ada timeout limit untuk image generation ✅
- Cukup untuk development dan testing

---

## 🐛 Troubleshooting

### Backend tidak deploy?
**Check Logs:**
1. Railway dashboard → **Deployments**
2. Klik deployment terakhir
3. Lihat logs untuk error

**Common Issues:**
- Root directory salah → Set ke `backend`
- Environment variables belum di-set → Tambahkan semua
- Port salah → Pastikan `PORT=3000`

### Frontend tidak connect ke backend?
**Check:**
1. `.env` file ada di `helena-studio/` folder
2. VITE_API_BASE_URL benar (Railway URL)
3. Redeploy frontend setelah update `.env`

**Test API di browser:**
```
https://your-railway-url.up.railway.app/health
```

### Image generation gagal?
**Check:**
1. Railway logs untuk error detail
2. GEMINI_API_KEY sudah benar di Railway
3. Frontend kirim data dengan format benar

---

## 🎯 COMMAND CHEAT SHEET

```powershell
# Test backend local
cd helena-studio/backend
npm start

# Push ke GitHub
git add .
git commit -m "Update backend"
git push

# Deploy frontend
cd helena-studio
npm run build
vercel --prod

# Check Railway logs
# (Buka Railway dashboard di browser)
```

---

## 📞 NEXT STEPS

Setelah Railway jalan:
1. Test upload foto
2. Test analisis
3. Test generate gambar (harusnya tidak timeout lagi!)
4. Kalau semua OK → Production ready! 🎉

---

**Butuh bantuan? Tanya saya langsung!** 😊
