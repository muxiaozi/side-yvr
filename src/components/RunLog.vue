<template>
  <div class="container">
    <n-page-header title="运行日志" @back="back" :subtitle="actionName" class="header">
    </n-page-header>

    <n-divider style="margin: 0px" />

    <n-tabs type="line" animated placement="left" class="content">
      <n-tab-pane v-for="data in datas" :name="data.id" :tab="data.time">
        <template #default>
          <n-scrollbar
            x-scrollable
            :style="{ 'max-height': `calc(100vh - 94px)` }"
          >
            <n-steps
              vertical
              :current="data.current"
              :status="data.status"
              style="margin: 16px 4px"
            >
              <n-step
                v-for="step in data.steps"
                :title="step.command"
                description="123123"
              >
                <n-ellipsis
                  v-if="step.result.length > 0"
                  expand-trigger="click"
                  line-clamp="1"
                  :tooltip="false"
                >
                  <n-code :code="step.result" language="javascript" />
                </n-ellipsis>
              </n-step>
            </n-steps>
          </n-scrollbar>
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ActionRunner, Step, RunStatus } from "../api/action";
import { useRouter, useRoute } from "vue-router";

type Data = {
  id: number;
  time: string;
  current: number;
  status: RunStatus;
  steps: Step[];
};

const router = useRouter();
const actionName = ref(useRoute().params.actionId as string);
const datas = ref<Data[]>([
  {
    id: 1,
    time: "2021-09-09 12:00:00",
    current: 2,
    status: "error",
    steps: [
      {
        index: 1,
        command: "npm install",
        result:
          "adb devices\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf\nasdf",
        status: "error",
      },
      {
        index: 2,
        command: "npm run build",
        result: "success",
        status: "error",
      },
      {
        index: 3,
        command: "npm run test",
        result: "",
        status: "error",
      },
    ],
  },
]);

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
  height: 28px;
}
.content {
  flex-grow: 1;
}
</style>

<style>
.n-tabs-nav-scroll-content {
  height: 100%;
}
</style>
