<script setup lang="ts">
import type { StationData } from '@/hoymiles/models/hoymiles'

defineProps<{
  station: StationData
}>()

const getFormattedEnergyData = (data?: number) => {
  return ((data ?? 0) / 1000).toFixed(2)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-sun" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Energy Today: </span>
      </div>
      <span class="text-center"
        >{{ getFormattedEnergyData(station.stationRealData?.today_eq) }} kWh</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-sun" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Energy This Month: </span>
      </div>
      <span class="text-center"
        >{{ getFormattedEnergyData(station.stationRealData?.month_eq) }} kWh</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-sun" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Energy This Year: </span>
      </div>
      <span class="text-center"
        >{{ getFormattedEnergyData(station.stationRealData?.year_eq) }} kWh</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-sun" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Lifetime energy: </span>
      </div>
      <span class="text-center"
        >{{ getFormattedEnergyData(station.stationRealData?.year_eq) }} kWh</span
      >
    </div>
  </div>
</template>
