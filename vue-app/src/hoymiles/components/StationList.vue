<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import type { StationData } from '@/hoymiles/models/hoymiles'
import type { ChartDecoder } from '@/charts/services/chart-decoder-service'

const hoymilesService = inject<HoymilesService>('hoymilesService')

const chartDecoderService = inject<ChartDecoder>('chartDecoderService')

const stationsData: Ref<StationData[] | undefined> = ref([])

const stationsDetails: Ref<Map<number, StationData>> = ref(new Map<number, StationData>())

const layout: Ref<string> = ref('vertical')

const chartsData: Ref<
  Map<
    string,
    {
      labels?: any[]
      datasets?: any[]
    }
  >
> = ref(new Map<string, {}>())

onMounted(async () => {
  handleScreenResize()

  toggleScreenResize(true)

  await getStationsData()
})

onUnmounted(() => {
  toggleScreenResize(false)
})

const getStationsData = async () => {
  const stations = await hoymilesService?.getStations()

  stationsData.value = stations?.data.list
}

const toggleScreenResize = (value: boolean) => {
  if (value) {
    window.addEventListener('resize', handleScreenResize)
    return
  }
  window.removeEventListener('resize', handleScreenResize)
}

const handleScreenResize = () => {
  if (window.innerWidth < 1080) {
    layout.value = 'vertical'
    return
  }
  layout.value = 'horizontal'
}
const getFormattedEnergyData = (data?: number) => {
  return ((data ?? 0) / 1000).toFixed(2)
}

const loadStationRealData = async (stationData: StationData) => {
  if (stationData.stationRealData) {
    return
  }

  const realData = await hoymilesService?.getStationRealData(stationData.id.toString())

  stationData.stationRealData = realData?.data
}

const getCurrentPower = (stationData: StationData) => {
  return (
    ((stationData?.stationEnergyData!.gp / 1000 / parseFloat(stationData.capacitor)) * 100) / 100
  )
}

const loadStationEnergyData = async (stationData: StationData) => {
  if (stationData.stationEnergyData) {
    return
  }

  const energyData = await hoymilesService?.getStationEnergyData([stationData.id.toString()])

  stationData.stationEnergyData = energyData?.data[0]
}

const getChartData = (id?: number, dateString?: string) => {
  return chartsData.value.get(JSON.stringify({ id, dateString }))
}

const loadStationDetails = async (id: number) => {
  if (stationsDetails.value.has(id)) {
    return
  }

  const response = await hoymilesService?.getStationDetails(id.toString())

  stationsDetails.value.set(id, response!.data)
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
    //backgroundColor: [`rgba(${rColor}, 159, 64)`, `rgb(75, ${rColor}, 192)`],
    borderWidth: 1,
    fill: true
  })

  chartsData.value.set(key, data)
}

const getFormattedDate = (date: Date): string => {
  return date.toISOString().substring(0, 10)
}

const getRevenue = (factor?: number, value?: number) => {
  if (!value || !factor) {
    return ''
  }

  return ((value / 1000) * factor).toFixed(2)
}

const getOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-muted-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-form-field-placeholder-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-form-field-float-label-focus-color')

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary
        },
        title: {
          display: true
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  }
}
</script>

