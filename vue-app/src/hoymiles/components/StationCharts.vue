<script setup lang="ts">
import type { StationData } from '@/hoymiles/models/hoymiles'
import { inject, ref, type Ref } from 'vue'
import type { ChartDecoder } from '@/charts/services/chart-decoder-service'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import  { getChartOptions } from '../resources/chart-utils';

const props = defineProps<{
  stationData: StationData
}>()

const station: Ref<StationData> = ref(props.stationData);

const chartDecoderService = inject<ChartDecoder>('chartDecoderService')

const hoymilesService = inject<HoymilesService>('hoymilesService')

const chartsData: Ref<
  Map<
    string,
    {
      labels?: any[]
      datasets?: any[]
    }
  >
> = ref(new Map<string, {}>())

const getFormattedDate = (date: Date): string => {
  return date.toISOString().substring(0, 10)
}

const loadChartData = async (
  stationData: StationData
): Promise<{ labels?: string[]; datasets?: any[] } | undefined> => {
  if (!stationData) {
    return
  }

  stationData.chartCalendarDate ??= new Date()

  const key = JSON.stringify({
    id: stationData.id,
    dateString: getFormattedDate(stationData.chartCalendarDate)
  })

  if (chartsData.value.has(key)) {
    return chartsData.value.get(key)
  }

  const buffer = await hoymilesService?.getDailyData(
    stationData.id.toString(),
    getFormattedDate(stationData.chartCalendarDate)
  )

  const uintArray = new Uint8Array(buffer!)

  const chartData = chartDecoderService?.decode(uintArray)

  const data: {
    labels: string[]
    datasets: any[]
  } = {
    labels: chartData?.labels!,
    datasets: []
  }

  data.datasets.push({
    label: 'Production',
    data: chartData!.data,
    borderWidth: 1,
    fill: true
  })

  chartsData.value.set(key, data)
}

const getChartData = (id?: number, dateString?: string) => {
  return chartsData.value.get(JSON.stringify({ id, dateString }))
}

</script>

<template>
  <DatePicker
    v-model="station.chartCalendarDate"
    dateFormat="dd.mm.yy"
    @date-select="loadChartData(stationData)"
  ></DatePicker>
  <DeferredContent @load="loadChartData(stationData)">
    <Chart
      type="bar"
      :data="getChartData(stationData.id, getFormattedDate(stationData.chartCalendarDate ?? new Date()))"
      :options="getChartOptions()"
    ></Chart>
  </DeferredContent>
</template>
