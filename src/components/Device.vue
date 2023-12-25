<template>
  <n-divider title-placement="left">常用命令</n-divider>
  <n-space class="command-group">
    <n-button v-for="data in datas" size="large" @click="action(data)">{{
      data.name
    }}</n-button>
  </n-space>
</template>

<script setup lang="ts">
import DeviceInfo from "./DeviceInfo.vue";
import RunDetail from "./RunDetail.vue";
import { ref, h } from "vue";
import { NButton } from "naive-ui";
import { Action, loadActions } from "../api/action";
import { getPlatform } from "../api/app";

const platform = getPlatform();
const datas = ref<Action[]>(
  loadActions().filter(
    (action) =>
      action.tags.includes("favorite") && action.platforms.includes(platform)
  )
);

function action(action: Action) {
  console.log(action);
}

let show = ref(false);
</script>

<style scoped lang="css">
.command-group {
  padding: 0px 20px;
}
</style>
