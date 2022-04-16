import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import axios from 'axios'
import { Check } from '@element-plus/icons'

import './element-variables.scss'

const app = createApp(App)
app.component('check',Check)
app.config.globalProperties.$axios = axios
installElementPlus(app)
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })
app.use(router).mount('#app')