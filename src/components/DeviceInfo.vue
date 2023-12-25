<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :single-line="false"
    :bordered="false"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

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
