<template>
  <section id="home" class="bg-white py-8 md:py-12 lg:py-16">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <!-- Left Content -->
        <div class="space-y-6">
          <div>
            <h1 
              class="leading-[60px]" 
              style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(36px, 5vw, 60px)"
            >
              Welcome to
              <br />
              Helena Studio
            </h1>
          </div>

          <p 
            class="text-[#4a5565] leading-[29.25px]"
            style="font-size: clamp(16px, 1.2vw, 18px)"
          >
            Rasakan pelayanan kecantikan dan perawatan rambut premium yang dirancang untuk menonjolkan keanggunan alami Anda. Di Helena Studio, kami memadukan keahlian profesional dengan sentuhan kemewahan untuk memberikan hasil yang memukau dan berkesan.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="handleBookNow"
              class="bg-[#b76e79] h-9 rounded-full px-8 flex items-center justify-center text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
              style="font-family: 'Poppins', sans-serif; font-weight: 500"
            >
              Pesan Sekarang
            </button>
            <button 
              @click="scrollToTreatments"
              class="bg-white h-9 rounded-full px-8 flex items-center justify-center text-[#b76e79] border border-[#b76e79] hover:bg-[#b76e79] hover:text-white transition-colors w-full sm:w-auto"
              style="font-family: 'Poppins', sans-serif; font-weight: 500"
            >
              Lihat Layanan Kami
            </button>
          </div>
        </div>

        <!-- Right Image -->
        <div class="relative">
          <div class="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <img 
              :src="heroImage" 
              alt="Helena Studio" 
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import heroImage from '@/assets/HeroHome.png'

const props = defineProps({
  onBookNow: Function,
  onViewServices: Function
})

const handleBookNow = () => {
  if (props.onBookNow) {
    props.onBookNow()
  } else {
    window.open('https://wa.me/6282255819535', '_blank')
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