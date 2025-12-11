<template>
  <section class="bg-[#f7f7f7] py-12 md:py-16 lg:py-20 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16">
        <h2 
          class="font-normal mb-4"
          style="font-family: 'Playfair Display', serif; color: #b76e79; font-size: clamp(32px, 5vw, 48px); line-height: 1.2"
        >
          Perjalanan Kami — Helena Studio
        </h2>
        <p 
          class="text-[#4a5565] max-w-[825px] mx-auto"
          style="font-family: 'Poppins', sans-serif; font-size: clamp(16px, 1.5vw, 18px); line-height: 1.625"
        >
          Setiap kisah sukses memiliki tantangannya sendiri. Inilah bagaimana dedikasi, semangat, dan kerja keras mengubah impian menjadi Helena Studio.
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative max-w-4xl mx-auto space-y-8 md:space-y-12">
        <!-- Vertical Line - Hidden on mobile, shown on desktop -->
        <div class="hidden md:block absolute left-8 top-16 bottom-16 w-0.5 bg-[#b76e79] opacity-30" />
        
        <div 
          v-for="(item, index) in timelineData" 
          :key="index"
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 500, delay: index * 100 } }"
          class="relative flex gap-4 md:gap-8 items-start"
        >
          <!-- Year Badge -->
          <div class="relative shrink-0 w-12 h-12 md:w-16 md:h-16 bg-[#b76e79] rounded-full shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] border-2 md:border-4 border-white flex items-center justify-center z-10">
            <span 
              class="text-white"
              style="font-family: 'Playfair Display', serif; font-size: clamp(12px, 1.2vw, 14px); line-height: 1.4"
            >
              {{ item.year }}
            </span>
          </div>

          <!-- Content Card -->
          <div class="flex-1 bg-white rounded-2xl shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-4 md:p-6 lg:p-8 space-y-2 md:space-y-3">
            <h3 
              class="font-medium text-[#b76e79]"
              style="font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 24px); line-height: 1.3"
            >
              {{ item.title }}
            </h3>
            <p 
              class="text-[#4a5565] whitespace-pre-line"
              style="font-family: 'Poppins', sans-serif; font-size: clamp(14px, 1.2vw, 16px); line-height: 1.625"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const timelineData = [
  {
    year: '2013',
    title: 'Awal Perjalanan',
    description: 'Setelah lulus SMA, kami memilih melanjutkan pendidikan di Sekolah Salon Jhonny Andrean Jakarta Selatan, mempelajari tata rambut dari tingkat dasar hingga profesional.\nSelama 2 tahun, kami memperdalam dasar-dasar perawatan rambut dan tata rias, hingga akhirnya lulus dengan Sertifikat Profesional Hairstylist pada tahun 2015.'
  },
  {
    year: '2015',
    title: 'Pertumbuhan Profesional',
    description: 'Setelah lulus, kami mulai bekerja di salah satu salon di Jakarta selama 2 tahun untuk mengasah keahlian dan pengalaman langsung di dunia kerja.\nDi masa ini kami belajar banyak tentang layanan pelanggan, teknik potong rambut, dan etika kerja salon profesional.'
  },
  {
    year: '2017',
    title: 'Memperluas Wawasan',
    description: 'Pada tahun 2017, kami memutuskan untuk kembali ke Sangatta, Kalimantan Timur, dan mengambil kelas Complete Hair Styling di Samarinda.\nKelas ini memperdalam kemampuan kami di bidang Hairdo modern hingga Hairdo adat Indonesia, menjadikan kami lebih fleksibel dan kreatif dalam menata gaya rambut.'
  },
  {
    year: '2018',
    title: 'Awal Karier Freelance',
    description: 'Setelah menyelesaikan kelas Hairdo, kami mulai membuka layanan Hairdo untuk berbagai acara, seperti pernikahan, wisuda, dan event lainnya.\nSelain itu, kami juga bekerja paruh waktu di salah satu salon di Sangatta, sambil terus belajar teknik smoothing, perawatan tubuh dan wajah (SPA), creambath, serta makeup.\nMasa ini menjadi pengalaman berharga karena kami bisa bekerja sambil belajar, menambah wawasan, dan membangun kepercayaan diri sebagai hairstylist.'
  },
  {
    year: '2020',
    title: 'Masa Berhenti dan Bangkit',
    description: 'Awal tahun 2020, pandemi COVID-19 membuat aktivitas kami sempat terhenti.\nNamun, kami tidak menyerah — kami tetap aktif di media sosial, membuat konten seputar makeup dan hairdo agar tetap berkarya dan terhubung dengan dunia kecantikan.'
  },
  {
    year: '2021',
    title: 'Kembali Berkarya',
    description: 'Setelah masa sulit berlalu, kami kembali memperdalam ilmu dengan mengikuti kelas Basic Make Up dan Profesional Hairdo di Imel Vilentcia Surabaya.\nDi sini kami belajar teknik make up untuk kulit matang, mata monolid, serta membuat hairdo bertekstur modern dan kekinian.'
  },
  {
    year: '2022',
    title: 'Mewarnai Awal Baru',
    description: 'Di awal tahun 2022, kami melanjutkan pelatihan di Rika Hair Studio Samarinda, mengikuti kelas Profesional Coloring selama 2 minggu.\nKami mempelajari teknik bleaching yang benar, balayage, peek-a-boo, ombre, dan berbagai teknik pewarnaan rambut modern lainnya.\nDan akhirnya, pada April 2022, kami memulai langkah besar kami dengan mendirikan Helena Studio Hair Salon, mewujudkan mimpi yang telah dibangun sejak lama.'
  }
]
</script>
