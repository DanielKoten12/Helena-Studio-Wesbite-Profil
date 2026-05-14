<template>
  <div class="bg-linear-to-br from-[#6a5b8b] to-[#44395b] text-white py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-2">Reservasi Sekarang</h2>
        <p class="text-center text-white/80 mb-8">Pilih waktu yang tersedia dan langsung booking!</p>
        
        <div class="bg-white rounded-2xl shadow-2xl p-8 text-gray-800">
          <!-- Step Indicator -->
          <div class="flex justify-between mb-8">
            <div v-for="(step, index) in steps" :key="index" 
                 class="flex-1 flex flex-col items-center relative"
                 :class="{ 'opacity-50': currentStep < index + 1 }">
              <div class="w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold"
                   :class="currentStep >= index + 1 ? 'bg-[#6a5b8b] text-white' : 'bg-gray-200 text-gray-400'">
                {{ index + 1 }}
              </div>
              <span class="text-sm text-center">{{ step }}</span>
              <div v-if="index < steps.length - 1" 
                   class="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -z-10"
                   :class="{ 'bg-[#6a5b8b]': currentStep > index + 1 }"></div>
            </div>
          </div>

          <!-- Step 1: Pilih Treatment -->
          <div v-show="currentStep === 1">
            <h3 class="text-xl font-semibold mb-4">Pilih Treatment</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button v-for="treatment in treatments" :key="treatment.id"
                      @click="selectTreatment(treatment)"
                      class="p-4 border-2 rounded-lg text-left transition-all hover:shadow-md"
                      :class="selectedTreatment?.id === treatment.id ? 
                              'border-[#6a5b8b] bg-[#6a5b8b]/10' : 'border-gray-200 hover:border-[#6a5b8b]/50'">
                <div class="font-semibold">{{ treatment.name }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ treatment.description }}</div>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-[#6a5b8b] font-bold">{{ formatCurrency(treatment.price) }}</span>
                  <span class="text-xs text-gray-500">{{ treatment.duration_minutes }} menit</span>
                </div>
              </button>
            </div>
            <div v-if="loadingTreatments" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6a5b8b]"></div>
            </div>
          </div>

          <!-- Step 2: Pilih Tanggal -->
          <div v-show="currentStep === 2">
            <h3 class="text-xl font-semibold mb-4">Pilih Tanggal</h3>
            <div class="mb-4">
              <input type="date" 
                     v-model="selectedDate"
                     :min="minDate"
                     :max="maxDate"
                     @change="loadAvailableSlots"
                     class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#6a5b8b] focus:outline-none text-lg">
            </div>
            <button @click="currentStep = 1" class="text-[#6a5b8b] hover:underline">â† Kembali</button>
          </div>

          <!-- Step 3: Pilih Waktu -->
          <div v-show="currentStep === 3">
            <h3 class="text-xl font-semibold mb-4">Pilih Waktu Tersedia</h3>
            <p class="text-sm text-gray-600 mb-4">{{ formatDateDisplay(selectedDate) }}</p>
            
            <div v-if="loadingSlots" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6a5b8b]"></div>
              <p class="mt-2 text-gray-600">Memuat jadwal...</p>
            </div>

            <div v-else-if="availableSlots.length === 0" class="text-center py-8 text-gray-500">
              <p>Tidak ada slot tersedia untuk tanggal ini</p>
              <button @click="currentStep = 2" class="mt-4 text-[#6a5b8b] hover:underline">â† Pilih tanggal lain</button>
            </div>

            <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              <button v-for="slot in availableSlots" :key="slot.time"
                      @click="selectTimeSlot(slot)"
                      :disabled="!slot.available"
                      class="p-3 border-2 rounded-lg font-semibold transition-all"
                      :class="slot.available ? 
                              (selectedTimeSlot === slot.time ? 
                                'border-[#6a5b8b] bg-[#6a5b8b] text-white' : 
                                'border-gray-200 hover:border-[#6a5b8b] hover:bg-[#6a5b8b]/10') :
                              'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'">
                {{ slot.time }}
                <span v-if="slot.available && slot.spotsLeft < 3" class="block text-xs mt-1">
                  {{ slot.spotsLeft }} slot
                </span>
              </button>
            </div>
            <button @click="currentStep = 2" class="mt-4 text-[#6a5b8b] hover:underline">â† Kembali</button>
          </div>

          <!-- Step 4: Isi Data -->
          <div v-show="currentStep === 4">
            <h3 class="text-xl font-semibold mb-4">Data Diri</h3>
            <form @submit.prevent="submitBooking" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Nama Lengkap *</label>
                <input v-model="formData.customer_name" type="text" required
                       class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#6a5b8b] focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Nomor Telepon *</label>
                <input v-model="formData.customer_phone" type="tel" required
                       class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#6a5b8b] focus:outline-none"
                       placeholder="08123456789">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input v-model="formData.customer_email" type="email"
                       class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#6a5b8b] focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Catatan (opsional)</label>
                <textarea v-model="formData.notes" rows="3"
                          class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#6a5b8b] focus:outline-none"
                          placeholder="Permintaan khusus atau catatan lainnya..."></textarea>
              </div>

              <!-- Summary -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">Ringkasan Booking:</h4>
                <div class="space-y-1 text-sm">
                  <p><strong>Treatment:</strong> {{ selectedTreatment?.name }}</p>
                  <p><strong>Tanggal:</strong> {{ formatDateDisplay(selectedDate) }}</p>
                  <p><strong>Waktu:</strong> {{ selectedTimeSlot }} - {{ calculateEndTime() }}</p>
                  <p><strong>Durasi:</strong> {{ selectedTreatment?.duration_minutes }} menit</p>
                  <p class="text-lg font-bold text-[#6a5b8b] mt-2">Total: {{ formatCurrency(selectedTreatment?.price) }}</p>
                </div>
              </div>

              <div v-if="bookingError" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {{ bookingError }}
              </div>

              <div class="flex gap-3">
                <button type="button" @click="currentStep = 3" 
                        class="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                  Kembali
                </button>
                <button type="submit" :disabled="submitting"
                        class="flex-1 py-3 bg-[#6a5b8b] text-white rounded-lg font-semibold hover:bg-[#44395b] disabled:opacity-50">
                  {{ submitting ? 'Memproses...' : 'Konfirmasi Booking' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Step 5: Success -->
          <div v-show="currentStep === 5" class="text-center py-8">
            <div class="text-6xl mb-4">âœ…</div>
            <h3 class="text-2xl font-bold mb-2">Booking Berhasil!</h3>
            <p class="text-gray-600 mb-6">
              Reservasi Anda telah diterima. Kami akan segera menghubungi Anda untuk konfirmasi.
            </p>
            <div class="bg-gray-50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
              <h4 class="font-semibold mb-2">Detail Booking:</h4>
              <div class="space-y-1 text-sm">
                <p><strong>Nama:</strong> {{ formData.customer_name }}</p>
                <p><strong>Treatment:</strong> {{ selectedTreatment?.name }}</p>
                <p><strong>Tanggal:</strong> {{ formatDateDisplay(selectedDate) }}</p>
                <p><strong>Waktu:</strong> {{ selectedTimeSlot }}</p>
              </div>
            </div>
            <button @click="resetForm" 
                    class="px-6 py-3 bg-[#6a5b8b] text-white rounded-lg font-semibold hover:bg-[#44395b]">
              Booking Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { dataService } from '@/composables/dataService'

const steps = ['Pilih Treatment', 'Pilih Tanggal', 'Pilih Waktu', 'Isi Data', 'Selesai']
const currentStep = ref(1)

const loadingTreatments = ref(true)
const loadingSlots = ref(false)
const submitting = ref(false)
const bookingError = ref('')

const treatments = ref([])
const selectedTreatment = ref(null)
const selectedDate = ref('')
const selectedTimeSlot = ref('')
const availableSlots = ref([])

const formData = ref({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  notes: ''
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 7) // max 7 days ahead
  return date.toISOString().split('T')[0]
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateEndTime = () => {
  if (!selectedTimeSlot.value || !selectedTreatment.value) return ''
  const [hours, minutes] = selectedTimeSlot.value.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + selectedTreatment.value.duration_minutes
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

const loadTreatments = async () => {
  try {
    loadingTreatments.value = true
    const { data, error } = await dataService.getTreatments()
    if (error) throw error
    treatments.value = data
  } catch (error) {
    console.error('Error loading treatments:', error)
  } finally {
    loadingTreatments.value = false
  }
}

const selectTreatment = (treatment) => {
  selectedTreatment.value = treatment
  currentStep.value = 2
  selectedDate.value = minDate.value
  loadAvailableSlots()
}

const loadAvailableSlots = async () => {
  if (!selectedDate.value || !selectedTreatment.value) return
  
  try {
    loadingSlots.value = true
    const { data, error } = await dataService.getAvailableSlots(
      selectedDate.value,
      selectedTreatment.value.id
    )
    if (error) throw error
    availableSlots.value = data.filter(slot => slot.available)
    currentStep.value = 3
  } catch (error) {
    console.error('Error loading slots:', error)
    alert('Gagal memuat jadwal. Silakan coba lagi.')
  } finally {
    loadingSlots.value = false
  }
}

const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot.time
  currentStep.value = 4
}

const submitBooking = async () => {
  try {
    bookingError.value = ''
    submitting.value = true

    const bookingData = {
      customer_name: formData.value.customer_name,
      customer_phone: formData.value.customer_phone,
      customer_email: formData.value.customer_email,
      treatment_id: selectedTreatment.value.id,
      treatment_name: selectedTreatment.value.name,
      booking_date: selectedDate.value,
      start_time: selectedTimeSlot.value,
      end_time: calculateEndTime(),
      duration_minutes: selectedTreatment.value.duration_minutes,
      price: selectedTreatment.value.price,
      notes: formData.value.notes
    }

    const { data, error } = await dataService.createBooking(bookingData)
    if (error) throw error

    currentStep.value = 5
  } catch (error) {
    console.error('Error creating booking:', error)
    bookingError.value = 'Gagal membuat booking. Silakan coba lagi atau hubungi kami langsung.'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  selectedTreatment.value = null
  selectedDate.value = ''
  selectedTimeSlot.value = ''
  availableSlots.value = []
  formData.value = {
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: ''
  }
  bookingError.value = ''
}

onMounted(() => {
  loadTreatments()
})
</script>
