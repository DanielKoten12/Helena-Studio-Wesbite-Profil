# Helena Studio - Backend API

Backend untuk Helena Studio Hairstyle AI menggunakan Vercel Serverless Functions.

## 🔧 Setup Development

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan masukkan API key Anda
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server
```bash
# Dari root project (helena-studio/)
npm install -g vercel
vercel dev
```

Backend akan berjalan di: `http://localhost:3000`

## 📡 API Endpoints

### POST /api/analyze
Analisis wajah dan rambut dari foto.

**Request Body:**
```json
{
  "imageBase64": "base64_string_without_data_uri_prefix",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "markdown_formatted_analysis_text"
  }
}
```

### POST /api/generate-image
Generate gambar hairstyle baru.

**Request Body:**
```json
{
  "prompt": "generate image: ...",
  "imageSize": "1K",
  "userImageBase64": "base64_string",
  "userImageMimeType": "image/jpeg"
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

## 🚀 Deployment ke Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy
```bash
# Dari root project (helena-studio/)
vercel

# Untuk production
vercel --prod
```

### 4. Set Environment Variables di Vercel
```bash
# Via CLI
vercel env add GEMINI_API_KEY

# Atau via Dashboard Vercel:
# Settings → Environment Variables → Add
# Name: GEMINI_API_KEY
# Value: your_api_key
```

## 🔒 Security

- ✅ API Key disimpan di environment variables (tidak di code)
- ✅ Input validation untuk semua request
- ✅ CORS configuration
- ✅ File size limit (max 10MB)
- ✅ Image format validation

## 📁 Struktur

```
backend/
├── api/
│   ├── analyze.js              # Endpoint untuk analisis wajah
│   ├── generate-image.js       # Endpoint untuk generate gambar
│   └── lib/
│       ├── geminiService.js    # Logic Gemini API
│       └── validator.js        # Input validation
├── .env                        # Environment variables (gitignored)
├── .env.example               # Template environment variables
└── package.json               # Dependencies
```

## 🧪 Testing

### Test dengan cURL

```bash
# Test analyze endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "base64_image_data",
    "mimeType": "image/jpeg"
  }'

# Test generate-image endpoint
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "generate image: ...",
    "imageSize": "1K",
    "userImageBase64": "base64_data",
    "userImageMimeType": "image/jpeg"
  }'
```

## ⚠️ Important Notes

1. **Jangan commit .env** - API key harus tetap rahasia
2. **Vercel limits** - Free tier: 10 detik timeout, 100GB bandwidth/bulan
3. **Image size** - Max 10MB per upload
4. **Rate limiting** - Consider adding if needed untuk production
