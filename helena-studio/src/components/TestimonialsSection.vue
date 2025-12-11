<template>
  <section 
    id="testimonials" 
    class="py-12 md:py-16 lg:py-20"
    style="background-color: rgba(183, 110, 121, 0.44)"
  >
    <div class="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        class="text-center mb-12 lg:mb-16 leading-12"
        style="font-family: 'Playfair Display', serif; color: #4a5565; font-size: clamp(32px, 4vw, 48px)"
      >
        What Clients Say
      </h2>

      <!-- Carousel Container -->
      <div class="relative max-w-7xl mx-auto">
        <div class="overflow-hidden mx-auto" :style="{ maxWidth: containerMaxWidth }">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ 
              transform: `translateX(${translateValue}px)`,
              gap: '24px',
              paddingLeft: centerPadding,
              paddingRight: centerPadding
            }"
          >
            <div
              v-for="(testimonial, index) in displayTestimonials"
              :key="`testimonial-${index}`"
              class="bg-white rounded-2xl p-6 md:p-8 shadow-lg shrink-0 flex flex-col"
              :style="{ 
                width: cardWidth + 'px',
                minHeight: '520px'
              }"
            >
              <div class="space-y-4 flex flex-col h-full">
                <!-- Name and Rating -->
                <div class="flex items-center justify-between">
                  <p
                    class="leading-6 text-lg font-semibold"
                    style="font-family: 'Playfair Display', serif; color: #4a5565"
                  >
                    {{ testimonial.name }}
                  </p>
                  <div class="flex gap-1">
                  <svg 
                    v-for="i in Math.floor(testimonial.rating)" 
                    :key="'full-' + i"
                    class="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 16 16"
                  >
                    <path 
                      d="M8 1.33301L10.06 5.50634L14.6667 6.17967L11.3333 9.42634L12.12 14.013L8 11.8463L3.88 14.013L4.66667 9.42634L1.33333 6.17967L5.94 5.50634L8 1.33301Z" 
                      fill="#B76E79" 
                      stroke="#B76E79" 
                      stroke-width="1.33333" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                    />
                  </svg>
                  <svg 
                    v-if="testimonial.rating % 1 !== 0"
                    class="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 16 16"
                  >
                    <path 
                      d="M8 1.33301L10.06 5.50634L14.6667 6.17967L11.3333 9.42634L12.12 14.013L8 11.8463L3.88 14.013L4.66667 9.42634L1.33333 6.17967L5.94 5.50634L8 1.33301Z" 
                      fill="#B76E79" 
                      stroke="#B76E79" 
                      stroke-width="1.33333" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      opacity="0.5" 
                    />
                  </svg>
                </div>
              </div>

              <!-- Image -->
              <div class="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style="min-height: 250px">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.name"
                  class="w-full h-full object-contain"
                />
              </div>

                <!-- Testimonial Text -->
                <p class="text-[#4a5565] text-sm md:text-base leading-6 text-center">
                  "{{ testimonial.text }}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <!-- Previous Button -->
          <button
            @click="handlePrev"
            class="bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-[#b76e79] hover:text-white transition-all"
            aria-label="Previous testimonials"
          >
            <ChevronLeft class="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <!-- Pagination Dots -->
          <div class="flex justify-center gap-2">
            <button
              v-for="(testimonial, index) in testimonials"
              :key="index"
              @click="currentIndex = index"
              class="rounded-full transition-all"
              :class="[
                index === currentIndex 
                  ? 'bg-[#b76e79] w-8 h-2' 
                  : 'bg-[#b76e79] opacity-30 hover:opacity-60 w-2 h-2'
              ]"
              :aria-label="`Go to slide ${index + 1}`"
            />
          </div>

          <!-- Next Button -->
          <button
            @click="handleNext"
            class="bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-[#b76e79] hover:text-white transition-all"
            aria-label="Next testimonials"
          >
            <ChevronRight class="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import testi1 from '@/assets/Testi1.jpeg'
import testi2 from '@/assets/Testi2.jpeg'
import testi3 from '@/assets/Testi3.jpeg'
import testi4 from '@/assets/Testi4.jpeg'
import testi5 from '@/assets/Testi5.jpeg'
import testi6 from '@/assets/Testi6.jpeg'
import testi7 from '@/assets/Testi7.jpeg'
import testi8 from '@/assets/Testi8.jpeg'
import testi9 from '@/assets/Testi9.jpeg'

