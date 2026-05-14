<template>
  <TreatmentDetailDynamic :slug="slug" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TreatmentDetailDynamic from '@/components/TreatmentDetailDynamic.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
</script>
