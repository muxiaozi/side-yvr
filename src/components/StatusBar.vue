<template>
  <div class="my-header">
    <span>
      <n-select style="width: 200px;" v-model:value="value" size="small" :options="options" />
      <!-- <n-tag :bordered="false" type="success">已连接</n-tag> -->
    </span>
    <span>
      <span>头盔(100%)</span>
      <n-divider vertical />
      <span>左手柄(100%)</span>
      <n-divider vertical />
      <span>右手柄(100%)</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const value = ref("2");
const options = ref([
  {
    value: "1",
    label: "1WMHH810KQ0302",
  },
  {
    value: "2",
    label: "设备2",
  },
  {
    value: "3",
    label: "设备3",
  },
]);
</script>

<style scoped lang="css">
.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px;
}
</style>
