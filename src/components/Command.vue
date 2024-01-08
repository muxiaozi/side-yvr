<template>
  <n-page-header title="命令" @back="back" class="header">
    <template #extra>
      <n-space>
        <n-button @click="addCommand" :round="true" size="small">
          <template #icon>
            <n-icon :component="AddIcon" />
          </template>
          <template #default>新增</template>
        </n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-divider style="margin: 0px" />

  <n-data-table
    :columns="columns"
    :data="data"
    :bordered="false"
    :single-line="true"
    :row-props="rowProps"
    :max-height="`calc(100vh - 142px)`"
  />

  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :width="100"
    :x="dropdownX"
    :y="dropdownY"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="(e) => (showDropdown = false)"
    @select="onDropdownSelect"
  />
</template>

<script setup lang="ts">
import {
  NButton,
  useDialog,
  NCode,
  NIcon,
  NTag,
  NSpace,
  NButtonGroup,
} from "naive-ui";
import type { DataTableColumns, DropdownOption } from "naive-ui";
import { h, ref, nextTick, Ref, Component } from "vue";
import { loadCommands, Command, removeCommand } from "../api/command";
import { Platform } from "../api/app";
import {
  LogoWindows as WindowsIcon,
  LogoApple as MacIcon,
  LogoTux as LinuxIcon,
  AddSharp as AddIcon,
  PencilSharp as EditIcon,
  TrashSharp as DeleteIcon,
} from "@vicons/ionicons5";
import EditCommand from "./EditCommand.vue";
import { useRouter } from "vue-router";

const router = useRouter();
let data = ref(loadCommands());

const dialog = useDialog();
const columns = ref<DataTableColumns<Command>>([
  {
    title: "名称",
    key: "name",
    sorter: "default",
  },
  {
    title: "命令",
    key: "command",
    sorter: "default",
    render(row) {
      return h(NCode, { code: row.command });
    },
  },
  {
    title: "平台",
    key: "platforms",
    filterOptions: [
      { label: "Windows", value: "windows" },
      { label: "Mac", value: "mac" },
      { label: "Linux", value: "linux" },
    ],
    filter: (value, row) => {
      return row.platforms.includes(value.toString() as Platform);
    },
    render(row) {
      return h(NButtonGroup, null, {
        default: () =>
          row.platforms
            .sort((a, b) => a.localeCompare(b))
            .map((value) => {
              return h(
                NButton,
                {
                  size: "small",
                  focusable: false,
                  circle: true,
                  secondary: true,
                },
                {
                  icon: () => {
                    if (value === "windows") {
                      return h(NIcon, null, { default: () => h(WindowsIcon) });
                    } else if (value === "mac") {
                      return h(NIcon, null, { default: () => h(MacIcon) });
                    } else if (value === "linux") {
                      return h(NIcon, null, { default: () => h(LinuxIcon) });
                    }
                  },
                }
              );
            }),
      });
    },
  },
  {
    title: "标签",
    key: "tags",
    render(row) {
      return h(
        NSpace,
        { size: "small" },
        {
          default: () =>
            row.tags?.map((value) => {
              return h(NTag, { type: "success" }, { default: () => value });
            }),
        }
      );
    },
  },
]);

// 下拉菜单
const options = ref<DropdownOption[]>([
  {
    label: "编辑",
    key: "edit",
    icon: renderIcon(EditIcon),
  },
  {
    label: () =>
      h("span", { style: { color: "red" } }, { default: () => "删除" }),
    key: "delete",
    icon: renderIcon(DeleteIcon),
  },
]);

const dropdownX = ref(0);
const dropdownY = ref(0);
const showDropdown = ref(false);
let currentRow: Ref<Command>;
const rowProps = ref((row: Command) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault();
      showDropdown.value = false;
      currentRow = ref(row);
      nextTick().then(() => {
        showDropdown.value = true;
        dropdownX.value = e.clientX;
        dropdownY.value = e.clientY;
      });
    },
  };
});

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
}

function onDropdownSelect(key: string | number, option: DropdownOption) {
  showDropdown.value = false;
  if (key === "edit") {
    dialog.info({
      title: "编辑命令",
      content: () => h(EditCommand, { command: currentRow.value }),
    });
  } else if (key === "delete") {
    dialog.warning({
      title: "删除命令",
      content: currentRow.value.command,
      onPositiveClick: () => {
        removeCommand(currentRow.value.id);
        data.value = data.value.filter((value) => value !== currentRow.value);
      },
      positiveText: "确定",
      negativeText: "取消",
    });
  }
}

function addCommand() {
  dialog.info({
    title: "添加命令",
    maskClosable: false,
    content: () =>
      h(EditCommand, { onCommandAdded: (command) => data.value.push(command) }),
  });
}

function back() {
  router.back();
}
</script>

<style scoped lang="css">
.header {
  margin: 10px 10px;
  height: 28px;
}
</style>
