<template>
  <div>
    <!-- Booking Dialog -->
    <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
      <DialogPortal>
        <DialogOverlay 
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 200 } }"
          class="fixed inset-0 bg-black/50 z-50" 
        />
        <DialogContent 
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 300, ease: 'easeOut' } }"
          class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-lg w-[90%] max-w-[500px] p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        >
          <div class="space-y-6">
            <!-- Header -->
            <div class="space-y-2">
              <DialogTitle 
                class="text-3xl font-normal"
                style="font-family: 'Playfair Display', serif; color: #b76e79"
              >
                Reservasi Sekarang
              </DialogTitle>
              <DialogDescription 
                class="text-sm text-[#717182]"
                style="font-family: 'Poppins', sans-serif"
              >
                Isi detail Anda dan kami akan menghubungi Anda kembali untuk mengonfirmasi janji temu Anda.
              </DialogDescription>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Nama Lengkap -->
              <div class="space-y-2">
                <label 
                  for="name" 
                  class="text-sm font-medium text-[#4a5565]"
                  style="font-family: 'Poppins', sans-serif"
                >
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input 
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px"
                />
              </div>

              <!-- Nomor Telepon -->
              <div class="space-y-2">
                <label 
                  for="phone" 
                  class="text-sm font-medium text-[#4a5565]"
                  style="font-family: 'Poppins', sans-serif"
                >
                  Nomor Telepon <span class="text-red-500">*</span>
                </label>
                <input 
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  required
                  placeholder="Masukkan nomor telepon Anda"
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px"
                />
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label 
                  for="email" 
                  class="text-sm font-medium text-[#4a5565]"
                  style="font-family: 'Poppins', sans-serif"
                >
                  Email <span class="text-red-500">*</span>
                </label>
                <input 
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="Masukkan email Anda"
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px"
                />
              </div>

              <!-- Layanan yang Dipilih -->
              <div class="space-y-2">
                <label 
                  for="service" 
                  class="text-sm font-medium text-[#4a5565]"
                  style="font-family: 'Poppins', sans-serif"
                >
                  Layanan yang Dipilih <span class="text-red-500">*</span>
                </label>
                <select 
                  id="service"
                  v-model="formData.service"
                  required
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px"
                >
                  <option value="" disabled>Pilih layanan</option>
                  <option value="Haircut">Haircut</option>
                  <option value="Hair Coloring">Hair Coloring</option>
                  <option value="Hair Keratin Treatment">Hair Keratin Treatment</option>
                  <option value="Hairdo">Hairdo</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>

              <!-- Tanggal dan Waktu -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Tanggal -->
                <div class="space-y-2">
                  <label 
                    for="date" 
                    class="text-sm font-medium text-[#4a5565]"
                    style="font-family: 'Poppins', sans-serif"
                  >
                    Tanggal <span class="text-red-500">*</span>
                  </label>
                  <input 
                    id="date"
                    v-model="formData.date"
                    type="date"
                    required
                    class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                    style="font-family: 'Poppins', sans-serif; font-size: 14px"
                  />
                </div>

                <!-- Waktu/Jam -->
                <div class="space-y-2">
                  <label 
                    for="time" 
                    class="text-sm font-medium text-[#4a5565]"
                    style="font-family: 'Poppins', sans-serif"
                  >
                    Waktu (Jam) <span class="text-red-500">*</span>
                  </label>
                  <input 
                    id="time"
                    v-model="formData.time"
                    type="time"
                    required
                    class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:border-transparent"
                    style="font-family: 'Poppins', sans-serif; font-size: 14px"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="$emit('update:open', false)"
                  class="flex-1 h-10 px-4 rounded-md border border-gray-300 bg-white text-[#4a5565] hover:bg-gray-50 transition-colors"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="flex-1 h-10 px-4 rounded-md text-white hover:opacity-90 transition-opacity"
                  style="background-color: #b76e79; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500"
                >
                  Kirim Pemesanan
                </button>
              </div>
            </form>
          </div>

          <!-- Close Button (X) -->
          <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#b76e79]">
            <X :size="20" class="text-[#4a5565]" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <!-- Success Dialog -->
    <ReservasiDiterima 
      v-model:open="showSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  DialogRoot, 
  DialogPortal, 
  DialogOverlay, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogClose 
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import ReservasiDiterima from './ReservasiDiterima.vue'

defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:open'])

const showSuccess = ref(false)

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: ''
})

const handleSubmit = () => {
  // Format date untuk display yang lebih baik
  const formattedDate = new Date(formData.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format pesan WhatsApp
  const message = `Halo Helena Studio, saya ingin melakukan reservasi:

Nama: ${formData.name}
Telepon: ${formData.phone}
Email: ${formData.email}
Layanan: ${formData.service}
Tanggal: ${formattedDate}
Waktu: ${formData.time}`

  // Encode message untuk URL
  const encodedMessage = encodeURIComponent(message)
  
  // Nomor WhatsApp (format internasional tanpa +)
  const whatsappNumber = '6282250513575'
  
  // URL WhatsApp API
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
  // Buka WhatsApp di tab baru
  window.open(whatsappURL, '_blank')
  
  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  
  // Tutup booking dialog dan tampilkan success dialog
  emit('update:open', false)
  showSuccess.value = true
}
</script>