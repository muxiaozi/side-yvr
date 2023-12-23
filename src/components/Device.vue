<template>
  <n-divider title-placement="left">常用命令</n-divider>
  <n-space class="command-group">
    <n-button v-for="data in datas" size="large" @click="action(data.action)">{{ data.name }}</n-button>
  </n-space>

  <n-drawer
    :show="false"
    placement="right"
    :resizable="true">
    <n-drawer-content title="hello">
      <RunDetail :run-id="10" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import DeviceInfo from "./DeviceInfo.vue";
import RunDetail from "./RunDetail.vue";
import { ref, h } from "vue";
import { NButton } from "naive-ui";

type Command = {
  name: string;
  action: number;
};

const datas = ref([
  {
    name: "打开开发者模式",
    action: 10,
  },
  {
    name: "设置屏幕常亮",
    action: 12,
  },
]);

function action(action: number) {
  console.log(action);
}

let show = ref(false)

</script>

<style scoped lang="css">
.command-group {
  padding: 0px 20px;
}
</style>
