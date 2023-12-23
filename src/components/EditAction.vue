<template>
  <n-form ref="">
    <n-form-item label="名称">
      <n-input v-model:value="formValue.name" placeholder="输入名称" />
    </n-form-item>
    <n-form-item label="命令">
      <n-dynamic-input v-model:value="commands" show-sort-button placeholder="请输入" :min="1" />
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
import { useDialogReactiveList } from "naive-ui";
import { Action, saveAction } from '../api/action';

const props = defineProps<{
  action?: Action;
  onActionAdded: (action: Action) => void;
}>();

const dialogs = useDialogReactiveList();
const formValue = ref<Action>({
  id: -1,
  name: "",
  commands: [],
  platforms: ["windows", "mac", "linux"]
});
const commands = ref<string[]>([]);

if (props.action) {
  Object.assign(formValue.value, props.action)
}

function onSubmit(e: MouseEvent) {
  e.preventDefault();
  saveAction(toRaw(formValue.value));
  if (props.action) {
    Object.assign(props.action, formValue.value);
  }
  if (props.onActionAdded) {
    props.onActionAdded(formValue.value);
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
  