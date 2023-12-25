<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <div class="my-header">
      <span>
        <n-tag :bordered="false" type="success"> 已连接 </n-tag>
      </span>
      <span>
        <span>头盔(10%)</span>
        <n-divider vertical />
        <span>左手柄(10%)</span>
        <n-divider vertical />
        <span>右手柄(10%)</span>
      </span>
    </div>

    <n-divider />

    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="160"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false">
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          mode="vertical"
          v-model:value="activeKey" />
      </n-layout-sider>
      <n-layout>
        <n-dialog-provider>
          <n-config-provider :hljs="hljs">
            <router-view></router-view>
          </n-config-provider>
        </n-dialog-provider>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { h, ref, onMounted } from "vue";
import type { Component } from "vue";
import { RouterLink, useRouter } from "vue-router";
import {
  InformationCircleSharp as DeviceIcon,
  PrismSharp as OperationIcon,
  ShapesSharp as AppIcon,
  Settings as SettingIcon,
} from "@vicons/ionicons5";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

// function installApk(files: Array<UToolsPayloadFile>) {
//   files.forEach((file: any) => {
//     console.log('开始安装应用', file.name)
//     // adb.installApk(file.path)
//     // adb.startLogcat()
//   });
// }

function renderIcon(icon: Component) {
  return () => h(NIcon, null, () => h(icon));
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: "/" }, () => "测试"),
    key: "run-detail",
    icon: renderIcon(DeviceIcon),
  },
  {
    label: () => h(RouterLink, { to: "/device" }, () => "设备"),
    key: "device",
    icon: renderIcon(DeviceIcon),
  },
  {
    label: () => h(RouterLink, { to: "/action" }, () => "操作"),
    key: "action",
    icon: renderIcon(OperationIcon),
  },
  {
    label: () => h(RouterLink, { to: "/app" }, () => "应用"),
    key: "app",
    icon: renderIcon(AppIcon),
  },
  {
    label: () => h(RouterLink, { to: "/setting" }, () => "设置"),
    key: "setting",
    icon: renderIcon(SettingIcon),
  },
];

const activeKey = ref("device");
const collapsed = ref(false);
// useRouter().replace("/device");
</script>

<style scoped>
.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px;
}

.n-divider:not(.n-divider--vertical) {
  margin: 0px;
}
</style>
