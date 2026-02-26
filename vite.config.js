import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/CareQueuetAdmin-Thesis/',  // 👈 Change from '/carequeue-thesis/' to '/'
})