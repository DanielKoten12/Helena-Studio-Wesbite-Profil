<template>
  <section id="home" class="bg-[#F7F7F7] py-14 md:py-20">
    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="text-center mb-10">
        <h1
          class="mb-4 font-bold"
          style="font-family: 'Playfair Display', serif; color: #544771; font-size: clamp(30px, 4vw, 44px)"
        >
          Welcome to Helena Studio Website
        </h1>
        <div class="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full border border-[#544771]/30 bg-white">
          <Sparkles :size="13" color="#544771" />
          <span
            class="text-[#544771] uppercase"
            style="font-family: 'Poppins', sans-serif; font-size: 11px; letter-spacing: 0.12em"
          >
            Penawaran Eksklusif
          </span>
        </div>
        <h2
          class="leading-tight"
          style="font-family: 'Playfair Display', serif; color: #1a1a1a"
        >
          Promo Spesial Helena Studio
        </h2>
        <p
          class="text-[#6b7280] mt-3 max-w-xl mx-auto"
          style="font-family: 'Poppins', sans-serif; font-size: 15px"
        >
          Nikmati berbagai penawaran eksklusif kami yang dirancang khusus untuk memberikan
          pengalaman kecantikan terbaik dengan harga terjangkau.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 items-stretch">
        <div
          class="relative rounded-2xl overflow-hidden group cursor-pointer min-h-[480px] lg:min-h-[520px] shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <img
            :src="featuredPromo.image_url"
            :alt="featuredPromo.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

          <div class="absolute top-5 left-5 right-5 flex items-start justify-between">
            <span
              class="inline-flex items-center gap-1.5 bg-[#544771] text-white px-3 py-1.5 rounded-full"
              style="font-family: 'Poppins', sans-serif; font-size: 10px; letter-spacing: 0.1em"
            >
              <Tag :size="10" />
              {{ featuredPromo.tag }}
            </span>
            <span
              class="bg-white text-[#544771] px-3 py-1.5 rounded-full shadow-md"
              style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700"
            >
              {{ featuredPromo.badge }}
            </span>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h3
              class="text-white mb-2 leading-tight"
              style="font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 30px)"
            >
              {{ featuredPromo.title }}
            </h3>
            <p
              class="text-white/80 mb-5 leading-relaxed"
              style="font-family: 'Poppins', sans-serif; font-size: 14px"
            >
              {{ featuredPromo.description }}
            </p>

            <div class="flex items-baseline gap-3 mb-4">
              <span
                class="text-white/50 line-through"
                style="font-family: 'Poppins', sans-serif; font-size: 14px"
              >
                {{ formatCurrency(featuredPromo.original_price) }}
              </span>
              <span
                class="text-white"
                style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700"
              >
                {{ formatCurrency(featuredPromo.discounted_price) }}
              </span>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div
                class="flex items-center gap-1.5 text-white/60"
                style="font-family: 'Poppins', sans-serif; font-size: 12px"
              >
                <Clock3 :size="12" />
                Berlaku hingga {{ formatDateLabel(featuredPromo.valid_until) }}
              </div>
              <button
                @click="handleBookNow"
                class="flex items-center gap-2 bg-[#544771] hover:bg-[#44395b] text-white px-6 py-2.5 rounded-full transition-colors duration-200 sm:ml-auto"
                style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500"
              >
                Pesan Sekarang
                <ChevronRight :size="14" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div
            v-for="promo in secondaryPromos"
            :key="promo.id"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer flex flex-col"
          >
            <div class="relative h-44 overflow-hidden">
              <img
                :src="promo.image_url"
                :alt="promo.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />

              <div class="absolute top-4 left-4 right-4 flex items-start justify-between">
                <span
                  class="inline-flex items-center gap-1.5 bg-[#544771] text-white px-2.5 py-1 rounded-full"
                  style="font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 0.1em"
                >
                  <Tag :size="8" />
                  {{ promo.tag }}
                </span>
                <span
                  class="bg-white text-[#544771] px-2.5 py-1 rounded-full shadow-sm"
                  style="font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700"
                >
                  {{ promo.badge }}
                </span>
              </div>
            </div>

            <div class="p-5 flex flex-col flex-1">
              <h4
                class="text-[#1a1a1a] mb-1.5 leading-snug"
                style="font-family: 'Playfair Display', serif; font-size: 18px"
              >
                {{ promo.title }}
              </h4>
              <p
                class="text-[#6b7280] mb-4 leading-relaxed flex-1"
                style="font-family: 'Poppins', sans-serif; font-size: 13px"
              >
                {{ promo.description }}
              </p>

              <div class="flex items-center justify-between pt-3 border-t border-[#f0f0f0]">
                <div>
                  <span
                    class="block text-[#9ca3af] line-through leading-none"
                    style="font-family: 'Poppins', sans-serif; font-size: 11px"
                  >
                    {{ formatCurrency(promo.original_price) }}
                  </span>
                  <span
                    class="text-[#544771]"
                    style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700"
                  >
                    {{ formatCurrency(promo.discounted_price) }}
                  </span>
                </div>
                <div class="text-right">
                  <div
                    class="flex items-center gap-1 text-[#9ca3af] mb-2 justify-end"
                    style="font-family: 'Poppins', sans-serif; font-size: 11px"
                  >
                    <Clock3 :size="10" />
                    s/d {{ formatDateLabel(promo.valid_until) }}
                  </div>
                  <button
                    @click="handleBookNow"
                    class="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-[#544771] text-[#544771] hover:text-white border border-[#544771]/30 hover:border-[#544771] px-4 py-2 rounded-full transition-all duration-200"
                    style="font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500"
                  >
                    Pesan
                    <ChevronRight :size="12" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[#544771]/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#544771]/10 flex items-center justify-center shrink-0">
            <Sparkles :size="16" color="#544771" />
          </div>
          <p
            class="text-[#4a5565]"
            style="font-family: 'Poppins', sans-serif; font-size: 14px"
          >
            Ingin melihat semua layanan premium kami?
            <span class="text-[#544771]"> Tersedia berbagai treatment eksklusif untukmu.</span>
          </p>
        </div>
        <button
          @click="scrollToTreatments"
          class="flex items-center gap-2 border border-[#544771] text-[#544771] hover:bg-[#544771] hover:text-white px-6 py-2.5 rounded-full transition-colors duration-200 whitespace-nowrap shrink-0"
          style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500"
        >
          Lihat Semua Layanan
          <ChevronRight :size="14" />
        </button>
      </div>
    </div>
  </section>

  <PesanSekarang v-model:open="showBookingModal" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Sparkles, Tag, Clock3, ChevronRight } from 'lucide-vue-next'
