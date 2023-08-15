<script setup lang="ts">

import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, ref } from 'vue'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import {
  InformationCircleSharp as DeviceInfoIcon,
  PrismSharp as BasicOperationIcon,
  ShapesSharp as ProfessionalOperationIcon,
  Settings as SettingsIcon
} from '@vicons/ionicons5'


function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: '/' }, () => '设备信息'),
    key: "device-info",
    icon: renderIcon(DeviceInfoIcon),
  },
  {
    label: () => h(RouterLink, { to: '/basic-operation' }, () => '基础操作'),
    key: "basic-operation",
    icon: renderIcon(BasicOperationIcon),
  },
  {
    label: () => h(RouterLink, { to: '/professional-operation' }, () => '专业操作'),
    key: "professional-operation",
    icon: renderIcon(ProfessionalOperationIcon),
  },
  {
    label: () => h(RouterLink, { to: '/settings' }, () => '设置'),
    key: "settings",
    icon: renderIcon(SettingsIcon),
  }
]

const activeKey = ref("1")
const collapsed = ref(false)

</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <div class="my-header">
      <span>
        <n-tag :bordered="false" type="success">
          已连接
        </n-tag>
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
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
        show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
          mode="vertical" v-model:value="activeKey" />
      </n-layout-sider>
      <n-layout>
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </div>
</template>

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
