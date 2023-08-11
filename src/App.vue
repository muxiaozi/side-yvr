<script setup lang="ts">
import BasicInfo from './components/BasicInfo.vue'
import BasicAction from './components/BasicAction.vue'
import ProfessionalAction from './components/ProfessionalAction.vue'
import IconInfo from './components/icons/IconInfo.vue'

import { NButton, NMenu, NIcon, NDivider, NSpace, NLayout, NLayoutSider, NTag, NSelect } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, ref } from 'vue'
import type { Component } from 'vue'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: "基础信息",
    key: "1",
    icon: renderIcon(IconInfo),
  },
  {
    label: "基础操作",
    key: "2",
  },
  {
    label: "专业操作",
    key: "3",
  }
]

const value = ref(null)
const options = [
  {
    label: "Everybody's Got Something to Hide Except Me and My Monkey",
    value: 'song0',
  },
  {
    label: 'Drive My Car',
    value: 'song1'
  },
  {
    label: 'Norwegian Wood',
    value: 'song2'
  },
  {
    label: "You Won't See",
    value: 'song3',
  },
  {
    label: 'Nowhere Man',
    value: 'song4'
  },
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
      <span style="width: 200px;">
        <n-select v-model:value="value" :options="options" />
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
        <BasicInfo />
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