const currentIndex = ref(0)
const cardsPerView = ref(3)
const isTransitioning = ref(false)

const testimonials = [
  {
    id: 1,
    name: "Sarah Martinez",
    rating: 5,
    image: testi1,
    text: "Benar-benar suka dengan Helena Studio! orangnya profesional dan hasilnya selalu memuaskan. Rambutku terasa lebih indah dan aku jadi jauh lebih percaya diri."
  },
  {
    id: 2,
    name: "Maya Putri",
    rating: 4.5,
    image: testi2,
    text: "Treatment di sini benar-benar mewah. Rambutku terasa lebih sehat dan berkilau dari sebelumnya."
  },
  {
    id: 3,
    name: "Amanda Wilson",
    rating: 5,
    image: testi3,
    text: "Setiap kali datang ke Helena Studio, rasanya selalu menyenangkan. Perhatiannya pada detail dan keahlian stylist-nya luar biasa"
  },
  {
    id: 4,
    name: "Rizka Amelia",
    rating: 5,
    image: testi4,
    text: "Pelayanannya sangat ramah dan hasil hair coloringnya sempurna! Warnanya natural dan tahan lama."
  },
  {
    id: 5,
    name: "Diana Lestari",
    rating: 4.5,
    image: testi5,
    text: "Tempatnya nyaman dan bersih. Hair spa treatment-nya bikin rambut aku jadi super lembut dan wangi."
  },
  {
    id: 6,
    name: "Clarissa Wong",
    rating: 5,
    image: testi6,
    text: "Stylistnya sangat ahli dan paham apa yang aku mau. Hasilnya selalu melampaui ekspektasi!"
  },
  {
    id: 7,
    name: "Fitri Handayani",
    rating: 5,
    image: testi7,
    text: "Sudah langganan di Helena Studio lebih dari 2 tahun. Kualitas layanan selalu konsisten dan memuaskan."
  },
  {
    id: 8,
    name: "Jessica Tan",
    rating: 4.5,
    image: testi8,
    text: "Harganya worth it banget dengan kualitas yang didapat. Keratin treatment-nya bikin rambut aku jadi super smooth!"
  },
  {
    id: 9,
    name: "Nurul Azizah",
    rating: 5,
    image: testi9,
    text: "Recommended banget! Staff-nya friendly, tempatnya cozy, dan hasilnya always on point. Best salon in town!"
  }
]

// Triple testimonials for seamless infinite loop
const displayTestimonials = computed(() => {
  return [...testimonials, ...testimonials, ...testimonials]
})

// Fixed card widths - larger for mobile and tablet
const cardWidth = computed(() => {
  if (cardsPerView.value === 1) {
    // Mobile: larger card, more breathing room
    return window.innerWidth < 400 ? 280 : 340
  }
  if (cardsPerView.value === 2) {
    // Tablet: fill available space with 2 cards
    return Math.min(380, (window.innerWidth - 120) / 2 - 12)
  }
  return 300 // Desktop: 4 cards
})

// Container max width to prevent extra cards from showing
const containerMaxWidth = computed(() => {
  const gap = 24
  if (cardsPerView.value === 1) return `${cardWidth.value}px`
  if (cardsPerView.value === 2) return `${(cardWidth.value * 2) + gap}px`
  return `${(cardWidth.value * 4) + (gap * 3)}px`
})

// Center padding to center the carousel
const centerPadding = computed(() => {
  return '0px'
})

// Calculate translate value for smooth sliding
const translateValue = computed(() => {
  // Start from middle set to enable infinite loop
  const offsetIndex = testimonials.length + currentIndex.value
  const gap = 24
  
  // Calculate pixels to translate
  return -(offsetIndex * (cardWidth.value + gap))
})

const updateCardsPerView = () => {
  if (window.innerWidth < 768) {
    cardsPerView.value = 1
  } else if (window.innerWidth < 1280) {
    cardsPerView.value = 2
  } else {
    cardsPerView.value = 4
  }
}

const handlePrev = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  currentIndex.value--
  
  // Seamless loop backward
  if (currentIndex.value < 0) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = testimonials.length - 1
    }, 500)
  } else {
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }
}

const handleNext = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  currentIndex.value++
  
  // Seamless loop forward
  if (currentIndex.value >= testimonials.length) {
    setTimeout(() => {
      isTransitioning.value = false
      currentIndex.value = 0
    }, 500)
  } else {
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }
}

onMounted(() => {
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCardsPerView)
})
</script>
