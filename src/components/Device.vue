<template>
  <n-flex :wrap="false" style="padding: 8px; gap: 8px">
    <n-card class="device-card" content-class="device-card-content">
      <img
        src="@/assets/images/LeftController.png"
        class="device-image"
        draggable="false"
        :style="{ opacity: data?.controllers[0]?.connected ? 1 : 0.5 }"
      />
      <n-space v-if="data?.controllers[0]?.connected" vertical>
        <n-space>
          <n-text class="key-item">电池</n-text>
          <n-text>{{ data?.controllers[0]?.batteryPercentRemaining ?? 0 }}%</n-text>
          <n-text v-if="data?.controllers[0]?.isCharging">[充电中]</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">序号</n-text>
          <n-text>{{ data?.controllers[0]?.serialNo }}</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">版本</n-text>
          <n-text>{{ data?.controllers[0]?.version }}</n-text>
        </n-space>
      </n-space>
    </n-card>

    <n-card class="device-card" content-class="device-card-content" style="flex-grow: 1">
      <img src="@/assets/images/D1.png" class="device-image" draggable="false" :style="{ opacity: data ? 1 : 0.5 }" />
      <n-space v-if="data?.device" vertical>
        <n-space>
          <n-text class="key-item">电池</n-text>
          <n-text>{{ data?.device.battery.batteryPercentRemaining ?? 0 }}%</n-text>
          <n-text v-if="data?.device.battery.isCharging">[充电中]</n-text>
          <n-text>[{{ data?.device.battery.temperature }}℃]</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">序号</n-text>
          <n-text>{{ data?.device.serialNo }}</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">版本</n-text>
          <n-text>{{ data?.device.version }}</n-text>
        </n-space>
      </n-space>
    </n-card>

    <n-card class="device-card" content-class="device-card-content">
      <img
        src="@/assets/images/RightController.png"
        class="device-image"
        draggable="false"
        :style="{ opacity: data?.controllers[1]?.connected ? 1 : 0.5 }"
      />
      <n-space v-if="data?.controllers[1]?.connected" vertical>
        <n-space>
          <n-text class="key-item">电池</n-text>
          <n-text>{{ data?.controllers[1]?.batteryPercentRemaining ?? 0 }}%</n-text>
          <n-text v-if="data?.controllers[1]?.isCharging">[充电中]</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">序号</n-text>
          <n-text>{{ data?.controllers[1]?.serialNo }}</n-text>
        </n-space>
        <n-space>
          <n-text class="key-item">版本</n-text>
          <n-text>{{ data?.controllers[1]?.version }}</n-text>
        </n-space>
      </n-space>
    </n-card>
  </n-flex>

  <n-data-table :columns="columns" :data="datas" :single-line="false" :bordered="false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

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

let data = ref<DeviceStatus>();

onMounted(async () => {
  data.value = await adb.getDeviceStatus();
});
</script>

<style scoped lang="css">
.device-image {
  height: 160px;
  user-select: none;
}
.key-item {
  font-weight: bold;
}
</style>

<style lang="css">
.device-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px !important;
}
</style>
