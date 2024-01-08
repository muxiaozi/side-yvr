<template>
  <div style="display: flex">
    <n-card style="margin: 8px">
      <n-card-content>
        <n-icon :component="Icon" size="28" />
        <n-space>
          <n-text>设备名称: </n-text>
          <n-text>设备型号: </n-text>
          <n-text>设备版本: </n-text>
          <n-text>设备序列号: </n-text>
          <n-text>设备状态: </n-text>
        </n-space>
      </n-card-content>
    </n-card>

    <n-card style="margin: 8px">
      <n-card-header>
        <n-card-title>YVR D2</n-card-title>
      </n-card-header>
      <n-card-content>
        <n-space>
          <n-text>设备名称: </n-text>
          <n-text>设备型号: </n-text>
          <n-text>设备版本: </n-text>
          <n-text>设备序列号: </n-text>
          <n-text>设备状态: </n-text>
        </n-space>
      </n-card-content>
    </n-card>

    <n-card style="margin: 8px">
      <n-card-header>
        <n-card-title>右手柄</n-card-title>
      </n-card-header>
      <n-card-content>
        <n-space>
          <n-text>设备名称: </n-text>
          <n-text>设备型号: </n-text>
          <n-text>设备版本: </n-text>
          <n-text>设备序列号: </n-text>
          <n-text>设备状态: </n-text>
        </n-space>
      </n-card-content>
    </n-card>
  </div>
  <n-data-table
    :columns="columns"
    :data="data"
    :single-line="false"
    :bordered="false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
import { useRouter } from "vue-router";
import { FlashSharp as Icon } from "@vicons/ionicons5";
import { getDeviceStatus } from "../api/device";

const router = useRouter();

type Item = {
  name: string;
  value: string;
};

const columns = [
  {
    title: "名称",
    key: "name",
  },
  {
    title: "值",
    key: "value",
  },
];

const data: Item[] = [
  {
    name: "SN",
    value: "D22137122F8273",
  },
  {
    name: "连接状态",
    value: "已连接",
  },
  {
    name: "电量",
    value: "头盔(100%) 左手柄(80%) 右手柄(60%)",
  },
  {
    name: "网络",
    value: "IP: 192.168.10.1",
  },
  {
    name: "版本号",
    value: "Dev_1.26.0",
  },
];
</script>

<style scoped lang="css"></style>
