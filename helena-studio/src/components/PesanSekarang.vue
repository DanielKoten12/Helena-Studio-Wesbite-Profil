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
                style="font-family: 'Playfair Display', serif; color: #544771"
              >
                Reservasi Sekarang
              </DialogTitle>
              <DialogDescription 
                class="text-sm text-[#717182]"
                style="font-family: 'Poppins', sans-serif"
              >
                Isi detail Anda, pilih layanan dan jam tersedia, lalu reservasi langsung masuk ke sistem admin kami.
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
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
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
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
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
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
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
                  class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
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
                    class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
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
                  <select
                    id="time"
                    v-model="formData.time"
                    required
                    :disabled="!formData.date || !formData.service || loadingSlots"
                    class="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#544771] focus:border-transparent"
                    style="font-family: 'Poppins', sans-serif; font-size: 14px"
                  >
                    <option value="" disabled>
                      {{ loadingSlots ? 'Memuat jam tersedia...' : 'Pilih jam tersedia' }}
                    </option>
                    <option
                      v-for="slot in availableSlots"
                      :key="slot.time"
                      :value="slot.time"
                      :disabled="!slot.available"
                    >
                      {{ slot.time.replace(':', '.') }}
                      {{ slot.available ? `(Sisa ${slot.spotsLeft})` : '(Penuh)' }}
                    </option>
                  </select>
                  <p v-if="slotInfoText" class="text-xs text-[#717182]">{{ slotInfoText }}</p>
                  <p v-if="slotError" class="text-xs text-red-600">{{ slotError }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="submitError" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ submitError }}
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="$emit('update:open', false)"
                  :disabled="submitting"
                  class="flex-1 h-10 px-4 rounded-md border border-gray-300 bg-white text-[#4a5565] hover:bg-gray-50 transition-colors"
                  style="font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="flex-1 h-10 px-4 rounded-md text-white hover:opacity-90 transition-opacity"
                  style="background-color: #544771; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500"
                >
                  {{ submitting ? 'Memproses...' : 'Kirim Pemesanan' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Close Button (X) -->
          <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#544771]">
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
import { ref, reactive, onMounted, watch } from 'vue'
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
import { dataService } from '@/composables/dataService'

defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:open'])

const showSuccess = ref(false)
const submitting = ref(false)
const loadingSlots = ref(false)
const submitError = ref('')
const slotError = ref('')
const slotInfoText = ref('')
const treatments = ref([])
const availableSlots = ref([])

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: ''
})

const loadTreatments = async () => {
  const { data, error } = await dataService.getTreatments()
  if (!error) {
    treatments.value = data || []
  }
}

const loadAvailableSlots = async () => {
  if (!formData.date || !formData.service) {
    availableSlots.value = []
    slotInfoText.value = ''
    return
  }

  slotError.value = ''
  loadingSlots.value = true
  formData.time = ''

  try {
    const selectedTreatment = resolveTreatment(formData.service)
    const { data, error } = await dataService.getAvailableSlots(
      formData.date,
      selectedTreatment?.id,
      formData.service
    )

    if (error) throw error

    const slots = data || []
    availableSlots.value = slots

    const availableCount = slots.filter((slot) => slot.available).length
    if (availableCount > 0) {
      const durationHours = slots[0].durationHours || 1
      slotInfoText.value = `Durasi layanan ini ${durationHours} jam. Slot tersedia: ${availableCount}. Jam operasional: 10.00 - 22.00.`
    } else {
      slotInfoText.value = 'Tidak ada jam tersedia untuk tanggal ini.'
    }
  } catch (error) {
    console.error('Gagal memuat slot:', error)
    slotError.value = 'Gagal memuat jam tersedia. Silakan coba lagi.'
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

const resolveTreatment = (serviceName) => {
  const normalizedService = (serviceName || '').toLowerCase().replace(/\s+/g, '')

  return treatments.value.find((item) => {
    const normalizedName = (item.name || '').toLowerCase().replace(/\s+/g, '')
    return (
      normalizedName === normalizedService ||
      normalizedName.includes(normalizedService) ||
      normalizedService.includes(normalizedName)
    )
  })
}

const addMinutes = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

const handleSubmit = async () => {
  submitError.value = ''
  submitting.value = true

  try {
    const selectedTreatment = resolveTreatment(formData.service)
    const selectedSlot = availableSlots.value.find((slot) => slot.time === formData.time)
    const duration = selectedTreatment?.duration_minutes || ((selectedSlot?.durationHours || 1) * 60)

    if (!selectedSlot) {
      throw new Error('Jam tidak valid')
    }

    if (!selectedSlot.available) {
      throw new Error('Jam tersebut sudah penuh. Silakan pilih jam lain.')
    }

    const bookingPayload = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      treatment_id: selectedTreatment?.id || null,
      treatment_name: selectedTreatment?.name || formData.service,
      booking_date: formData.date,
      start_time: formData.time,
      end_time: selectedSlot.endTime || addMinutes(formData.time, duration),
      duration_minutes: duration,
      price: selectedTreatment?.price || 0,
      notes: `Sumber: Website Reservasi Sekarang`
    }

    const { error } = await dataService.createBooking(bookingPayload)
    if (error) throw error

    // Reset form
    Object.keys(formData).forEach((key) => {
      formData[key] = ''
    })
    availableSlots.value = []
    slotInfoText.value = ''

    // Tutup booking dialog dan tampilkan success dialog
    emit('update:open', false)
    showSuccess.value = true
  } catch (error) {
    console.error('Gagal menyimpan reservasi:', error)
    submitError.value = error?.message || 'Reservasi gagal dikirim. Silakan coba lagi.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadTreatments()
})

watch(
  () => [formData.service, formData.date],
  () => {
    loadAvailableSlots()
  }
)
</script>