<template>
  <Fluid>
    <Splitter StyleClass="w-full" v-if="layout === 'horizontal'">
      <SplitterPanel class="flex items-center justify-center p-4" v-for="station in stationsData" :key="station.id">
        <Card class="w-1/2">
          <template #header>
            <img
              class="rounded-lg w-[70%] mx-auto"
              :alt="station.name"
              :src="'https://static.hoymiles.com/cfs/' + station.pic_path"
            />
          </template>
          <template #title>
            {{ station.name }}
          </template>
          <template #subtitle>
            <DeferredContent aria-live="polite" @load="loadStationEnergyData(station)">
              <div
                class="flex flex-row gap-6 justify-start h-[200px] items-center"
                v-if="station.stationEnergyData"
              >
                <div class="w-1/3">
                  <LiquidChart
                    class="w-full"
                    v-bind="{ percent: getCurrentPower(station), color: 'orange' }"
                    >52
                  </LiquidChart>
                </div>
                <div>
                  <div class="flex flex-row gap-2">
                    <span class="text-1xl">Capacity: {{ station.capacitor }} kW </span>
                  </div>
                  <div class="flex flex-row gap-2">
                    <span class="text-1xl"
                      >Production:
                      {{ Math.round(getCurrentPower(station) * Number(station.capacitor) * 1000) }}
                      W
                    </span>
                  </div>
                </div>
              </div>
            </DeferredContent>
          </template>
          <template #content>
            <Accordion :value="[0]" :multiple="true">
              <AccordionPanel value="0">
                <AccordionHeader>Plant Overview</AccordionHeader>
                <AccordionContent>
                  <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
                    <div class="flex flex-col gap-6">
                      <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2">
                          <i class="pi pi-hourglass" style="font-size: 1.5rem"></i>
                          <span class="text-1xl">Energy Today: </span>
                        </div>
                        <span class="text-center"
                          >{{ getFormattedEnergyData(station.stationRealData?.today_eq) }} kWh</span
                        >
                      </div>
                      <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2">
                          <i class="pi pi-calendar" style="font-size: 1.5rem"></i>
                          <span class="text-1xl">Energy This Month: </span>
                        </div>
                        <span class="text-center"
                          >{{ getFormattedEnergyData(station.stationRealData?.month_eq) }} kWh</span
                        >
                      </div>
                      <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-2">
                          <i class="pi pi-bolt" style="font-size: 1.5rem"></i>
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
                          >{{ getFormattedEnergyData(station.stationRealData?.total_eq) }} kWh</span
                        >
                      </div>
                    </div>
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>Charts</AccordionHeader>
                <AccordionContent>
                  <DeferredContent @load="loadChartData(station)">
                    <DatePicker
                      v-model="station.chartCalendarDate"
                      dateFormat="dd.mm.yy"
                      @date-select="loadChartData(station)"
                    ></DatePicker>
                    <Chart
                      type="bar"
                      :data="
                        getChartData(
                          station.id,
                          getFormattedDate(station.chartCalendarDate ?? new Date())
                        )
                      "
                      :options="getOptions"
                    ></Chart>
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="2">
                <AccordionHeader>Plant revenue</AccordionHeader>
                <AccordionContent>
                  <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
                    <DeferredContent aria-live="polite" @load="loadStationDetails(station.id)">
                      <div class="flex flex-col gap-6">
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-money-bill text-blue-500" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">Today: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.today_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-wallet text-orange-300" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">This month: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.month_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-euro text-green-400" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">This year: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.year_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-chart-line text-red-500" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">Lifetime: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.total_eq
                              )
                            }}</span
                          >
                        </div>
                      </div>
                    </DeferredContent>
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
    <Splitter StyleClass="w-full" v-else layout="vertical">
      <SplitterPanel class="flex items-center justify-center" v-for="station in stationsData" :key="station.id">
        <Card class="w-1/2">
          <template #header>
            <img :alt="station.name" :src="'https://static.hoymiles.com/cfs/' + station.pic_path" />
          </template>
          <template #title>
            {{ station.name }}
          </template>
          <template #subtitle>
            <DeferredContent aria-live="polite" @load="loadStationEnergyData(station)">
              <div
                class="flex flex-row gap-6 justify-start h-[200px] items-center"
                v-if="station.stationEnergyData"
              >
                <div class="w-1/3">
                  <LiquidChart
                    class="w-full"
                    v-bind="{ percent: getCurrentPower(station), color: 'orange' }"
                  ></LiquidChart>
                </div>
                <div>
                  <div class="flex flex-row gap-2">
                    <span class="text-1xl">Capacity: {{ station.capacitor }} kW </span>
                  </div>
                  <div class="flex flex-row gap-2">
                    <span class="text-1xl"
                      >Production:
                      {{ Math.round(getCurrentPower(station) * Number(station.capacitor) * 1000) }}
                      W
                    </span>
                  </div>
                </div>
              </div>
            </DeferredContent>
          </template>
          <template #content>
            <Accordion :value="[0]" :multiple="true">
              <AccordionPanel value="0">
                <AccordionHeader>Plant Overview</AccordionHeader>
                <AccordionContent>
                  <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
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
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>Charts</AccordionHeader>
                <AccordionContent>
                  <DatePicker
                    v-model="station.chartCalendarDate"
                    dateFormat="dd.mm.yy"
                    @date-select="loadChartData(station)"
                  ></DatePicker>
                  <DeferredContent @load="loadChartData(station)">
                    <Chart
                      type="bar"
                      :data="
                        getChartData(
                          station.id,
                          getFormattedDate(station.chartCalendarDate ?? new Date())
                        )
                      "
                      :options="getOptions"
                    ></Chart>
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="2">
                <AccordionHeader>Plant revenue</AccordionHeader>
                <AccordionContent>
                  <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
                    <DeferredContent aria-live="polite" @load="loadStationDetails(station.id)">
                      <div class="flex flex-col gap-6">
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-money-bill text-blue-500" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">Today: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.today_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-wallet text-orange-300" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">This month: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.month_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-euro text-green-400" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">This year: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.year_eq
                              )
                            }}</span
                          >
                        </div>
                        <div class="flex flex-row justify-between">
                          <div class="flex flex-row gap-2">
                            <i class="pi pi-chart-line text-red-500" style="font-size: 1.5rem"></i>
                            <span class="text-1xl">Lifetime: </span>
                          </div>
                          <span class="text-center">
                            {{ stationsDetails.get(station.id)?.money_data.unit }}
                            {{
                              getRevenue(
                                stationsDetails.get(station.id)?.electricity_price,
                                station.stationRealData?.total_eq
                              )
                            }}</span
                          >
                        </div>
                      </div>
                    </DeferredContent>
                  </DeferredContent>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
  </Fluid>
</template>
