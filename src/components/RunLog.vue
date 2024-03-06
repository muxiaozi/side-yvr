<template>
  <div class="container">
    <n-page-header title="运行日志" @back="back" :subtitle="actionName" class="header"> </n-page-header>

    <n-divider style="margin: 0px" />

    <n-tabs type="line" animated placement="left" class="content">
      <n-tab-pane v-for="data in datas" :name="data.id" :tab="data.time">
        <template #default>
          <n-scrollbar x-scrollable :style="{ 'max-height': `calc(100vh - 94px)` }">
            <n-steps vertical :current="data.current" :status="data.status" style="margin: 16px 4px" size="small">
              <n-step v-for="step in data.steps" style="color: black">
                <template #default>
                  <n-scrollbar x-scrollable style="max-height: 200px; max-width: calc(100vw - 400px)">
                    <n-code :code="step.result" />
                  </n-scrollbar>
                </template>
                <template #title>
                  <span v-if="step.status === 'error'" style="color: #d03050"
                    >{{ step.command }} [code: {{ step.exit_code }}]</span
                  >
                  <span v-else>{{ step.command }}</span>
                </template>
              </n-step>
            </n-steps>
          </n-scrollbar>
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { Step, RunManager } from "@/api/run";
import { useRouter, useRoute } from "vue-router";
import { Action } from "@/api/action";

const router = useRouter();
const actionId = useRoute().params.actionId as string;
const actionName = ref(actionId);

const datas = ref(RunManager.getLogsByActionId(actionId));
RunManager.addRunListener(onRunLogUpdate);

onUnmounted(() => {
  RunManager.removeRunListener(onRunLogUpdate);
});

function back() {
  router.back();
}

function onRunLogUpdate(action: Action, logId: string, step: Step) {
  if (action.id === actionId) {
    const data = datas.value.find((data) => data.id === logId);
    if (data) {
      const s = data.steps.find((s) => s.index === step.index);
      if (s) {
        s.result = step.result;
        s.exit_code = step.exit_code;
        s.status = step.status;
      }
      data.current = step.index + 1;
      data.status = step.status;
    }
  }
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
