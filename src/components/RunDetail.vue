<template>
  <n-steps vertical :current="(current as number)" status="finish">
    <n-step title="adb devices">
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <n-code
          :code="`List of devices attached
1df1f12 unauthorized`"
          language="javascript" />
      </n-ellipsis>
    </n-step>
    <n-step title="adb wait-for-device" />
    <n-step title="adb shell setprop service.dev.mode 1">
      <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
        <n-code
          :code="`Failed to set property 'service.dev.mode' to '1'.
See dmesg for error reason.`"
          language="javascript" />
      </n-ellipsis>
    </n-step>
  </n-steps>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ActionRunner } from "../api/action";

const current = ref(1);

const props = defineProps<{
  runner: ActionRunner;
}>();

</script>
