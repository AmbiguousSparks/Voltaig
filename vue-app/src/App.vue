<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'

const _darkModeKey = 'dark_mode'

const darkMode = ref(false)

onMounted(() => {
  darkMode.value = JSON.parse(localStorage.getItem(_darkModeKey)!) === true
  setDarkMode(darkMode.value)
})

const toggle = () => {
  darkMode.value = !darkMode.value
  setDarkMode(darkMode.value)
}

const setDarkMode = (value: boolean) => {
  localStorage.setItem(_darkModeKey, String(value))
  if (value) {
    document.querySelector('html')?.classList.add('app-dark')
    return
  }
  document.querySelector('html')?.classList.remove('app-dark')
}
</script>

<template>
  <div class="flex flex-col">
    <div class="row mb-10">
      <div class="columns-1 w-[60px] ml-auto">
        <Button
          severity="secondary"
          type="button"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          ><i style="font-size: 2rem" :class="darkMode ? 'pi pi-sun' : 'pi pi-moon'"></i
        ></Button>
      </div>
    </div>
    <RouterView />
  </div>
</template>
