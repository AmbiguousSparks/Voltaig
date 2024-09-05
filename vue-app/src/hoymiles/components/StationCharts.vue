<script setup lang="ts">
import { ChartsType, type StationData } from '@/hoymiles/models/hoymiles'
import { inject, ref, type Ref } from 'vue'
import type { ChartDecoder } from '@/charts/services/chart-decoder-service'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import { getChartOptions } from '../resources/chart-utils'

const props = defineProps<{
  stationData: StationData
}>()

const station: Ref<StationData> = ref(props.stationData)

const chartDecoderService = inject<ChartDecoder>('chartDecoderService')

const hoymilesService = inject<HoymilesService>('hoymilesService')

const isLoading = ref(false)

const chartsSettings: Ref<
  Map<
    ChartsType,
    {
      dateFormat: string
      getBufferFn: (sid: string, date: string) => Promise<ArrayBuffer> | undefined
      dateView: 'date' | 'month' | 'year' | undefined
      showDatePicker: boolean
    }
  >
> = ref(
  new Map<
    ChartsType,
    {
      dateFormat: string
      getBufferFn: (sid: string, date: string) => Promise<ArrayBuffer> | undefined
      dateView: 'date' | 'month' | 'year' | undefined
      showDatePicker: boolean
    }
  >()
)

chartsSettings.value.set(ChartsType.Day, {
  getBufferFn: (sid, date) => hoymilesService?.getDailyData(sid, date),
  dateFormat: 'dd.mm.yy',
  dateView: 'date',
  showDatePicker: true
})
chartsSettings.value.set(ChartsType.Month, {
  getBufferFn: (sid, date) => hoymilesService?.getMonthData(sid, date),
  dateFormat: 'mm.yy',
  dateView: 'month',
  showDatePicker: true
})
chartsSettings.value.set(ChartsType.Year, {
  getBufferFn: (sid, date) => hoymilesService?.getYearData(sid, date),
  dateFormat: 'yy',
  dateView: 'year',
  showDatePicker: true
})

chartsSettings.value.set(ChartsType.Lifetime, {
  getBufferFn: (sid, date) => hoymilesService?.getTotalData(sid, date),
  dateFormat: '',
  dateView: undefined,
  showDatePicker: false
})

const selectedChartType: Ref<ChartsType> = ref(ChartsType.Day)

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
  isLoading.value = true

  stationData.chartCalendarDate ??= new Date()

  const key = JSON.stringify({
    id: stationData.id,
    dateString: getFormattedDate(stationData.chartCalendarDate),
    type: selectedChartType.value
  })

  if (chartsData.value.has(key)) {
    isLoading.value = false
    return chartsData.value.get(key)
  }

  const buffer = await getChartBuffer(station.value)

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
  isLoading.value = false
}

const getChartData = (id?: number, dateString?: string) => {
  return chartsData.value.get(JSON.stringify({ id, dateString, type: selectedChartType.value }))
}

const getChartBuffer = (station: StationData) => {
  return chartsSettings.value
    .get(selectedChartType.value)
    ?.getBufferFn(station?.id.toString(), getFormattedDate(station.chartCalendarDate))
}
</script>

<template>
  <div class="flex flex-col justify-around gap-6">
    <div class="flex flex-row justify-between gap-5">
      <Button
        @click="
          async () => {
            selectedChartType = ChartsType.Day
            await loadChartData(stationData)
          }
        "
        severity="secondary"
        :disabled="selectedChartType === ChartsType.Day || isLoading"
        raised
        >Day
      </Button>
      <Button
        @click="
          async () => {
            selectedChartType = ChartsType.Month
            await loadChartData(stationData)
          }
        "
        severity="secondary"
        :disabled="selectedChartType === ChartsType.Month || isLoading"
        raised
        >Month
      </Button>
      <Button
        @click="
          async () => {
            selectedChartType = ChartsType.Year
            await loadChartData(stationData)
          }
        "
        severity="secondary"
        :disabled="selectedChartType === ChartsType.Year || isLoading"
        raised
        >Year
      </Button>
      <Button
        @click="
          async () => {
            selectedChartType = ChartsType.Lifetime
            await loadChartData(stationData)
          }
        "
        severity="secondary"
        :disabled="selectedChartType === ChartsType.Lifetime || isLoading"
        raised
        >Total
      </Button>
    </div>
    <DatePicker
      :style="
        !chartsSettings.get(selectedChartType)?.showDatePicker ? 'display: none' : 'display: flex'
      "
      v-model="station.chartCalendarDate"
      :dateFormat="chartsSettings.get(selectedChartType)?.dateFormat"
      :view="chartsSettings.get(selectedChartType)?.dateView ?? 'date'"
      @date-select="loadChartData(stationData)"
      showButtonBar
    ></DatePicker>
  </div>

  <DeferredContent @load="loadChartData(stationData)">
    <Chart
      type="bar"
      :data="
        getChartData(stationData.id, getFormattedDate(stationData.chartCalendarDate ?? new Date()))
      "
      :options="getChartOptions()"
    ></Chart>
  </DeferredContent>
</template>
