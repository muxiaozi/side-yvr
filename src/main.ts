import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createRouter, createWebHashHistory } from 'vue-router'

import DeviceInfo from './components/DeviceInfo.vue'
import BasicOperation from './components/BasicOperation.vue'
import ProfessionalOperation from './components/ProfessionalOperation.vue'
import Settings from './components/Settings.vue'

const routes = [
    { path: '/', component: DeviceInfo },
    { path: '/basic-operation', component: BasicOperation },
    { path: '/professional-operation', component: ProfessionalOperation },
    { path: '/settings', component: Settings },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')