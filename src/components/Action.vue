<template>
  <n-page-header title="操作" class="header">
    <template #extra>
      <n-space>
        <n-button @click="addAction">新增</n-button>
        <n-button @click="manageCommand">命令</n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-divider style="margin: 0px" />

  <n-data-table :columns="columns" :data="data" :bordered="false" :single-line="true" :row-props="rowProps" />

  <n-dropdown placement="bottom-start" trigger="manual" :width="100" :x="dropdownX" :y="dropdownY" :options="options"
    :show="showDropdown" :on-clickoutside="(e) => (showDropdown = false)" @select="onDropdownSelect" />
</template>

<script setup lang="ts">
import { NButton, useDialog, NCode, NIcon, NTag, NSpace, NButtonGroup } from "naive-ui";
import type { DataTableColumns, DropdownOption } from "naive-ui";
import { h, ref, nextTick, Ref, toRaw } from "vue";
import { LogoWindows as WindowsIcon, LogoApple as MacIcon, AddSharp as AddIcon, Flash as FlashIcon } from "@vicons/ionicons5";
import { Linux as LinuxIcon, FileImport as FileImportIcon } from "@vicons/fa";
import EditAction from "./EditAction.vue";
import { useRouter } from "vue-router";
import { Action, ActionRunner, loadActions, saveAction, removeAction } from "../api/action";
import { Platform } from "../api/command";

const router = useRouter();

type RowAction = Action & {
  key: number;
};

const columns = createColumns({
  run: (action: Action) => {
    let runner = new ActionRunner(action);
    console.log(runner.getSteps())
    // runner.run();
  }
});

const dropdownX = ref(0);
const dropdownY = ref(0);
const showDropdown = ref(false);
let currentRow: Ref<Action>;
const rowProps = ref((row: Action) => {
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

const data = ref(loadActions().map((value, index) => {
  return {
    ...value,
    key: index,
  };
}));

const dialog = useDialog();

// 下拉菜单
const options = ref<DropdownOption[]>([
  {
    label: "编辑",
    key: "edit",
  },
  {
    label: () => h("span", { style: { color: "red" } }, "删除"),
    key: "delete",
  },
]);

function onDropdownSelect(key: string | number, option: DropdownOption) {
  showDropdown.value = false;
  if (key === "edit") {
    dialog.info({
      title: `编辑命令`,
      content: () => h(EditAction, { action: currentRow.value }),
    });
  } else if (key === "delete") {
    dialog.warning({
      title: `删除命令`,
      content: currentRow.value.name,
      onPositiveClick: () => {
        removeAction(currentRow.value.id);
        data.value = data.value.filter((value) => value !== currentRow.value);
      },
      positiveText: "确定",
      negativeText: "取消",
    });
  }
}

function createColumns({
  run
}: {
  run: (action: Action) => void;
}): DataTableColumns<RowAction> {
  return [
    {
      type: "expand",
      renderExpand: (rowData) => {
        let commands = "";
        for (let command of rowData.commands) {
          commands += command + "\n";
        }
        return h(NCode, { code: commands });
      }
    },
    {
      title: "名称",
      key: "name",
      sorter: "default"
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
        return h(
          NButtonGroup,
          null,
          row.platforms.sort((a, b) => a.localeCompare(b)).map((value) => {
            return h(
              NButton,
              { size: "small", focusable: false, circle: true, secondary: true },
              {
                icon: () => {
                  if (value === "windows") {
                    return h(NIcon, null, { default: () => h(WindowsIcon) });
                  } else if (value === "mac") {
                    return h(NIcon, null, { default: () => h(MacIcon) });
                  } else if (value === "linux") {
                    return h(NIcon, null, { default: () => h(LinuxIcon) });
                  }
                }
              }
            );
          })
        );
      },
    },
    {
      title: "标签",
      key: "tags",
      render(row) {
        return h(
          NSpace,
          { size: "small" },
          row.tags?.map((value) => {
            return h(NTag, { type: "success" }, value);
          })
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render(row) {
        return h(
          NButton,
          { size: "small", round: true, onClick: () => run(row) },
          { default: () => "运行", icon: () => h(NIcon, null, { default: () => h(FlashIcon) }) }
        );
      },
    },
  ];
}

function addAction() {
  dialog.info({
    title: `添加操作`,
    maskClosable: false,
    content: () => h(EditAction, { onActionAdded: (action) => data.value.push(Object.assign({}, action, { key: action.id })) }),
  });
}

function manageCommand() {
  router.push("/command");
}

</script>

<style scoped lang="css">
.header {
  margin: 10px 10px;
}
</style>