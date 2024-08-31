<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'

const hoymilesService = inject<HoymilesService>('hoymilesService')

onMounted(async () => {
  const stations = await hoymilesService?.getStations()
})
</script>

<template>
  <div class="container">
    <span class="text-2xl">Test</span>
  </div>
</template>
