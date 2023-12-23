import { createRouter, createWebHashHistory } from "vue-router";

import Device from "../components/Device.vue";
import Command from "../components/Command.vue";
import AppManager from "../components/AppManager.vue";
import Setting from "../components/Setting.vue";
import Action from "../components/Action.vue";

const routes = [
  { path: "/device", component: Device },
  { path: "/command", component: Command },
  { path: "/app", component: AppManager },
  { path: "/setting", component: Setting },
  { path: "/action", component: Action },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
