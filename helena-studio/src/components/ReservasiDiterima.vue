<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
      <DialogPortal>
        <DialogOverlay 
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 200 } }"
          class="fixed inset-0 bg-black/50 z-50" 
        />
        <DialogContent 
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 300, ease: 'easeOut' } }"
          class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-lg w-[90%] max-w-[500px] p-0"
        >
        <div class="relative bg-white rounded-2xl p-6 md:p-8">
          <!-- Close Button (X) -->
          <button
            @click="$emit('update:open', false)"
            class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#b76e79] focus:ring-offset-2"
          >
            <X :size="16" class="text-[#4a5565]" />
            <span class="sr-only">Close</span>
          </button>

          <!-- Header -->
          <div class="space-y-2 mb-6 pr-8">
            <h2 
              class="font-semibold text-[30px] leading-9 text-[#b76e79]"
              style="font-family: 'Playfair Display', serif"
            >
              Reservasi Diterima
            </h2>
            <p 
              class="text-[14px] leading-5 text-[#717182]"
              style="font-family: 'Poppins', sans-serif"
            >
              Terima kasih telah mempercayakan perawatan Anda kepada Helena Studio. Tim kami akan segera menghubungi Anda untuk memastikan jadwal dan detail layanan.
            </p>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end">
            <button
              @click="$emit('update:open', false)"
              class="bg-[#b76e79] hover:bg-[#a15e69] text-white px-6 py-2 rounded-lg transition-colors"
              style="font-family: 'Poppins', sans-serif; font-size: 14px; line-height: 20px"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
import { 
  DialogRoot, 
  DialogPortal, 
  DialogOverlay, 
  DialogContent 
} from 'radix-vue'
import { X } from 'lucide-vue-next'

defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:open'])
</script>
