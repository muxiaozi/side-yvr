<template>
  <n-form
    style="padding: 10px"
    ref="formRef"
    :model="formValue"
    label-placement="top"
    label-width="auto"
    :rules="rules"
    size="small"
  >
    <n-form-item label="ADB路径" path="user.name">
      <n-flex :wrap="false" style="width: 100%">
        <n-input v-model:value="formValue.adbPath" placeholder="输入ADB路径" />
        <n-button @click="openFile"> ... </n-button>
        <n-button attr-type="button"> 重置 </n-button>
      </n-flex>
    </n-form-item>
    <n-form-item label="日志文件夹" path="user.age">
      <n-flex :wrap="false" style="width: 100%">
        <n-input v-model:value="formValue.logDir" placeholder="输入日志文件夹" />
        <n-button attr-type="button"> ... </n-button>
        <n-button attr-type="button"> 重置 </n-button>
      </n-flex>
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button"> 验证 </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  adbPath: "",
  logDir: "",
});
const rules = {
  user: {
    name: [{ message: "请输入姓名" }],
    age: [{ message: "请输入年龄" }],
  },
  phone: [{ message: "请输入电话号码" }],
};

async function openFile() {
  const res = utools.showOpenDialog({
    filters: [{ name: "adb.exe", extensions: ["exe"] }],
    properties: ["openFile"],
  });
  console.log(res);
}
</script>
