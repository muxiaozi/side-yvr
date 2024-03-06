<template>
  <n-card class="device-card" content-class="device-card-content">
    <img :src="deviceImage" class="device-image" draggable="false" :style="{ opacity: props.connected ? 1 : 0.5 }" />
    <n-space v-if="props.connected" vertical>
      <n-space>
        <n-text class="key-item">电池</n-text>
        <n-text>{{ props.battery }}%</n-text>
        <n-text v-if="props.charging">[充电中]</n-text>
      </n-space>
      <n-space>
        <n-text class="key-item">序号</n-text>
        <n-text>{{ props.serialNo }}</n-text>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { DeviceType } from "@/api/device";

const props = defineProps<{
  connected: boolean;
  battery: number;
  charging: boolean;
  serialNo: string;
  deviceType: DeviceType;
  version?: string;
}>();

const deviceImage = computed(() => {
  switch (props.deviceType) {
    case DeviceType.YVR_D1_Headset:
      return new URL("@/assets/images/YVR_D1_Headset.png", import.meta.url).href;
    case DeviceType.YVR_D2_Headset:
      return new URL("@/assets/images/YVR_D2_Headset.png", import.meta.url).href;
    case DeviceType.YVR_LeftController:
      return new URL("@/assets/images/YVR_LeftController.png", import.meta.url).href;
    case DeviceType.YVR_RightController:
      return new URL("@/assets/images/YVR_RightController.png", import.meta.url).href;
    case DeviceType.META_QUEST2_Headset:
      return new URL("@/assets/images/META_QUEST2_Headset.png", import.meta.url).href;
    case DeviceType.META_QUEST2_LeftController:
      return new URL("@/assets/images/META_QUEST2_LeftController.png", import.meta.url).href;
    case DeviceType.META_QUEST2_RightController:
      return new URL("@/assets/images/META_QUEST2_RightController.png", import.meta.url).href;
    case DeviceType.META_QUEST3_Headset:
      return new URL("@/assets/images/META_QUEST3_Headset.png", import.meta.url).href;
    case DeviceType.META_QUEST3_LeftController:
      return new URL("@/assets/images/META_QUEST3_LeftController.png", import.meta.url).href;
    case DeviceType.META_QUEST3_RightController:
      return new URL("@/assets/images/META_QUEST3_RightController.png", import.meta.url).href;
    case DeviceType.PICO4_Headset:
      return new URL("@/assets/images/PICO4_Headset.png", import.meta.url).href;
    case DeviceType.PICO4_LeftController:
      return new URL("@/assets/images/PICO4_LeftController.png", import.meta.url).href;
    case DeviceType.PICO4_RightController:
      return new URL("@/assets/images/PICO4_RightController.png", import.meta.url).href;
    default:
      return new URL("@/assets/images/placeholder.png", import.meta.url).href;
  }
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
