import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import naive from "naive-ui";
import router from "./router";

const app = createApp(App);
app.use(naive);
app.use(router);
app.mount("#app");

// 进入插件
utools.onPluginEnter(async ({ code, type, payload }) => {
  console.log("用户进入插件", code, type, payload);
  switch (code) {
    case "sideyvr": {
      router.push("/device");
      break;
    }
    case "analyze-apk": {
      router.push("/app");
      break;
    }
    case "install-apk": {
      router.push("/app");
      break;
    }
    case "upload-file": {
      router.push("/app");
      break;
    }
    case "detect-sn": {
      router.push("/app");
      break;
    }
  }
});

// 退出插件
utools.onPluginOut(() => {
  console.log("用户退出插件");
});

utools.onDbPull((docs: { _id: string; _rev: string }[]) => {});
