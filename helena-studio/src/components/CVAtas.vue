<template>
  <section id="home" class="bg-white py-8 md:py-12 lg:py-16">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <!-- Left Content -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
          class="space-y-6"
        >
          <div>
            <h1 
              class="leading-[60px]" 
              style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(36px, 5vw, 60px)"
            >
              Daniel Belawa Koten
            </h1>
            <h1 
              class="leading-[60px]" 
              style="font-family: 'Playfair Display', serif; color: #4a5565; font-size: clamp(16px, 1.2vw, 18px)"
            >
              11231019 - Informatika - Institut Teknologi Kalimantan
            </h1>
          </div>

          <p 
            class="text-[#4a5565] leading-[29.25px]"
            style="font-size: clamp(16px, 1.2vw, 18px)"
          >
            Perkenalkan nama saya Daniel Belawa Koten, saya adalah seorang mahasiswa Institut Teknologi Kalimantan dari program studi Informatika angkatan 2023. Saya merupakan seseorang yang tertarik di bidang teknologi, seperti komputer, jaringan komputer, dan juga pemograman.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="scrollToTreatments"
              class="bg-white h-9 rounded-full px-8 flex items-center justify-center text-[#b76e79] border border-[#b76e79] hover:bg-[#b76e79] hover:text-white transition-colors w-full sm:w-auto"
              style="font-family: 'Poppins', sans-serif; font-weight: 500"
            >
              Lihat Pengalaman Saya
            </button>
          </div>
        </div>

        <!-- Right Image -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600, delay: 300 } }"
          class="relative"
        >
          <div class="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <img 
              :src="heroImage" 
              alt="CVFoto" 
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref } from 'vue'
import heroImage from '@/assets/CVFoto.png'
import PesanSekarang from './PesanSekarang.vue'

const props = defineProps({
  onBookNow: Function,
  onViewServices: Function
})

const showBookingModal = ref(false)

const handleBookNow = () => {
  if (props.onBookNow) {
    props.onBookNow()
  } else {
    showBookingModal.value = true
  }
}

const scrollToTreatments = () => {
  if (props.onViewServices) {
    props.onViewServices()
  } else {
    const element = document.getElementById('treatments')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>