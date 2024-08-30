import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { AuthenticationService } from '@/authentication/services/authentication-service'
import { HoymilesService } from '@/hoymiles/services/hoymiles-service'

const app = createApp(App)

const authenticationService = new AuthenticationService()

const hoymilesService = new HoymilesService(authenticationService)

app.provide('authenticationService', authenticationService)
app.provide('hoymilesService', hoymilesService)

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

app.mount('#app')
