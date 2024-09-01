import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { AuthenticationService } from '@/authentication/services/authentication-service'
import { HoymilesService } from '@/hoymiles/services/hoymiles-service'
import { components } from './components'
import { ChartDecoder } from '@/charts/services/chart-decoder-service'

const app = createApp(App)

const apiUrl = import.meta.env.VITE_BASE_APP_URL

const authenticationService = new AuthenticationService(apiUrl)

const hoymilesService = new HoymilesService(authenticationService, apiUrl)

app.provide('authenticationService', authenticationService)
app.provide('hoymilesService', hoymilesService)
app.provide('apiUrl', apiUrl)
app.provide('chartDecoderService', new ChartDecoder())

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
      order: 'tailwind-base, primevue, tailwind-utilities'
    }
  }
})
app.use(createPinia())
app.use(router)

for (const component of components) {
  app.component(component.name, component.type)
}

app.mount('#app')
