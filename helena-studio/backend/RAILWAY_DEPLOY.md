# 🚂 Deploy Backend ke Railway

## Persiapan

### 1. Install Dependencies Backend
```bash
cd backend
npm install
```

### 2. Test Local
```bash
npm run dev
```
Backend akan jalan di `http://localhost:3000`

---

## Deploy ke Railway

### Step 1: Buat Account Railway
1. Buka https://railway.app/
2. Sign up dengan GitHub account
3. Verifikasi email

### Step 2: Create New Project
1. Klik "New Project"
2. Pilih "Deploy from GitHub repo"
3. Connect GitHub account jika belum
4. **PENTING:** Push folder `backend/` ke GitHub dulu

### Step 3: Push Backend ke GitHub

Buat repository baru atau gunakan yang ada:

```bash
# Dari folder helena-studio/
git add backend/
git commit -m "Add backend for Railway deployment"
git push origin main
```

### Step 4: Deploy di Railway
1. Di Railway dashboard, pilih repo Anda
2. Railway auto-detect sebagai Node.js app
3. Set root directory ke `backend/`
4. Klik "Deploy"

### Step 5: Set Environment Variables
Di Railway dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=AIzaSyCRMhoLX6KIkv8N-5Nnv67kEMidFjnrINM
PORT=3000
FRONTEND_URL=https://helena-studio.vercel.app
```

### Step 6: Get Railway URL
Setelah deploy sukses, Railway akan kasih URL seperti:
```
https://helena-studio-backend-production.up.railway.app
```

Copy URL ini!

---

## Update Frontend

### 1. Update .env di root project
```bash
# File: helena-studio/.env
VITE_API_BASE_URL=https://your-railway-url.up.railway.app
```

### 2. Redeploy Frontend ke Vercel
```bash
vercel --prod
```

---

## Test Backend

Test dengan curl:
```bash
curl https://your-railway-url.up.railway.app/health
```

Harus return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-23T..."
}
```

---

## 💰 Railway Free Tier
- **500 jam/bulan** execution time
- Cukup untuk ~20 hari 24/7 atau usage normal sebulan
- Auto-sleep setelah tidak ada traffic (hemat quota)

---

## 🔧 Troubleshooting

### Backend tidak jalan?
1. Cek logs di Railway dashboard
2. Pastikan environment variables sudah di-set
3. Cek PORT settings

### Frontend tidak connect?
1. Pastikan CORS di backend allow frontend URL
2. Cek VITE_API_BASE_URL di .env sudah benar
3. Redeploy frontend setelah update .env

### Image generation timeout?
- Railway tidak ada timeout limit ✅
- Tapi pastikan Gemini API key valid
- Cek logs untuk error detail

---

## Alternative: Render.com

Jika Railway tidak bisa, gunakan Render:
- 750 jam/bulan gratis
- Same steps tapi di https://render.com
- Pilih "Web Service"
- Start command: `npm start`
