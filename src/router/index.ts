import { createRouter, createWebHashHistory } from "vue-router";

import Device from "../components/Device.vue";
import Command from "../components/Command.vue";
import AppManager from "../components/AppManager.vue";
import Setting from "../components/Setting.vue";
import Action from "../components/Action.vue";
import RunLog from "../components/RunLog.vue";

const routes = [
  { path: "/device", name: "device", component: Device },
  { path: "/command", name: "command", component: Command },
  { path: "/app", name: "app", component: AppManager },
  { path: "/setting", name: "setting", component: Setting },
  { path: "/action", name: "action", component: Action },
  { path: "/logs/:actionId", name: "logs", component: RunLog },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
