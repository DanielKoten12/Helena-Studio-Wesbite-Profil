# 🎨 Helena Studio - Hairstyle AI

Website untuk Helena Studio dengan fitur AI yang dapat menganalisis bentuk wajah dan memberikan rekomendasi gaya rambut.

## ✨ Fitur

- 📸 **Upload Foto / Ambil Foto** - Support kamera & galeri untuk mobile
- 🤖 **AI Analysis** - Analisis bentuk wajah dan jenis rambut menggunakan Google Gemini AI
- ✂️ **Hairstyle Recommendations** - 3 rekomendasi gaya rambut yang cocok
- 🖼️ **Image Generation** - Visualisasi gaya rambut baru dengan AI
- 📱 **Responsive Design** - Optimized untuk desktop dan mobile

## 🏗️ Arsitektur

Aplikasi ini menggunakan arsitektur **Frontend-Backend Terpisah** untuk keamanan:

```
helena-studio/
├── src/                    # Frontend (Vue.js)
│   ├── components/         # UI Components
│   ├── composables/        # API Service
│   ├── pages/              # Pages
│   └── router/             # Vue Router
│
└── backend/                # Backend (Vercel Serverless Functions)
    └── api/                # API Endpoints
        ├── analyze.js      # POST /api/analyze
        ├── generate-image.js  # POST /api/generate-image
        └── lib/            # Services & Validators
```

**Keuntungan Arsitektur Ini:**
- ✅ **Keamanan:** API Key tersimpan aman di backend, tidak exposed ke frontend
- ✅ **Testing:** Mudah untuk whitebox/blackbox testing (backend & frontend terpisah)
- ✅ **Scalability:** Backend bisa di-scale independent dari frontend
- ✅ **Deployment:** Satu command deploy ke Vercel (frontend + backend sekaligus)

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19.0 atau v22.12.0+
- npm atau yarn
- Gemini API Key dari [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone repository:**
```bash
git clone <repository-url>
cd helena-studio
```

2. **Install dependencies:**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Setup environment variables:**

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env dan masukkan API key Anda
```

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run development server:**

**Menggunakan Vercel Dev (Recommended):**
```bash
npm install -g vercel
vercel dev
```
Akses: `http://localhost:3000`

**Atau Frontend Only:**
```bash
npm run dev
```
Akses: `http://localhost:5173`
⚠️ Note: Backend API tidak tersedia dengan mode ini, perlu deploy backend atau gunakan `vercel dev`

## 📦 Deployment ke Vercel

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deployment.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables di Vercel Dashboard
# Settings → Environment Variables → Add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

## 🛠️ Tech Stack

**Frontend:**
- Vue.js 3 - Progressive JavaScript Framework
- Vue Router - Official router for Vue.js
- Tailwind CSS 4 - Utility-first CSS framework
- Vite - Next generation frontend tooling
- Lucide Icons - Beautiful & consistent icons
- VueUse Motion - Animation library

**Backend:**
- Node.js - JavaScript runtime
- Vercel Serverless Functions - Scalable backend
- Google Gemini AI API - AI analysis & image generation

**Deployment:**
- Vercel - All-in-one platform (Frontend + Backend)

## 📁 Struktur Project

```
helena-studio/
├── backend/
│   ├── api/
│   │   ├── analyze.js           # Endpoint analisis wajah
│   │   ├── generate-image.js    # Endpoint generate gambar
│   │   └── lib/
│   │       ├── geminiService.js # Logic Gemini API
│   │       └── validator.js     # Input validation
│   ├── .env                     # Environment variables (gitignored)
│   └── package.json
│
├── src/
│   ├── components/
│   │   ├── ImageUploader.vue    # Upload/Camera component
│   │   ├── HairstyleAI.vue      # Main AI page
│   │   └── ...
│   ├── composables/
│   │   └── apiService.js        # API client untuk backend
│   ├── pages/
│   ├── router/
│   └── main.js
│
├── vercel.json                  # Vercel configuration
├── DEPLOYMENT.md                # Deployment guide
└── README.md
```

## 🔒 Security Features

- ✅ API Key tersimpan di backend environment variables
- ✅ Input validation untuk semua requests
- ✅ File size limit (max 10MB)
- ✅ Image format validation (JPEG, PNG, WEBP only)
- ✅ CORS configuration
- ✅ No sensitive data di frontend code

## 📝 API Documentation

### POST /api/analyze
Menganalisis wajah dan rambut dari foto yang diupload.

**Request:**
```json
{
  "imageBase64": "string",
  "mimeType": "image/jpeg|image/png|image/webp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "markdown_formatted_text"
  }
}
```

### POST /api/generate-image
Generate gambar hairstyle baru berdasarkan prompt.

**Request:**
```json
{
  "prompt": "string",
  "imageSize": "1K|2K|4K",
  "userImageBase64": "string",
  "userImageMimeType": "image/jpeg|image/png|image/webp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/jpeg;base64,..."
  }
}
```

## 👨‍💻 Developer

Developed with ❤️ for Helena Studio

---

**Happy Coding! 🚀**

