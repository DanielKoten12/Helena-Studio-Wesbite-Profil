# Helena Studio - Deployment Guide

## 🚀 Cara Deploy ke Vercel

### Persiapan

1. **Pastikan semua file sudah ready:**
   - ✅ Backend di folder `backend/`
   - ✅ Frontend di folder `src/`
   - ✅ `vercel.json` sudah ada

2. **Install Vercel CLI:**
```bash
npm install -g vercel
```

3. **Login ke Vercel:**
```bash
vercel login
```

### Deploy

1. **Dari root project (helena-studio/):**
```bash
vercel
```

2. **Ikuti prompt:**
   - Set up and deploy? **Yes**
   - Which scope? **Pilih account Anda**
   - Link to existing project? **No**
   - What's your project's name? **helena-studio** (atau nama lain)
   - In which directory is your code located? **./** (root)

3. **Set Environment Variables di Vercel:**

Via Dashboard Vercel:
- Buka project di [vercel.com/dashboard](https://vercel.com/dashboard)
- Klik Settings → Environment Variables
- Tambahkan:
  - **Name:** `GEMINI_API_KEY`
  - **Value:** `AIzaSyCRMhoLX6KIkv8N-5Nnv67kEMidFjnrINM`
  - **Environment:** Production, Preview, Development (pilih semua)
- Klik Save

4. **Redeploy setelah set environment:**
```bash
vercel --prod
```

### Testing Setelah Deploy

1. **Test frontend:**
```
https://your-project.vercel.app
```

2. **Test API:**
```bash
# Test analyze endpoint
curl -X POST https://your-project.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"test","mimeType":"image/jpeg"}'

# Harus return error validation (expected)
```

## 🧪 Local Development

### 1. Install Dependencies
```bash
# Root project (frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Run Development

**Opsi A: Vercel Dev (Recommended - Full environment)**
```bash
vercel dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3000/api/*`

**Opsi B: Vite Dev (Frontend only)**
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- ⚠️ Backend API tidak tersedia - perlu deploy dulu

### 3. Environment Variables Local

File `.env` di root (untuk frontend):
```
# Kosongkan atau hapus VITE_GEMINI_API_KEY
# VITE_GEMINI_API_KEY=  # Tidak digunakan lagi

# Optional: jika backend di server lain
# VITE_API_BASE_URL=http://localhost:3000
```

File `backend/.env` (untuk backend):
```
GEMINI_API_KEY=AIzaSyCRMhoLX6KIkv8N-5Nnv67kEMidFjnrINM
```

## 📝 Struktur File

```
helena-studio/
├── backend/                   # Backend (Serverless Functions)
│   ├── api/
│   │   ├── analyze.js         # POST /api/analyze
│   │   ├── generate-image.js  # POST /api/generate-image
│   │   └── lib/
│   │       ├── geminiService.js
│   │       └── validator.js
│   ├── .env                   # Backend env (gitignored)
│   └── package.json
├── src/                       # Frontend (Vue.js)
│   ├── components/
│   ├── composables/
│   │   └── apiService.js      # ← Calls backend API
│   └── ...
├── vercel.json               # Vercel configuration
└── package.json              # Frontend dependencies
```

## ⚠️ Important

1. **Jangan commit .env files!** (sudah di .gitignore)
2. **API Key di backend only** - tidak pernah di frontend
3. **Vercel limits:**
   - Free tier: 10 detik timeout per request
   - 100GB bandwidth/bulan
   - Unlimited requests

## 🔍 Troubleshooting

### API Error 500
- Check environment variables di Vercel dashboard
- Check logs: `vercel logs your-deployment-url`

### Timeout Error
- Gemini API kadang lambat (5-15 detik)
- Upgrade ke Vercel Pro untuk timeout 60 detik (jika perlu)

### CORS Error
- Pastikan `vercel.json` sudah benar
- CORS headers sudah di set di API endpoints

## 📚 Dokumentasi

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
