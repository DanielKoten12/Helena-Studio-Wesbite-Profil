<template>
  <div class="space-y-4">
    <div
      v-if="!imagePreview"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
        isDragging ? 'border-[#B76E79] bg-[#B76E79]/10' : 'border-gray-300 hover:border-[#B76E79] hover:bg-gray-50'
      ]"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="bg-[#B76E79]/10 p-4 rounded-full">
          <Camera :size="40" class="text-[#B76E79]" />
        </div>
        <div>
          <p class="text-lg font-semibold text-[#4A5565]">Upload Foto Selfie</p>
          <p class="text-sm text-gray-500 mt-1">Drag & drop atau klik untuk upload</p>
          <p class="text-xs text-gray-400 mt-2">Format: JPG, PNG (Max 10MB)</p>
        </div>
      </div>
    </div>

    <div v-else class="relative">
      <img 
        :src="imagePreview" 
        alt="Preview" 
        class="w-full h-64 object-cover rounded-xl shadow-lg"
      />
      <button
        @click="handleReset"
        class="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        title="Remove image"
      >
        <X :size="20" class="text-[#4A5565]" />
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Camera, X } from 'lucide-vue-next'

const emit = defineEmits(['imageUpload', 'reset'])

const fileInput = ref(null)
const imagePreview = ref(null)
const isDragging = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    alert('File terlalu besar! Maksimal 10MB')
    return
  }

  const reader = new FileReader()
  reader.onloadend = () => {
    const base64String = reader.result
    const base64Data = base64String.split(',')[1]
    imagePreview.value = base64String
    emit('imageUpload', file, base64Data)
  }
  reader.readAsDataURL(file)
}

const handleReset = () => {
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('reset')
}
</script>
