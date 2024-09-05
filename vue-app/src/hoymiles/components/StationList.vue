<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import type { StationData } from '@/hoymiles/models/hoymiles'
import StationDetails from '@/hoymiles/components/StationDetails.vue'

const hoymilesService = inject<HoymilesService>('hoymilesService')

const stationsData: Ref<StationData[] | undefined> = ref([])

const layout: Ref<string> = ref('vertical')

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
</script>

<template>
  <Fluid>
    <Splitter StyleClass="w-full" v-show="layout === 'horizontal'">
      <SplitterPanel
        class="flex items-center justify-center p-4"
        v-for="station in stationsData"
        :key="station.id"
      >
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
                class="flex flex-row gap-6 justify-start items-center min-h-[120px] max-h-[170px]"
                v-if="station.stationEnergyData"
              >
                <div class="w-1/3">
                  <LiquidChart
                    class="w-full"
                    v-bind="{ percent: getCurrentPower(station), color: 'orange' }"
                  >
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
            <StationDetails :station-data="station" />
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
    <Splitter StyleClass="w-full" v-show="layout === 'vertical'" layout="vertical">
      <SplitterPanel
        class="flex items-center justify-center p-2"
        v-for="station in stationsData"
        :key="station.id"
      >
        <Card>
          <template #header>
            <img :alt="station.name" :src="'https://static.hoymiles.com/cfs/' + station.pic_path" />
          </template>
          <template #title>
            {{ station.name }}
          </template>
          <template #subtitle>
            <DeferredContent aria-live="polite" @load="loadStationEnergyData(station)">
              <div class="flex flex-col" v-if="station.stationEnergyData">
                <div class="sm:w-full">
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
            <StationDetails :station-data="station" />
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
  </Fluid>
</template>
