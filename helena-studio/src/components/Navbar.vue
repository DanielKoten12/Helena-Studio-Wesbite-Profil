<template>
  <nav class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
      <div class="flex items-center justify-between">
        <button 
          @click="$router.push('/')"
          style="font-family: 'Playfair Display', serif"
          class="cursor-pointer"
        >
          <span class="text-xl md:text-2xl" style="color: #B76E79">Helena Studio</span>
        </button>
        
        <!-- Desktop Navigation -->
        <div class="hidden lg:flex gap-8">
          <router-link 
            to="/"
            class="transition-colors"
            :class="$route.name === 'home' ? 'text-[#B76E79]' : 'text-gray-700 hover:text-[#B76E79]'"
          >
            Home
          </router-link>
          <router-link 
            to="/treatments"
            class="transition-colors"
            :class="$route.name === 'treatments' ? 'text-[#B76E79]' : 'text-gray-700 hover:text-[#B76E79]'"
          >
            Treatments
          </router-link>
          <router-link 
            to="/about"
            class="transition-colors"
            :class="$route.name === 'about' ? 'text-[#B76E79]' : 'text-gray-700 hover:text-[#B76E79]'"
          >
            About Us
          </router-link>
          <router-link 
            to="/contact"
            class="transition-colors"
            :class="$route.name === 'contact' ? 'text-[#B76E79]' : 'text-gray-700 hover:text-[#B76E79]'"
          >
            Find Us
          </router-link>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            @click="handleBookNow"
            class="hidden lg:block rounded-full px-6 lg:px-8 h-10 text-white hover:opacity-90 transition-opacity"
            style="background-color: #B76E79"
          >
            Pesan Sekarang
          </button>

          <!-- Mobile/Tablet Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2"
            style="color: #B76E79"
          >
            <X v-if="mobileMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
        <div class="flex flex-col gap-4">
          <router-link 
            to="/"
            @click="mobileMenuOpen = false"
            class="text-left transition-colors"
            :class="$route.name === 'home' ? 'text-[#B76E79]' : 'text-gray-700'"
          >
            Home
          </router-link>
          <router-link 
            to="/treatments"
            @click="mobileMenuOpen = false"
            class="text-left transition-colors"
            :class="$route.name === 'treatments' ? 'text-[#B76E79]' : 'text-gray-700'"
          >
            Treatments
          </router-link>
          <router-link 
            to="/about"
            @click="mobileMenuOpen = false"
            class="text-left transition-colors"
            :class="$route.name === 'about' ? 'text-[#B76E79]' : 'text-gray-700'"
          >
            About Us
          </router-link>
          <router-link 
            to="/contact"
            @click="mobileMenuOpen = false"
            class="text-left transition-colors"
            :class="$route.name === 'contact' ? 'text-[#B76E79]' : 'text-gray-700'"
          >
            Find Us
          </router-link>
          <button 
            @click="handleBookNow(); mobileMenuOpen = false"
            class="rounded-full w-full h-10 text-white hover:opacity-90 transition-opacity"
            style="background-color: #B76E79"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)

const handleBookNow = () => {
  window.open('https://wa.me/6282255819535', '_blank')
}
</script>