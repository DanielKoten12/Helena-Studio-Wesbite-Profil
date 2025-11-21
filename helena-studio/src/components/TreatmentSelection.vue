<template>
  <section class="bg-white py-12 md:py-16 lg:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <!-- Treatment Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="treatment in treatmentsData"
          :key="treatment.id"
          class="bg-white rounded-2xl overflow-hidden shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-shadow"
        >
          <!-- Image -->
          <div class="h-[227.55px] overflow-hidden">
            <img 
              :src="treatment.image" 
              :alt="treatment.title" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Content -->
          <div class="p-6 space-y-3">
            <!-- Title -->
            <h3 
              class="font-normal leading-8 text-[24px] text-neutral-950"
              style="font-family: 'Playfair Display', serif"
            >
              {{ treatment.title }}
            </h3>

            <!-- Description -->
            <p 
              class="leading-6 text-[#4a5565] text-[16px] min-h-[78px]"
              style="font-family: 'Poppins', sans-serif"
            >
              {{ treatment.description }}
            </p>

            <!-- Price and Button -->
            <div class="flex items-center justify-between pt-3">
              <p 
                class="font-normal leading-8 text-[#b76e79] text-[24px]"
                style="font-family: 'Playfair Display', serif"
              >
                {{ treatment.price }}
              </p>
              
              <router-link 
                :to="treatment.link"
                class="bg-white h-9 rounded-lg px-[16.8px] py-[8.8px] flex items-center justify-center text-[#b76e79] border-[0.8px] border-[#b76e79] border-solid hover:bg-[#b76e79] hover:text-white transition-colors"
              >
                <span 
                  class="font-medium leading-5 text-[14px]"
                  style="font-family: 'Poppins', sans-serif"
                >
                  View Details
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import haircutImg from '@/assets/HaircutTreatment.png'
import coloringImg from '@/assets/ColoringTreatment.png'
import keratinImg from '@/assets/KeratinTreament.png'
import hairdoImg from '@/assets/HairdoTreatment.png'
import makeupImg from '@/assets/MakeupTreatment.png'

const treatmentsData = [
  {
    id: 'haircut',
    title: 'Haircut',
    description: 'Potongan rambut profesional yang disesuaikan dengan bentuk wajah dan gaya pribadi Anda.',
    price: 'Rp80.000',
    image: haircutImg,
    link: '/treatments/haircut'
  },
  {
    id: 'hair-coloring',
    title: 'Hair Coloring',
    description: 'Ubah tampilan Anda dengan teknik pewarnaan modern dan hasil warna lembut dan alami.',
    price: 'Rp150.000',
    image: coloringImg,
    link: '/treatments/hair-coloring'
  },
  {
    id: 'hair-keratin',
    title: 'Hair Keratin Treatment',
    description: 'Perawatan untuk mengembalikan kilau rambut agar tetap sehat, halus, dan mudah diatur.',
    price: 'Rp120.000',
    image: keratinImg,
    link: '/treatments/hair-keratin'
  },
  {
    id: 'hairdo',
    title: 'Hairdo',
    description: 'Tata rambut elegan yang disesuaikan dengan tema acara dan bentuk wajah Anda.',
    price: 'Rp120.000',
    image: hairdoImg,
    link: '/treatments/hairdo'
  },
  {
    id: 'makeup',
    title: 'Makeup',
    description: 'Tampilan sempurna untuk setiap momen spesial. Makeup dengan teknik yang sempurna.',
    price: 'Rp120.000',
    image: makeupImg,
    link: '/treatments/makeup'
  }
]
</script>
