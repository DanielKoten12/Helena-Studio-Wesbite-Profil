<template>
  <div class="min-h-screen bg-white text-[#4A5565] pb-20">
    <main class="max-w-7xl mx-auto px-4 py-12">
      <!-- Page Title -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="bg-[#B76E79] p-3 rounded-lg text-white">
            <Scissors :size="32" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-[#4A5565]" style="font-family: 'Playfair Display', serif">
            Hairstyle <span class="text-[#B76E79]">AI</span>
          </h1>
        </div>
        <p class="text-sm text-gray-500">Helena Studio</p>
      </div>
      <!-- Intro -->
      <div v-if="!imageFile && !analysis" class="text-center mb-12 animate-fade-in">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-[#4A5565]">
          Cari Gaya Rambut yang <span class="text-[#B76E79]">Pas Buat Kamu</span>
        </h2>
        <p class="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Upload foto selfie kamu, dan biarkan AI menganalisis bentuk wajahmu untuk memberikan 
          rekomendasi potongan rambut terbaik beserta visualisasi gambarnya.
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 max-w-3xl mx-auto"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <AlertCircle :size="20" class="shrink-0 mt-0.5" />
          <div>
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Upload Section -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 class="text-2xl font-bold mb-4 text-[#B76E79]">1. Upload Foto Selfie</h2>
          <ImageUploader @imageUpload="handleImageUpload" @reset="resetState" />

          <!-- Info Box -->
          <div v-if="imageFile" class="mt-6 bg-[#B76E79]/5 border border-[#B76E79]/20 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Sparkles :size="20" class="text-[#B76E79] shrink-0 mt-0.5" />
              <div class="text-sm text-[#4A5565]">
                <p class="font-semibold mb-1">AI akan menganalisis:</p>
                <ul class="list-disc list-inside space-y-1 text-xs text-gray-600">
                  <li>Bentuk wajah Anda</li>
                  <li>Jenis & tekstur rambut</li>
                  <li>3 rekomendasi hairstyle yang cocok</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Analyze Button -->
          <div v-if="imageFile" class="mt-6">
            <button
              @click="handleAnalysis"
              :disabled="isLoadingAnalysis || Object.values(isLoadingImages).some(Boolean)"
              class="w-full bg-[#B76E79] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#a05d68] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              <template v-if="isLoadingAnalysis">
                <SpinnerLoader />
                <span class="ml-2">Analyzing...</span>
              </template>
              <template v-else>
                <Sparkles :size="20" class="mr-2" />
                Get My Recommendations
              </template>
            </button>
            <button
              v-if="!isLoadingAnalysis"
              @click="resetState"
              class="mt-4 w-full text-sm text-gray-500 hover:text-[#B76E79] transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:row-span-2">
          <h2 class="text-2xl font-bold mb-4 text-[#B76E79]">AI Results</h2>
          
          <div v-if="isLoadingAnalysis" class="text-center p-8">
            <SpinnerLoader />
            <p class="mt-4 text-gray-500">Diagnosing your features...</p>
          </div>

          <AnalysisResult v-else-if="analysis" :analysis="analysis" />

          <div
            v-else
            class="text-center text-gray-400 p-8 border-2 border-dashed border-gray-300 rounded-lg"
          >
            <User :size="48" class="mx-auto mb-4 opacity-30" />
            <p>Your analysis and recommendations will appear here.</p>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div v-if="recommendations.length > 0" class="mt-8">
        <h2 class="text-3xl font-bold text-center mb-6 text-[#B76E79] flex items-center justify-center gap-3">
          <Scissors :size="32" />
          3 Hairstyle Recommendations
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <RecommendationCard
            v-for="rec in recommendations"
            :key="rec.option"
            :recommendation="rec"
            :isLoading="isLoadingImages[rec.option] || false"
            :generatedImage="generatedImages[rec.option] || null"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-gray-400 py-6 text-sm border-t border-gray-100 mt-12">
      <p>&copy; {{ new Date().getFullYear() }} Helena Studio</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Scissors, Sparkles, User, AlertCircle } from 'lucide-vue-next'
import ImageUploader from './ImageUploader.vue'
import SpinnerLoader from './SpinnerLoader.vue'
import AnalysisResult from './AnalysisResult.vue'
import RecommendationCard from './RecommendationCard.vue'
import { performAnalysis, generateImage } from '../composables/geminiService'
import { parseAnalysisResponse } from '../utils/parser'

const imageFile = ref(null)
const imageBase64 = ref(null)

const analysis = ref(null)
const recommendations = ref([])
const generatedImages = ref({})

const isLoadingAnalysis = ref(false)
const isLoadingImages = ref({})

const error = ref(null)

const handleImageUpload = (file, base64) => {
  imageFile.value = file
  imageBase64.value = base64
  analysis.value = null
  recommendations.value = []
  generatedImages.value = {}
  error.value = null
}

const resetState = () => {
  imageFile.value = null
  imageBase64.value = null
  analysis.value = null
  recommendations.value = []
  generatedImages.value = {}
  error.value = null
  isLoadingAnalysis.value = false
  isLoadingImages.value = {}
}

const handleAnalysis = async () => {
  if (!imageFile.value || !imageBase64.value) {
    error.value = 'Please upload an image first.'
    return
  }

  isLoadingAnalysis.value = true
  error.value = null
  analysis.value = null
  recommendations.value = []
  generatedImages.value = {}
  isLoadingImages.value = {}

  try {
    const responseText = await performAnalysis(imageBase64.value, imageFile.value.type)
    const { analysis: parsedAnalysis, recommendations: parsedRecommendations } = parseAnalysisResponse(responseText)
    
    analysis.value = parsedAnalysis
    recommendations.value = parsedRecommendations
    
    // Generate images for all recommendations
    generateAllImages(parsedRecommendations)

  } catch (err) {
    console.error(err)
    error.value = err.message || 'Failed to get analysis. Please try again.'
  } finally {
    isLoadingAnalysis.value = false
  }
}

const generateAllImages = async (recs) => {
  // Set loading state for all
  recs.forEach(rec => {
    isLoadingImages.value[rec.option] = true
  })

  // Generate images in parallel with user's face as reference
  const imagePromises = recs.map(rec => 
    generateImage(rec.prompt, '1K', imageBase64.value, imageFile.value.type).catch(err => {
      console.error(`Error generating image for ${rec.option}:`, err)
      return null
    })
  )

  const results = await Promise.all(imagePromises)

  // Update images
  const newImages = {}
  recs.forEach((rec, index) => {
    newImages[rec.option] = results[index]
    isLoadingImages.value[rec.option] = false
  })

  generatedImages.value = { ...generatedImages.value, ...newImages }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
