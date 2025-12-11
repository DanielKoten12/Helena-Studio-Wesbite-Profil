<template>
  <section class="bg-white py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16">
        <h2 
          class="font-normal mb-4"
          style="font-family: 'Playfair Display', serif; color: #b76e79; font-size: clamp(32px, 5vw, 48px); line-height: 1.2"
        >
          Certifications & Training
        </h2>
        <p 
          class="text-[#4a5565] max-w-[912px] mx-auto"
          style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px); line-height: 1.625"
        >
          Pembelajaran berkelanjutan dan pengembangan profesional menjadi kunci bagi kami untuk selalu memberikan layanan terbaik kepada setiap klien. Berikut beberapa sertifikasi dan pelatihan yang menjadi bukti keahlian tim Helena Studio dalam menghadirkan hasil terbaik di bidang kecantikan dan tata rambut.
        </p>
      </div>

      <!-- Certifications Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        <div 
          v-for="(cert, index) in certificationsData"
          :key="cert.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 150 } }"
          class="bg-white rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15),0px_10px_10px_-5px_rgba(0,0,0,0.04)] p-4 md:p-6 lg:p-8 space-y-4 transition-shadow duration-300 cursor-pointer"
        >
          <!-- Certificate Image -->
          <div class="h-[200px] md:h-[260px] lg:h-[321px] overflow-hidden rounded-2xl">
            <img 
              :src="cert.image" 
              :alt="cert.title" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Certificate Info -->
          <div class="flex gap-3 md:gap-4 items-start">
            <!-- Icon -->
            <div class="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#fff5f7] rounded-full flex items-center justify-center">
              <Award :size="28" class="text-[#b76e79]" />
            </div>

            <!-- Text Info -->
            <div class="space-y-1 md:space-y-2">
              <h3 
                class="font-normal text-[#b76e79]"
                style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 1.8vw, 20px); line-height: 1.4"
              >
                {{ cert.title }}
              </h3>
              <p 
                class="text-[#4a5565]"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
              >
                {{ cert.location }}
              </p>
              <p 
                class="text-[#6a7282]"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(13px, 1.2vw, 14px); line-height: 1.4"
              >
                {{ cert.year }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Award } from 'lucide-vue-next'
import imgCert1 from '../assets/JonnyAndreanSertif.png'
import imgCert2 from '../assets/ImelSertif.png'
import imgCert3 from '../assets/MarisaSertif.png'

const certificationsData = [
  {
    id: 1,
    image: imgCert1,
    title: 'Jhonny Andrean Salon Academy',
    location: 'Jakarta Selatan',
    year: 'Certified 2015'
  },
  {
    id: 2,
    image: imgCert2,
    title: 'Imel Vilentcia',
    location: 'Surabaya',
    year: 'Certified 2021'
  },
  {
    id: 3,
    image: imgCert3,
    title: 'Rika Hair Studio',
    location: 'Samarinda',
    year: 'Certified 2022'
  }
]
</script>