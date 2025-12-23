<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      v-if="!tempImagePreview && !imagePreview"
      @click="showUploadModal"
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
          <p class="text-sm text-gray-500 mt-1">Klik untuk ambil foto atau pilih dari galeri</p>
          <p class="text-xs text-gray-400 mt-2">Format: JPG, PNG (Max 10MB)</p>
        </div>
      </div>
    </div>

    <!-- Preview Confirmation -->
    <div v-if="tempImagePreview && !imagePreview" class="space-y-4">
      <div class="relative">
        <img 
          :src="tempImagePreview" 
          alt="Preview" 
          class="w-full h-64 object-cover rounded-xl shadow-lg"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleRetake"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <Camera :size="20" />
          Foto Ulang
        </button>
        <button
          @click="handleConfirm"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-[#B76E79] text-white rounded-lg hover:bg-[#A05D68] transition-colors font-medium"
        >
          <Check :size="20" />
          Gunakan Foto Ini
        </button>
      </div>
    </div>

    <!-- Final Preview -->
    <div v-if="imagePreview" class="relative">
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

    <!-- Hidden File Inputs -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      @change="handleFileChange"
      class="hidden"
    />
    <input
      ref="galleryInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />

    <!-- Upload Modal/Bottom Sheet -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          @click="closeModal"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <!-- Modal Content -->
          <div 
            @click.stop
            class="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all"
          >
            <!-- Handle Bar (Mobile) -->
            <div class="sm:hidden flex justify-center pt-3 pb-2">
              <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <!-- Modal Header -->
            <div class="px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 class="text-xl font-bold text-[#4A5565]">Pilih Sumber Foto</h3>
              <p class="text-sm text-gray-500 mt-1">Ambil foto baru atau pilih dari galeri</p>
            </div>

            <!-- Modal Options -->
            <div class="p-4 space-y-3">
              <button
                @click="openCamera"
                class="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-[#B76E79] hover:bg-[#B76E79]/5 transition-all group"
              >
                <div class="bg-[#B76E79]/10 group-hover:bg-[#B76E79]/20 p-3 rounded-full transition-colors">
                  <Camera :size="24" class="text-[#B76E79]" />
                </div>
                <div class="text-left flex-1">
                  <p class="font-semibold text-[#4A5565]">Ambil Foto</p>
                  <p class="text-sm text-gray-500">Gunakan kamera</p>
                </div>
              </button>

              <button
                @click="openGallery"
                class="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-[#B76E79] hover:bg-[#B76E79]/5 transition-all group"
              >
                <div class="bg-[#B76E79]/10 group-hover:bg-[#B76E79]/20 p-3 rounded-full transition-colors">
                  <ImageIcon :size="24" class="text-[#B76E79]" />
                </div>
                <div class="text-left flex-1">
                  <p class="font-semibold text-[#4A5565]">Pilih dari Galeri</p>
                  <p class="text-sm text-gray-500">Upload foto yang ada</p>
                </div>
              </button>
            </div>

            <!-- Cancel Button -->
            <div class="p-4 pt-2">
              <button
                @click="closeModal"
                class="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Camera, X, ImageIcon, Check } from 'lucide-vue-next'

const emit = defineEmits(['imageUpload', 'reset'])

const cameraInput = ref(null)
const galleryInput = ref(null)
const imagePreview = ref(null)
const tempImagePreview = ref(null)
const tempFile = ref(null)
const tempBase64 = ref(null)
const isDragging = ref(false)
const isModalOpen = ref(false)

// Modal functions
const showUploadModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const openCamera = () => {
  closeModal()
  cameraInput.value?.click()
}

const openGallery = () => {
  closeModal()
  galleryInput.value?.click()
}

// File handling
const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
  // Reset input values
  if (cameraInput.value) cameraInput.value.value = ''
  if (galleryInput.value) galleryInput.value.value = ''
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
    
    // Store temporarily for confirmation
    tempImagePreview.value = base64String
    tempFile.value = file
    tempBase64.value = base64Data
  }
  reader.readAsDataURL(file)
}

// Confirmation actions
const handleConfirm = () => {
  imagePreview.value = tempImagePreview.value
  emit('imageUpload', tempFile.value, tempBase64.value)
  
  // Clear temp data
  tempImagePreview.value = null
  tempFile.value = null
  tempBase64.value = null
}

const handleRetake = () => {
  tempImagePreview.value = null
  tempFile.value = null
  tempBase64.value = null
  showUploadModal()
}

const handleReset = () => {
  imagePreview.value = null
  tempImagePreview.value = null
  tempFile.value = null
  tempBase64.value = null
  
  if (cameraInput.value) cameraInput.value.value = ''
  if (galleryInput.value) galleryInput.value.value = ''
  
  emit('reset')
}
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child {
  transform: translateY(100%);
}

.modal-leave-to > div:last-child {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from > div:last-child,
  .modal-leave-to > div:last-child {
    transform: translateY(0) scale(0.95);
  }
}
</style>
