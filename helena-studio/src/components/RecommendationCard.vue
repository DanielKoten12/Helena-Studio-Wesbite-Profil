<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
    <!-- Header -->
    <div class="bg-[#4A5565] text-white p-4">
      <div class="flex justify-between items-center">
        <span class="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
          {{ recommendation.option }}
        </span>
      </div>
      <h3 class="text-xl font-bold mt-2">{{ recommendation.styleName }}</h3>
    </div>

    <!-- Image Section -->
    <div class="relative bg-linear-to-br from-gray-50 to-gray-100 min-h-80 max-h-[500px] border-b border-gray-200 flex items-center justify-center p-4">
      <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center p-6">
        <SpinnerLoader />
        <p class="mt-3 text-gray-500 text-sm">Generating image...</p>
      </div>
      <img
        v-else-if="generatedImage"
        :src="generatedImage"
        :alt="recommendation.styleName"
        class="w-full max-h-[480px] object-contain"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 p-6">
        <div class="text-center">
          <Scissors :size="48" class="mx-auto mb-3 opacity-30" />
          <p class="text-sm font-semibold mb-1">Visualisasi Hairstyle</p>
          <p class="text-xs text-gray-500">Gunakan prompt di bawah untuk generate gambar</p>
          <p class="text-xs text-[#B76E79] mt-2">📋 Copy prompt & paste ke AI image generator</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 grow flex flex-col gap-4">
      <div>
        <h4 class="font-bold text-[#B76E79] text-sm mb-2 flex items-center gap-2">
          <Info :size="16" /> Kenapa Cocok?
        </h4>
        <p class="text-[#4A5565] text-sm leading-relaxed">{{ recommendation.suitability }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Scissors, Info } from 'lucide-vue-next'
import SpinnerLoader from './SpinnerLoader.vue'

const props = defineProps({
  recommendation: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  generatedImage: {
    type: String,
    default: null
  }
})
</script>
