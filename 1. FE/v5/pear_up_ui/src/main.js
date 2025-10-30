import './assets/main.css'
// import './assets/weather-up.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)

// Disable Vue DevTools in production
if (import.meta.env.PROD) {
  app.config.devtools = false
}

app.mount('#app')
