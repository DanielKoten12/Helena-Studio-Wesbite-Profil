<template>
  <nav 
    class="sticky top-0 z-50 bg-white transition-shadow duration-300"
    :class="scrolled ? 'shadow-lg' : 'shadow-sm'"
  >
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
      <div class="flex items-center justify-between">
        <button 
          @click="$router.push('/')"
          class="cursor-pointer flex items-center"
        >
          <img src="@/assets/navbar-logo.png" alt="Helena Studio" class="h-11 md:h-14 w-auto object-contain" />
        </button>
        
        <!-- Desktop Navigation -->
        <div class="hidden lg:flex gap-8">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="transition-colors"
            :class="[
              item.isBold ? 'font-semibold' : '',
              $route.name === item.routeName ? 'text-[#544771]' : 'text-gray-700 hover:text-[#6a5b8b]'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            @click="handleBookNow"
            class="hidden lg:block rounded-full px-6 lg:px-8 h-10 text-white hover:opacity-90 transition-opacity"
            style="background-color: #544771"
          >
            Pesan Sekarang
          </button>

          <!-- Mobile/Tablet Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2"
            style="color: #544771"
          >
            <X v-if="mobileMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="lg:hidden mt-4 pb-4 border-t border-[#e7e2f0] pt-4">
          <div class="mobile-menu-panel rounded-2xl p-4">
            <div class="flex flex-col gap-2">
              <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.to"
                @click="mobileMenuOpen = false"
                class="mobile-nav-item"
                :class="[
                  item.isBold ? 'font-semibold' : '',
                  $route.name === item.routeName ? 'mobile-nav-item-active' : ''
                ]"
              >
                <component :is="item.icon" :size="17" class="shrink-0" />
                <span>{{ item.name }}</span>
              </router-link>

              <button
                @click="handleBookNow(); mobileMenuOpen = false"
                class="rounded-full w-full h-10 text-white transition-colors"
                style="background: linear-gradient(90deg, #544771 0%, #6a5b8b 100%)"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Booking Modal -->
  <PesanSekarang v-model:open="showBookingModal" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Home, Menu, Scissors, Sparkles, MapPin, Users, X } from 'lucide-vue-next'
import PesanSekarang from './PesanSekarang.vue'

const mobileMenuOpen = ref(false)
const showBookingModal = ref(false)
const scrolled = ref(false)

const navItems = [
  { name: 'Home', to: '/', routeName: 'home', icon: Home },
  { name: 'Treatments', to: '/treatments', routeName: 'treatments', icon: Scissors },
  { name: 'About Us', to: '/about', routeName: 'about', icon: Users },
  { name: 'Find Us', to: '/contact', routeName: 'contact', icon: MapPin },
  { name: 'Hairstyle AI', to: '/hairstyle-ai', routeName: 'hairstyle-ai', icon: Sparkles, isBold: true }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleBookNow = () => {
  showBookingModal.value = true
}
</script>

<style scoped>
.mobile-menu-panel {
  background: linear-gradient(180deg, #f4f2f9 0%, #ffffff 100%);
  border: 1px solid #dfd8ec;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  color: #4b5563;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  color: #544771;
  background: #eee9f7;
}

.mobile-nav-item-active {
  color: #544771;
  background: #e9e3f5;
  box-shadow: inset 0 0 0 1px #d5cbe7;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.24s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>