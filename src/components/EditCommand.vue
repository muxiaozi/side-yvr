<template>
  <n-form ref="">
    <n-form-item label="名称">
      <n-input v-model:value="formValue.name" placeholder="输入名称" />
    </n-form-item>
    <n-form-item label="命令">
      <n-input v-model:value="formValue.command" placeholder="输入命令" />
    </n-form-item>
    <n-form-item label="平台">
      <n-checkbox-group v-model:value="formValue.platforms">
        <n-space>
          <n-checkbox value="windows" label="Windows" />
          <n-checkbox value="mac" label="Mac" />
          <n-checkbox value="linux" label="Linux" />
        </n-space>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item label="标签">
      <n-select v-model:value="formValue.tags" placeholder="输入或选择..." multiple filterable tag :options="tagOptions" />
    </n-form-item>
    <n-form-item>
      <n-space justify="end" style="width: 100%;">
        <n-button attr-type="button" type="default" @click="onCancel">取消</n-button>
        <n-button attr-type="submit" type="primary" @click="onSubmit">确定</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import { Command, saveCommand } from "../api/command";
import { useDialogReactiveList } from "naive-ui";

const props = defineProps<{
  command?: Command;
  onCommandAdded?: (command: Command) => void;
}>();

const tagOptions = ref();
const dialogs = useDialogReactiveList();
const formValue = ref<Command>({
  id: -1,
  name: "",
  command: "",
  platforms: ["windows", "mac", "linux"],
  tags: [],
});

if (props.command) {
  Object.assign(formValue.value, props.command)
}

function onSubmit(e: MouseEvent) {
  e.preventDefault();
  saveCommand(toRaw(formValue.value));
  if (props.command) {
    Object.assign(props.command, formValue.value);
  }
  if (props.onCommandAdded) {
    props.onCommandAdded(formValue.value);
  }
  for (let dialog of dialogs.value) {
    dialog.destroy();
  }
}

function onCancel(e: MouseEvent) {
  e.preventDefault();
  for (let dialog of dialogs.value) {
    dialog.destroy();
  }
}
</script>
