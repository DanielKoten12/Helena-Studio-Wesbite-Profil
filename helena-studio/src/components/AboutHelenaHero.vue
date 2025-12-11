<template>
  <section class="bg-white py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <!-- Left Content -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          class="space-y-6"
        >
          <h1 
            class="font-normal leading-[60px]"
            style="font-family: 'Playfair Display', serif; color: #b76e79; font-size: clamp(36px, 6vw, 60px)"
          >
            About Helena
          </h1>
          
          <div class="space-y-6 text-[#4a5565]">
            <p 
              class="leading-[29.25px]"
              style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px)"
            >
              Helena Studio lahir dari kecintaan pada dunia kecantikan dan keinginan untuk menciptakan ruang di mana keanggunan bertemu dengan keahlian.
              <br />
              Berawal dari sebuah mimpi sederhana, kini Helena Studio tumbuh menjadi salon yang berkomitmen membantu setiap pelanggan tampil dan merasa lebih percaya diri dengan pesona terbaiknya.
            </p>
            
            <p 
              class="leading-[29.25px]"
              style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px)"
            >
              Setiap layanan yang kami berikan adalah hasil dari bertahun-tahun pelatihan, dedikasi, dan ketulusan hati.
              <br />
              Bagi kami, kecantikan bukan sekadar pekerjaan—ini adalah panggilan untuk menghadirkan rasa percaya diri dan kebahagiaan bagi setiap orang yang kami layani. 💇‍♀️💖
            </p>
          </div>
        </div>

        <!-- Right Content - Image with Name Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600, delay: 200 } }"
          class="relative mt-8 lg:mt-0"
        >
          <div class="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] relative">
            <img 
              :src="helenaPhoto" 
              alt="Helena Koten" 
              class="w-full h-[400px] md:h-[500px] lg:h-[640px] object-cover"
            />
            
            <!-- Name Card Overlay -->
            <div class="absolute bottom-8 md:bottom-12 lg:bottom-20 right-4 md:right-8 bg-[#b76e79] rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
              <h3 
                class="text-white leading-7"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px)"
              >
                Helena Koten
              </h3>
              <p 
                class="text-[rgba(255,255,255,0.8)] leading-6"
                style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.2vw, 16px)"
              >
                Owner and Stylist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import helenaPhoto from '../assets/AboutHelena.jpeg'
</script>
