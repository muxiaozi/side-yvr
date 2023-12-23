import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'
import { getAppInfo } from './api/app'

// 进入插件
utools.onPluginEnter(async ({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload)
    switch (code) {
        case 'sideyvr': {
            console.log('进入主页')
            await adb.getDevices()
            // let packages = await adb.getPackageListByType('system')
            // console.log(packages)

            // let appInfo = await adb.getAppInfo(packages[0])
            // console.log(appInfo)
            // getAppInfo('com.autonavi.minimap')
            break
        }
        case 'analyze-apk': {
            // await adb.getDevices()
            break
        }
        case 'install-apk': {
            break
        }
        case 'upload-file':
            break
        case 'detect-sn':
            break
    }
})

// 退出插件
utools.onPluginOut(() => {
    console.log('用户退出插件')
})

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')