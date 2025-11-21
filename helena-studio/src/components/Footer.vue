<template>
  <footer style="background-color: #F7F7F7" class="border-t border-gray-200">
    <div class="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <!-- Address & Hours -->
        <div>
          <h3 
            class="text-xl md:text-2xl mb-3 md:mb-4" 
            style="font-family: 'Playfair Display', serif; color: #B76E79"
          >
            Visit Us
          </h3>
          <p class="text-gray-600 mb-2 text-sm md:text-base">Jalan Danau Kelimutu, G. House , No.8</p>
          <p class="text-gray-600 mb-4 text-sm md:text-base">Sangatta Utara, Kutai Timur</p>
          <div class="text-gray-600 text-sm md:text-base">
            <p class="mb-1">Senin - Jumat</p>
            <p class="mb-1">10:00 AM - 8:00 PM</p>
            <p>Sabtu - Minggu: 11:00 AM - 6:00 PM</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 
            class="text-xl md:text-2xl mb-3 md:mb-4" 
            style="font-family: 'Playfair Display', serif; color: #B76E79"
          >
            Quick Links
          </h3>
          <div class="flex flex-col gap-2">
            <router-link 
              to="/"
              class="text-gray-600 hover:text-[#B76E79] transition-colors text-left text-sm md:text-base"
            >
              Home
            </router-link>
            <router-link 
              to="/treatments"
              class="text-gray-600 hover:text-[#B76E79] transition-colors text-left text-sm md:text-base"
            >
              Treatments
            </router-link>
            <router-link 
              to="/about"
              class="text-gray-600 hover:text-[#B76E79] transition-colors text-left text-sm md:text-base"
            >
              About Us
            </router-link>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h3 
            class="text-xl md:text-2xl mb-3 md:mb-4" 
            style="font-family: 'Playfair Display', serif; color: #B76E79"
          >
            Our Contact
          </h3>
          <div class="space-y-3">
            <a 
              href="https://instagram.com/helenastudio_kaltim" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] transition-colors text-sm md:text-base"
            >
              <Instagram class="w-5 h-5" />
              <span>@helenastudio_kaltim</span>
            </a>
            <a 
              href="tel:0822-5581-9535" 
              class="flex items-center gap-2 text-gray-600 hover:text-[#B76E79] transition-colors text-sm md:text-base"
            >
              <Phone class="w-5 h-5" />
              <span>0822-5581-9535</span>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 text-center text-gray-600 text-sm md:text-base">
        <p>© 2025 Helena Studio. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Instagram, Phone } from 'lucide-vue-next'
</script>