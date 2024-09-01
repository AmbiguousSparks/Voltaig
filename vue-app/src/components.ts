import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Fluid from 'primevue/fluid'
import Card from 'primevue/card'
import Panel from 'primevue/panel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import DeferredContent from 'primevue/deferredcontent'
import Chart from 'primevue/chart'
import { LiquidChart } from '@opd/g2plot-vue'
import DatePicker from 'primevue/datepicker'

export const components: {
  name: string
  type: any
}[] = [
  {
    name: 'Menu',
    type: Menu
  },
  {
    name: 'Button',
    type: Button
  },
  {
    name: 'Splitter',
    type: Splitter
  },
  {
    name: 'SplitterPanel',
    type: SplitterPanel
  },
  {
    name: 'Image',
    type: Image
  },
  {
    name: 'Fluid',
    type: Fluid
  },
  {
    name: 'Card',
    type: Card
  },
  {
    name: 'Panel',
    type: Panel
  },
  {
    name: 'Accordion',
    type: Accordion
  },
  {
    name: 'AccordionPanel',
    type: AccordionPanel
  },
  {
    name: 'AccordionHeader',
    type: AccordionHeader
  },
  {
    name: 'AccordionContent',
    type: AccordionContent
  },
  {
    name: 'DeferredContent',
    type: DeferredContent
  },
  {
    name: 'Chart',
    type: Chart
  },
  {
    name: 'LiquidChart',
    type: LiquidChart
  },
  {
    name: 'DatePicker',
    type: DatePicker
  }
]
