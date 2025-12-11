<template>
  <div class="space-y-4 text-[#4A5565]">
    <div>
      <h3 class="text-lg font-semibold text-[#B76E79] mb-3">🔍 HASIL Analisis</h3>
      <ul class="space-y-2 bg-gray-50 p-4 rounded-lg">
        <li class="flex items-start gap-2">
          <span class="font-bold text-[#B76E79] min-w-[140px]">Bentuk Wajah:</span>
          <span>{{ analysis.faceShape }}</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-bold text-[#B76E79] min-w-[140px]">Jenis Rambut:</span>
          <span>{{ analysis.hairType }}</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-bold text-[#B76E79] min-w-[140px]">Panjang Rambut:</span>
          <span>{{ analysis.hairLength }}</span>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="font-semibold text-[#B76E79] mb-2">Catatan Stylist:</h4>
      <p class="italic bg-[#B76E79]/5 p-4 rounded-lg border-l-4 border-[#B76E79]">
        {{ analysis.stylistNotes }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  analysis: {
    type: Object,
    required: true
  }
})
</script>
