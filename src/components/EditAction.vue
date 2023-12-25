<template>
  <n-form ref="">
    <n-form-item label="名称">
      <n-input v-model:value="formValue.name" placeholder="输入名称" />
    </n-form-item>
    <n-form-item label="命令">
      <n-dynamic-input
        v-model:value="formValue.commands"
        show-sort-button
        placeholder="请输入"
        :min="1"
        :on-create="onCreateCommand"
      >
        <template #default="{ value }">
          <n-space :wrap="false">
            <n-checkbox label="可失败" v-model:checked="value.allow_fail" />
            <n-auto-complete
              v-model:value="value.command"
              placeholder="请输入命令"
              type="text"
              :input-props="{
                autocomplete: 'disabled',
              }"
              :options="completeCommand(value.command)"
              clearable
            />
          </n-space>
        </template>
      </n-dynamic-input>
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
      <n-select
        v-model:value="formValue.tags"
        placeholder="输入或选择..."
        multiple
        filterable
        tag
        :options="tagOptions"
      />
    </n-form-item>
    <n-form-item>
      <n-space justify="end" style="width: 100%">
        <n-button attr-type="button" type="default" @click="onCancel"
          >取消</n-button
        >
        <n-button attr-type="submit" type="primary" @click="onSubmit"
          >确定</n-button
        >
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDialogReactiveList } from "naive-ui";
import { Action, saveAction, ActionCommand } from "../api/action";
import { loadCommands } from "../api/command";
import { deepClone, getPlatform } from "../api/app";

const props = defineProps<{
  action?: Action;
  onActionAdded?: (action: Action) => void;
}>();

const tagOptions = ref();
const dialogs = useDialogReactiveList();
const formValue = ref<Action>({
  id: -1,
  name: "",
  commands: [],
  platforms: ["windows", "mac", "linux"],
  tags: [],
});

const platform = getPlatform();
const savedCommands = loadCommands().filter((command) =>
  command.platforms.includes(platform)
);

function completeCommand(inputCommand: string) {
  return savedCommands
    .filter((command) => command.command.includes(inputCommand))
    .map((command) => {
      return {
        label: command.command,
        value: command.command,
      };
    });
}

if (props.action) {
  Object.assign(formValue.value, props.action);
}

function onSubmit(e: MouseEvent) {
  e.preventDefault();
  saveAction(deepClone(formValue.value));
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

function onCreateCommand(index: number) {
  return {
    command: "",
    allow_fail: false,
  };
}
</script>
