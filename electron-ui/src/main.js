import { createApp } from 'vue'
import App from './App.vue'
import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer

createApp(App).mount('#app')
