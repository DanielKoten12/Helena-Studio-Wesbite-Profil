<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="bg-[#f7f7f7] py-12 md:py-16 lg:py-20">
      <div class="max-w-6xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <!-- Left: Image -->
          <div 
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 600 } }"
            class="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
          >
            <img 
              :src="treatment.image" 
              :alt="treatment.title" 
              class="w-full h-auto object-cover"
            />
          </div>

          <!-- Right: Content -->
          <div 
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 600, delay: 200 } }"
            class="space-y-6"
          >
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
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }" 
          class="text-center mb-12 leading-12"
          style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: clamp(32px, 4vw, 48px)"
        >
          Manfaat Treatment
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          <div 
            v-for="(benefit, index) in treatment.benefits"
            :key="index"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: index * 100 } }"
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

    <!-- Booking Modal -->
    <PesanSekarang v-model:open="showBookingModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Clock } from 'lucide-vue-next'
import TreatmentTestimonials from './TreatmentTestimonials.vue'
import PesanSekarang from './PesanSekarang.vue'
import ColoringImage from '../assets/ColoringTreatment.png'
import Testi1 from '../assets/ColoringTesti1.jpeg'
import Testi2 from '../assets/ColoringTesti2.jpeg'
import Testi3 from '../assets/ColoringTesti3.jpeg'
import Testi4 from '../assets/ColoringTesti4.jpeg'
import Testi5 from '../assets/ColoringTesti5.jpeg'

const showBookingModal = ref(false)

const treatment = {
  id: 'hair-coloring',
  title: 'Hair Coloring',
  description: 'Ubah tampilan Anda dengan pewarnaan rambut profesional menggunakan produk berkualitas tinggi yang aman dan tahan lama. Warna sempurna untuk gaya Anda.',
  price: 'Rp 350.000',
  image: ColoringImage,
  duration: '120 menit',
  benefits: [
    'Konsultasi warna gratis dengan colorist berpengalaman',
    'Produk pewarna premium dari brand terkemuka',
    'Teknik pewarnaan yang merata dan natural',
    'Perawatan rambut setelah pewarnaan',
    'Garansi hasil warna hingga 6 minggu'
  ]
}

const testimonials = [
  {
    id: 1,
    name: 'Jessica Lee',
    rating: 5,
    image: Testi1,
    text: 'Warna rambutnya keluar sempurna! Sesuai dengan yang saya mau dan tahan lama. Colorist-nya sangat profesional.'
  },
  {
    id: 2,
    name: 'Ryan Cooper',
    rating: 5,
    image: Testi2,
    text: 'Hasil pewarnaan sangat memuaskan dan rambut tetap sehat. Produk yang digunakan berkualitas tinggi.'
  },
  {
    id: 3,
    name: 'Sophia Anderson',
    rating: 4.5,
    image: Testi3,
    text: 'Senang sekali dengan hasilnya! Warna rambut saya terlihat natural dan tidak merusak rambut.'
  },
  {
    id: 4,
    name: 'Daniel Kim',
    rating: 5,
    image: Testi4,
    text: 'Proses pewarnaan yang cepat dan hasilnya luar biasa. Warna yang saya pilih benar-benar cocok!'
  },
  {
    id: 5,
    name: 'Olivia Brown',
    rating: 5,
    image: Testi5,
    text: 'Pewarnaan terbaik yang pernah saya coba. Rambut tetap lembut dan warnanya vibrant.'
  }
]

const handleBookNow = () => {
  showBookingModal.value = true
}
</script>