import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { refreshToken } from './api/auth.js'

const app = createApp(App)


setInterval(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    console.log('⏳ Verificando y renovando token...')
    await refreshToken()
  }
}, 25 * 60 * 1000) 

app.use(router)
app.mount('#app')
