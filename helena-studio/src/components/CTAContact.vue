<template>
  <section class="bg-white py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        <!-- Left Content - Contact Information -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          class="space-y-6 md:space-y-8"
        >
          <h2 
            class="font-medium mb-6 md:mb-8"
            style="font-family: 'Playfair Display', serif; color: #b76e79; font-size: clamp(28px, 4vw, 36px); line-height: 1.2"
          >
            Hubungi Kami
          </h2>

          <div class="space-y-5 md:space-y-6">
            <!-- Address -->
            <div class="flex gap-3 md:gap-4 items-start">
              <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#f7f7f7] rounded-full flex items-center justify-center">
                <MapPin :size="20" class="text-[#b76e79] md:w-6 md:h-6" />
              </div>
              <div class="space-y-1 md:space-y-2">
                <h3 
                  class="font-medium text-neutral-950"
                  style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 20px); line-height: 1.4"
                >
                  {{ contactInfo.address.title }}
                </h3>
                <div class="space-y-0">
                  <p 
                    v-for="(line, index) in contactInfo.address.lines" 
                    :key="index"
                    class="text-[#4a5565]"
                    style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <!-- WhatsApp -->
            <div class="flex gap-3 md:gap-4 items-start">
              <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#f7f7f7] rounded-full flex items-center justify-center">
                <Phone :size="20" class="text-[#b76e79] md:w-6 md:h-6" />
              </div>
              <div class="space-y-1 md:space-y-2">
                <h3 
                  class="font-medium text-neutral-950"
                  style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 20px); line-height: 1.4"
                >
                  {{ contactInfo.whatsapp.title }}
                </h3>
                <a 
                  :href="getWhatsAppLink()"
                  class="text-[#4a5565] hover:text-[#b76e79] transition-colors"
                  style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
                >
                  {{ contactInfo.whatsapp.number }}
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div class="flex gap-3 md:gap-4 items-start">
              <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#f7f7f7] rounded-full flex items-center justify-center">
                <Instagram :size="20" class="text-[#b76e79] md:w-6 md:h-6" />
              </div>
              <div class="space-y-1 md:space-y-2">
                <h3 
                  class="font-medium text-neutral-950"
                  style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 20px); line-height: 1.4"
                >
                  {{ contactInfo.instagram.title }}
                </h3>
                <a 
                  :href="getInstagramLink()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[#4a5565] hover:text-[#b76e79] transition-colors"
                  style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
                >
                  {{ contactInfo.instagram.handle }}
                </a>
              </div>
            </div>

            <!-- Opening Hours -->
            <div class="flex gap-3 md:gap-4 items-start">
              <div class="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#f7f7f7] rounded-full flex items-center justify-center">
                <Clock :size="20" class="text-[#b76e79] md:w-6 md:h-6" />
              </div>
              <div class="space-y-1 md:space-y-2">
                <h3 
                  class="font-medium text-neutral-950"
                  style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 20px); line-height: 1.4"
                >
                  {{ contactInfo.openingHours.title }}
                </h3>
                <div class="space-y-0.5 md:space-y-1">
                  <p 
                    v-for="(time, index) in contactInfo.openingHours.schedule" 
                    :key="index"
                    class="text-[#4a5565]"
                    style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.3vw, 16px); line-height: 1.5"
                  >
                    {{ time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Interactive Google Maps -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600, delay: 200 } }"
          class="lg:sticky lg:top-24 mt-8 lg:mt-0"
        >
          <div class="rounded-2xl overflow-hidden shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.2)] transition-shadow duration-300">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!4v1763926315971!6m8!1m7!1sb3nBmgmGHb9ZSIb-9XakDg!2m2!1d0.5394328286079709!2d117.5178969102082!3f36.85079905949215!4f-4.41066575294802!5f0.7820865974627469" 
              class="w-full h-[300px] md:h-[400px] lg:h-[500px]" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <!-- Map Link Button -->
          <a 
            :href="contactInfo.mapLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 flex items-center justify-center gap-2 bg-[#b76e79] text-white rounded-full px-6 py-3 hover:opacity-90 transition-opacity"
            style="font-family: 'Poppins', sans-serif; font-weight: 500; font-size: clamp(14px, 1.2vw, 16px)"
          >
            <MapPin :size="18" />
            Buka di Google Maps
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { MapPin, Phone, Instagram, Clock } from 'lucide-vue-next'

const contactInfo = {
  address: {
    title: 'Alamat',
    lines: [
      'Jalan Danau Kelimutu, G. House , No.8h',
      'Sangatta Utara, Kutai Timur',
      'Kalimantan Timur'
    ]
  },
  whatsapp: {
    title: 'WhatsApp',
    number: '0822-5051-3575'
  },
  instagram: {
    title: 'Instagram',
    handle: '@helenastudio_hairsalon'
  },
  openingHours: {
    title: 'Opening Hours',
    schedule: [
      'Senin - Jumat: 9:00 AM - 8:00 PM',
      'Sabtu: 10:00 AM - 9:00 PM',
      'Minggu: 10:00 AM - 6:00 PM'
    ]
  },
  mapLink: 'https://maps.app.goo.gl/MhaEGp1cqjfJYf8AA'
}

const getWhatsAppLink = () => {
  const cleanNumber = contactInfo.whatsapp.number.replace(/^0/, '').replace(/[-\s]/g, '')
  return `https://wa.me/62${cleanNumber}`
}

const getInstagramLink = () => {
  return `https://instagram.com/${contactInfo.instagram.handle.replace('@', '')}`
}
</script>
