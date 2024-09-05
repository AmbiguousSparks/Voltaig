<script setup lang="ts">
import type { StationData } from '@/hoymiles/models/hoymiles'
import { inject, ref, type Ref } from 'vue'
import type { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import StationRevenueDetails from '@/hoymiles/components/StationRevenueDetails.vue'
import StationOverview from '@/hoymiles/components/StationOverview.vue'
import StationCharts from '@/hoymiles/components/StationCharts.vue'

const props = defineProps<{
  stationData: StationData
}>()

const station: Ref<StationData> = ref(props.stationData)
const stationsDetails: Ref<Map<number, StationData>> = ref(new Map<number, StationData>())

const hoymilesService = inject<HoymilesService>('hoymilesService')

const loadStationRealData = async (stationData: StationData) => {
  if (stationData.stationRealData) {
    return
  }

  const realData = await hoymilesService?.getStationRealData(stationData.id.toString())

  stationData.stationRealData = realData?.data
}

const loadStationDetails = async (id: number) => {
  if (stationsDetails.value.has(id)) {
    return
  }

  const response = await hoymilesService?.getStationDetails(id.toString())

  stationsDetails.value.set(id, response!.data)
}
</script>

<template>
  <Accordion :value="[0]" :multiple="true">
    <AccordionPanel value="0">
      <AccordionHeader>Plant Overview</AccordionHeader>
      <AccordionContent>
        <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
          <StationOverview :station="station" />
        </DeferredContent>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>Charts</AccordionHeader>
      <AccordionContent>
        <StationCharts :stationData="station" />
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="2">
      <AccordionHeader>Plant revenue</AccordionHeader>
      <AccordionContent>
        <DeferredContent aria-live="polite" @load="loadStationRealData(station)">
          <DeferredContent aria-live="polite" @load="loadStationDetails(station.id)">
            <StationRevenueDetails
              :station-detail="stationsDetails.get(station.id)"
              v-if="stationsDetails.get(station.id)"
              :station="station"
            />
          </DeferredContent>
        </DeferredContent>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
