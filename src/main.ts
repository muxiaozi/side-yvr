import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')

// 进入插件
utools.onPluginEnter(async ({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload)
    switch (code) {
        case 'sideyvr': {
            await adb.getDevices()
            break;
        }
        case 'analyze-apk': {
            break;
        }
        case 'install-apk': {
            break;
        }
        case 'upload-file': {
            break;
        }
        case 'detect-sn': {
            break;
        }
    }
})

// 退出插件
utools.onPluginOut(() => {
    console.log('用户退出插件')
})
