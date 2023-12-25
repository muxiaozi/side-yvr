<template>
  <div class="container">
    <n-page-header title="运行详情" @back="back" class="header">
      <template #extra>
        <n-space>
          <n-button @click="">新增</n-button>
          <n-button @click="">命令</n-button>
        </n-space>
      </template>
    </n-page-header>

    <n-divider style="margin: 0px" />

    <n-tabs key="a" type="line" animated placement="left" class="content">
      <n-tab-pane name="run" tab="2023-12-24 11:10:23">
        <template #default>
          <n-scrollbar x-scrollable style="min-height: calc(100vh - 100px);">
            <n-steps
              vertical
              :current="current"
              status="finish"
              style="margin: 16px 4px">
              <n-step title="adb devices">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`List of devices attached
1df1f12 unauthorized`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>

              <n-step title="adb wait-for-device" />

              <n-step title="adb shell setprop service.dev.mode 1">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`Failed to set property 'service.dev.mode' to '1'.
See dmesg for error reason.`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>

              <n-step title="adb devices">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`List of devices attached
1df1f12 unauthorized`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>

              <n-step title="adb wait-for-device" />

              <n-step title="adb shell setprop service.dev.mode 1">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`Failed to set property 'service.dev.mode' to '1'.
See dmesg for error reason.`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>
              <n-step title="adb devices">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`List of devices attached
1df1f12 unauthorized`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>

              <n-step title="adb wait-for-device" />

              <n-step title="adb shell setprop service.dev.mode 1">
                <n-ellipsis
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false">
                  <n-code
                    :code="`Failed to set property 'service.dev.mode' to '1'.
See dmesg for error reason.`"
                    language="javascript" />
                </n-ellipsis>
              </n-step>
            </n-steps>
          </n-scrollbar>
        </template>
      </n-tab-pane>
      <n-tab-pane name="run1" tab="2023-12-24 11:10:23" />
      <n-tab-pane name="run2" tab="2023-12-24 11:10:23" />
      <n-tab-pane name="run3" tab="2023-12-24 11:10:23" />
    </n-tabs>

    <!-- <n-steps vertical :current="current" status="finish">
      <n-step v-for="step in steps" :title="step.command">
        <n-ellipsis
          v-if="step.result.length > 0"
          expand-trigger="click"
          line-clamp="1"
          :tooltip="false">
          <n-code :code="step.result" language="javascript" />
        </n-ellipsis>
      </n-step>
    </n-steps> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ActionRunner, Step } from "../api/action";
import { MenuOption, MenuGroupOption } from "naive-ui";
import { useRouter } from "vue-router";

const steps = ref<Step[]>();
const current = ref(1);
const router = useRouter();

const menuOptions = ref<MenuOption[]>([
  {
    label: "运行",
    key: "run",
  },
  {
    label: "日志",
    key: "log",
  },
  {
    label: "截图",
    key: "screenshot",
  },
  {
    label: "录屏",
    key: "record",
  },
  {
    label: "设置",
    key: "setting",
  },
]);
const activeKey = ref();

const props = defineProps<{
  runner?: ActionRunner;
}>();

function back() {
  router.back();
}
</script>

<style scoped lang="css">
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 45px);
}
.header {
  margin: 10px 10px;
}
.content {
  flex-grow: 1;
}
</style>
