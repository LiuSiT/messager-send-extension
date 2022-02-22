import { createSSRApp } from 'vue'
import { createRouter, createWebHistory }from 'vue-router'
import App from './App/App.vue'
const routes = [{}]
const app = createSSRApp(App)
const history = createWebHistory()
const router = createRouter({history, routes})

app.use(router)

router.isReady().then(() => {
    app.mount('#app')
})