import { dataService } from '@/composables/dataService'
import PesanSekarang from './PesanSekarang.vue'

const props = defineProps({
  onBookNow: Function,
  onViewServices: Function
})

const showBookingModal = ref(false)
const promos = ref([])

const defaultPromos = [
  {
    id: 'default-1',
    tag: 'PROMO UNGGULAN',
    badge: '-30%',
    title: 'Paket Bridal Spesial',
    description:
      'Tampil memukau di hari istimewa Anda. Dapatkan paket lengkap Hair Styling, Makeup, dan Hairdo oleh stylist profesional kami.',
    original_price: 1200000,
    discounted_price: 840000,
    valid_until: '2026-04-30',
    image_url:
      'https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    is_featured: true,
    display_order: 0,
    is_active: true
  },
  {
    id: 'default-2',
    tag: 'PROMO TERBATAS',
    badge: '-20%',
    title: 'Hair Treatment Express',
    description: 'Perawatan Keratin + Deep Conditioning untuk rambut sehat, lembut, dan berkilau.',
    original_price: 400000,
    discounted_price: 320000,
    valid_until: '2026-03-31',
    image_url:
      'https://images.unsplash.com/photo-1638609269267-f0128098a809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    is_featured: false,
    display_order: 1,
    is_active: true
  },
  {
    id: 'default-3',
    tag: 'BUNDLING HEMAT',
    badge: '-25%',
    title: 'Makeup & Hairdo Combo',
    description: 'Kombinasi Makeup Flawless dan Hairdo Elegan. Sempurna untuk acara pesta dan wisuda.',
    original_price: 600000,
    discounted_price: 450000,
    valid_until: '2026-04-15',
    image_url:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    is_featured: false,
    display_order: 2,
    is_active: true
  }
]

const activePromos = computed(() => {
  return promos.value.length > 0 ? promos.value : defaultPromos
})

const featuredPromo = computed(() => {
  const featured = activePromos.value.find((item) => item.is_featured)
  return featured || activePromos.value[0] || defaultPromos[0]
})

const secondaryPromos = computed(() => {
  return activePromos.value.filter((item) => item.id !== featuredPromo.value.id).slice(0, 2)
})

const formatCurrency = (amount) => {
  const numeric = Number(amount || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(numeric)
}

const formatDateLabel = (dateValue) => {
  if (!dateValue) return '-'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return String(dateValue)

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parsed)
}

const handleBookNow = () => {
  if (props.onBookNow) {
    props.onBookNow()
    return
  }
  showBookingModal.value = true
}

const scrollToTreatments = () => {
  if (props.onViewServices) {
    props.onViewServices()
    return
  }

  const element = document.getElementById('treatments')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  try {
    const promoData = await dataService.getPromos(3)
    if (promoData.length > 0) {
      promos.value = promoData
    }
  } catch (error) {
    console.error('Error loading promos:', error)
  }
})
</script>
