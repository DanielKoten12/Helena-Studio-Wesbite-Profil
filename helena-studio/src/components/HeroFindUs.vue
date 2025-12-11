<template>
  <section class="bg-[#f7f7f7] py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div 
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="max-w-6xl mx-auto text-center"
    >
      <h1 
        class="font-normal mb-6 md:mb-8"
        style="font-family: 'Playfair Display', serif; color: #b76e79; font-size: clamp(36px, 6vw, 60px); line-height: 1.2"
      >
        Find Us
      </h1>
      
      <p 
        class="text-[#4a5565] max-w-[664px] mx-auto"
        style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px); line-height: 1.55"
      >
        Kunjungi salon kami atau hubungi kami untuk informasi lebih lanjut.
        <br />
        Tim kami siap membantu Anda tampil percaya diri dengan perawatan terbaik dari Helena Studio.
      </p>
    </div>
  </section>
</template>

<script setup>
</script>
