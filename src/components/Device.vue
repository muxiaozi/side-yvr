<template>
  <n-flex :wrap="false" style="padding: 8px; gap: 8px">
    <device-unit
      :connected="true"
      :battery="100"
      :device-type="DeviceType.YVR_LeftController"
      :charging="false"
      serial-no="123123"
    />
    <device-unit
      :connected="false"
      :battery="100"
      :device-type="DeviceType.YVR_D2_Headset"
      :charging="true"
      serial-no="123123"
    />
    <device-unit
      :connected="true"
      :battery="100"
      :device-type="DeviceType.YVR_RightController"
      :charging="false"
      serial-no="123123"
    />
  </n-flex>

  <n-data-table :columns="columns" :data="datas" :single-line="false" :bordered="false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DeviceUnit from "./DeviceUnit.vue";
import { DeviceType } from "../api/device";

type Item = {
  name: string;
  value: string;
};

const columns = [
  {
    title: "项目",
    key: "name",
  },
  {
    title: "值",
    key: "value",
  },
];

const datas: Item[] = [
  {
    name: "网络",
    value: "IP: 192.168.10.1",
  },
];

</script>

<style scoped lang="css"></style>
