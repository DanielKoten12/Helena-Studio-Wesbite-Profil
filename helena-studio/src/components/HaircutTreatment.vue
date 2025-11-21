<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="bg-[#f7f7f7] py-12 md:py-16 lg:py-20">
      <div class="max-w-6xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <!-- Left: Image -->
          <div class="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <img 
              :src="treatment.image" 
              :alt="treatment.title" 
              class="w-full h-auto object-cover"
            />
          </div>

          <!-- Right: Content -->
          <div class="space-y-6">
            <h1 
              class="leading-[60px]"
              style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(36px, 5vw, 60px)"
            >
              {{ treatment.title }}
            </h1>

            <p 
              class="text-[#4a5565] leading-[29.25px]"
              style="font-size: clamp(16px, 1.2vw, 18px)"
            >
              {{ treatment.description }}
            </p>

            <div class="flex items-center gap-4 pt-4">
              <div class="flex items-center gap-2 text-[#b76e79]">
                <Clock class="w-5 h-5" />
                <span style="font-family: 'Poppins', sans-serif; font-size: 16px">
                  {{ treatment.duration }}
                </span>
              </div>
              <div class="h-6 w-px bg-[#b76e79] opacity-30"></div>
              <p 
                class="text-[#b76e79]"
                style="font-family: 'Playfair Display', serif; font-size: 28px"
              >
                {{ treatment.price }}
              </p>
            </div>

            <button 
              @click="handleBookNow"
              class="bg-[#b76e79] h-12 rounded-full px-12 text-white hover:opacity-90 transition-opacity"
              style="font-family: 'Poppins', sans-serif; font-weight: 500"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="bg-white py-12 md:py-16 lg:py-20">
      <div class="max-w-6xl mx-auto px-4 md:px-8">
        <h2 
          class="text-center mb-12 leading-12"
          style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(32px, 4vw, 48px)"
        >
          Manfaat Treatment
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          <div 
            v-for="(benefit, index) in treatment.benefits"
            :key="index"
            class="flex gap-4 p-6 bg-[#f7f7f7] rounded-xl"
          >
            <div 
              class="shrink-0 w-8 h-8 rounded-full bg-[#b76e79] flex items-center justify-center text-white"
              style="font-family: 'Poppins', sans-serif; font-weight: 600"
            >
              {{ index + 1 }}
            </div>
            <p class="text-[#4a5565] leading-6" style="font-size: 16px">
              {{ benefit }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <TreatmentTestimonials :testimonials="testimonials" />
  </div>
</template>

<script setup>
import { Clock } from 'lucide-vue-next'
import TreatmentTestimonials from './TreatmentTestimonials.vue'
import HaircutImage from '../assets/HaircutTreatment.png'
import Testi1 from '../assets/HaircutTesti1.jpeg'
import Testi2 from '../assets/HaircutTesti2.jpeg'
import Testi3 from '../assets/HaircutTesti3.jpeg'
import Testi4 from '../assets/HaircutTesti4.jpeg'
import Testi5 from '../assets/HaircutTesti5.jpeg'

const treatment = {
  id: 'haircut',
  title: 'Haircut',
  description: 'Dapatkan potongan rambut profesional yang sesuai dengan bentuk wajah dan gaya hidup Anda. Stylist berpengalaman kami akan membantu Anda menemukan gaya yang sempurna.',
  price: 'Rp 150.000',
  image: HaircutImage,
  duration: '60 menit',
  benefits: [
    'Konsultasi gaya rambut gratis dengan stylist profesional',
    'Teknik pemotongan modern dan presisi tinggi',
    'Perawatan rambut dengan produk premium',
    'Styling gratis setelah potong rambut',
    'Tips perawatan rambut di rumah dari ahlinya'
  ]
}

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    image: Testi1,
    text: 'Potong rambut di Helena Studio benar-benar mengubah penampilan saya! Stylist sangat profesional dan mengerti apa yang saya inginkan.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    image: Testi2,
    text: 'Pelayanan yang luar biasa! Hasil potongan rambut sangat rapi dan sesuai dengan bentuk wajah saya. Highly recommended!'
  },
  {
    id: 3,
    name: 'Amanda Williams',
    rating: 4.5,
    image: Testi3,
    text: 'Tempat yang nyaman dengan hasil yang memuaskan. Saya akan kembali lagi untuk treatment lainnya.'
  },
  {
    id: 4,
    name: 'David Martinez',
    rating: 5,
    image: Testi4,
    text: 'Stylist di Helena Studio sangat ahli dan memberikan saran yang tepat untuk gaya rambut saya. Puas sekali!'
  },
  {
    id: 5,
    name: 'Emma Thompson',
    rating: 5,
    image: Testi5,
    text: 'Pengalaman potong rambut terbaik yang pernah saya alami. Hasilnya sangat natural dan sesuai harapan.'
  }
]

const handleBookNow = () => {
  const message = encodeURIComponent('Halo, saya ingin booking treatment Haircut')
  window.open(`https://wa.me/6281234567890?text=${message}`, '_blank')
}
</script>