<template>
  <n-page-header title="操作" class="header">
    <template #extra>
      <n-space>
        <n-button @click="manageCommand" :round="true" size="small">
          <template #icon>
            <n-icon :component="CommandIcon" />
          </template>
          命令
        </n-button>

        <n-button-group>
          <n-button @click="importAction" :round="true" size="small">
            <template #icon>
              <n-icon :component="FileImportIcon" />
            </template>
            导入
          </n-button>
          <n-button @click="addAction" :round="true" size="small">
            <template #icon>
              <n-icon :component="AddIcon" />
            </template>
            新增
          </n-button>
        </n-button-group>
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
  NScrollbar,
} from "naive-ui";
import type { DataTableColumns, DropdownOption } from "naive-ui";
import { h, ref, nextTick, Ref, toRaw } from "vue";
import {
  LogoWindows as WindowsIcon,
  LogoApple as MacIcon,
  AddSharp as AddIcon,
  Flash as FlashIcon,
  ReceiptOutline as RunLogIcon,
  CodeSlash as CommandIcon,
} from "@vicons/ionicons5";
import { Linux as LinuxIcon, FileImport as FileImportIcon } from "@vicons/fa";
import EditAction from "./EditAction.vue";
import { useRouter } from "vue-router";
import {
  Action,
  loadActions,
  removeAction,
  saveAction,
  generateActionId,
  saveActions,
} from "../api/action";
import { Platform } from "../api/command";
import { getPlatform } from "../api/app";
import { RunManager } from "../api/run";
import _ from "lodash";

const router = useRouter();

type RowAction = Action & {
  key: number;
};

const columns = createColumns({ runAction, showLog });
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

const data = ref(
  loadActions().map((value, index) => {
    return {
      ...value,
      key: value.id,
    };
  })
);

const dialog = useDialog();
const platform = getPlatform();

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
      title: "编辑操作",
      content: () => h(EditAction, { action: currentRow.value }),
      style: { width: "auto" },
    });
  } else if (key === "delete") {
    dialog.warning({
      title: "删除操作",
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
  runAction,
  showLog,
}: {
  runAction: (action: Action) => void;
  showLog: (action: Action) => void;
}): DataTableColumns<RowAction> {
  return [
    {
      type: "expand",
      renderExpand: (rowData) => {
        let code = "";
        for (let command of rowData.commands) {
          code += command.command + "\n";
        }
        return h(
          NScrollbar,
          {
            xScrollable: true,
          },
          {
            default: () =>
              h(NCode, {
                code,
                showLineNumbers: true,
                language: "javascript",
              }),
          }
        );
      },
    },
    {
      title: "名称",
      key: "name",
      sorter: "default",
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
                        return h(NIcon, null, {
                          default: () => h(WindowsIcon),
                        });
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
    {
      title: "操作",
      key: "action",
      render(row) {
        return h(NButtonGroup, null, {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                round: true,
                onClick: () => runAction(row),
                disabled: !row.platforms.includes(platform),
              },
              { icon: () => h(NIcon, null, { default: () => h(FlashIcon) }) }
            ),
            h(
              NButton,
              {
                size: "small",
                round: true,
                onClick: () => showLog(row),
                disabled: !row.platforms.includes(platform),
              },
              { icon: () => h(NIcon, null, { default: () => h(RunLogIcon) }) }
            ),
          ],
        });
      },
    },
  ];
}

function addAction() {
  dialog.info({
    title: "添加操作",
    maskClosable: false,
    content: () =>
      h(EditAction, {
        onActionAdded: (action) =>
          data.value.push(Object.assign({}, action, { key: action.id })),
      }),
    style: { width: "auto" },
  });
}

async function importAction() {
  const result = utools.showOpenDialog({
    title: "导入",
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (_.isArray(result)) {
    const content = await readFile(result[0]);
    const contentObject = JSON.parse(content);
    const actions = contentObject.actions.map((value: Action) => {
      const action = {
        ...value,
        id: generateActionId(),
      };
      data.value.push(Object.assign({ key: action.id }, action));
      return action;
    });
    saveActions(actions);

    console.log(actions);
  }
}

function manageCommand() {
  router.push("/command");
}

function runAction(action: Action) {
  RunManager.spawnRunner(action);
  router.push(`/logs/${action.id}`);
}

function showLog(action: Action) {
  router.push(`/logs/${action.id}`);
}
</script>

<style scoped lang="css">
.header {
  margin: 10px 10px;
  height: 28px;
}
</style>
