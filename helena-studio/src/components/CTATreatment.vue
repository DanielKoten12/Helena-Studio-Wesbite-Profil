<template>
  <section class="bg-[#b76e79] py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="flex flex-col items-center text-center gap-8"
      >
        <h2 
          class="leading-12 text-white"
          style="font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 48px)"
        >
          Siap Tampil dengan Gaya Baru?
        </h2>
        
        <p 
          class="text-white leading-[29.25px] max-w-[902px]"
          style="font-size: clamp(16px, 1.2vw, 18px)"
        >
          Pesan jadwal Anda hari ini dan rasakan pengalaman perawatan premium di Helena Studio.
          Tim profesional kami siap membantu Anda tampil menawan dan percaya diri dengan pesona terbaik Anda.
        </p>
        
        <button 
          @click="handleReservation"
          class="bg-white h-12 rounded-full px-12 text-[#b76e79] hover:bg-[#f7f7f7] transition-colors text-[18px]"
          style="font-family: 'Poppins', sans-serif; font-weight: 500"
        >
          Reservasi Sekarang
        </button>
      </div>
    </div>
  </section>

  <!-- Booking Modal -->
  <PesanSekarang v-model:open="showBookingModal" />
</template>

<script setup>
import { ref } from 'vue'
import PesanSekarang from './PesanSekarang.vue'

const showBookingModal = ref(false)

const handleReservation = () => {
  showBookingModal.value = true
}
</script>
