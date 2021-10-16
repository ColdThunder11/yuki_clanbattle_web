import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import axios from 'axios'
import { Check } from '@element-plus/icons'

const app = createApp(App)
app.component('check',Check)
app.config.globalProperties.$axios = axios
installElementPlus(app)
app.use(router).mount('#app')