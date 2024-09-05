<script setup lang="ts">
import type { StationData } from '@/hoymiles/models/hoymiles'

defineProps<{
  stationDetail?: StationData
  station: StationData
}>()

const getRevenue = (factor?: number, value?: number) => {
  if (!value || !factor) {
    return ''
  }

  return ((value / 1000) * factor).toFixed(2)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-money-bill text-blue-500" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Today: </span>
      </div>
      <span class="text-center">
        {{ stationDetail?.money_data.unit }}
        {{ getRevenue(stationDetail?.electricity_price, station?.stationRealData?.today_eq) }}</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-wallet text-orange-300" style="font-size: 1.5rem"></i>
        <span class="text-1xl">This month: </span>
      </div>
      <span class="text-center">
        {{ stationDetail?.money_data.unit }}
        {{ getRevenue(stationDetail?.electricity_price, station?.stationRealData?.month_eq) }}</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-euro text-green-400" style="font-size: 1.5rem"></i>
        <span class="text-1xl">This year: </span>
      </div>
      <span class="text-center">
        {{ stationDetail?.money_data.unit }}
        {{ getRevenue(stationDetail?.electricity_price, station?.stationRealData?.year_eq) }}</span
      >
    </div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row gap-2">
        <i class="pi pi-chart-line text-red-500" style="font-size: 1.5rem"></i>
        <span class="text-1xl">Lifetime: </span>
      </div>
      <span class="text-center">
        {{ stationDetail?.money_data.unit }}
        {{ getRevenue(stationDetail?.electricity_price, station?.stationRealData?.total_eq) }}</span
      >
    </div>
  </div>
</template>
