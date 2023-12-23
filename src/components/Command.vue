<template>
  <n-page-header title="管理命令" @back="back" class="header">
    <template #extra>
      <n-space>
        <n-button @click="addCommand">新增</n-button>
      </n-space>
    </template>
  </n-page-header>

  <n-divider style="margin: 0px" />

  <n-data-table
    :columns="columns"
    :data="data"
    :bordered="false"
    :single-line="true"
    :row-props="rowProps" />

  <n-drawer
    v-model:show="active"
    placement="bottom"
    :native-scrollbar="false"
    resizable>
    <n-drawer-content :title="currentRow.command">
      {{ result }}
    </n-drawer-content>
  </n-drawer>

  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :width="100"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="(e) => (showDropdown = false)"
    @select="onDropdownSelect" />
</template>

<script setup lang="ts">
import { NButton, useDialog, NCode, NIcon, NTag, NSpace } from "naive-ui";
import type { DataTableColumns, DropdownOption } from "naive-ui";
import { h, ref, nextTick, Ref } from "vue";
import { loadCommands, Tag } from "../api/commands";
import { Flash as FlashIcon } from "@vicons/ionicons5";
import EditCommand from "./EditCommand.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

type Command = {
  id: number;
  name: string;
  command: string;
  running: boolean;
  editable: boolean;
  category: Tag[];
};

let data = ref<Command[]>(
  loadCommands().map((value) => {
    return {
      id: value.id,
      name: value.name,
      command: value.command,
      running: false,
      editable: !value.buildin,
      category: value.tags,
    };
  })
);

const createColumns = ({
  run,
}: {
  run: (row: Command) => Promise<void>;
}): DataTableColumns<Command> => {
  return [
    {
      title: "名称",
      key: "name",
      sorter: "default",
      render(row) {
        return h(
          "span",
          { style: { color: row.editable ? "black" : "gray" } },
          row.name
        );
      },
    },
    {
      title: "命令",
      key: "command",
      render(row) {
        return h(NCode, { code: row.command });
      },
    },
    {
      title: "类别",
      key: "category",
      filterOptions: [
        {
          label: "内置",
          value: "buildin",
        },
        {
          label: "用户",
          value: "user",
        },
      ],
      filter(value, row) {
        return row.category.includes(value as Tag);
      },
      render(row) {
        return h(
          NSpace,
          { size: "small" },
          row.category.map((value) => {
            return h(
              NTag,
              { type: "success" },
              {
                default: () => {
                  switch (value) {
                    case "buildin":
                      return "内置";
                    case "user":
                      return "用户";
                    default:
                      return "";
                  }
                },
              }
            );
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
          {
            size: "small",
            round: true,
            type: "primary",
            loading: row.running,
            onClick: () => run(row),
          },
          { default: () => "运行", icon: () => h(NIcon, () => h(FlashIcon)) }
        );
      },
    },
  ];
};

const dialog = useDialog();
const columns = createColumns({
  async run(row: Command) {
    row.running = true;
    active.value = true;
    try {
      let rr = await adb.runCommand(row.command);
      console.log(rr);
      result.value = rr;
    } catch (e) {
      result.value = JSON.stringify(e);
    }
    row.running = false;
  },
});

const active = ref(false);
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
const x = ref(0);
const y = ref(0);
let result = ref("");
const showDropdown = ref(false);
let currentRow: Ref<Command>;
const rowProps = ref((row: Command) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      if (row.editable) {
        e.preventDefault();
        showDropdown.value = false;
        currentRow = ref(row);
        nextTick().then(() => {
          showDropdown.value = true;
          x.value = e.clientX;
          y.value = e.clientY;
        });
      }
    },
  };
});

function onDropdownSelect(key: string | number, option: DropdownOption) {
  showDropdown.value = false;
  if (key === "edit") {
    dialog.info({
      title: `编辑命令`,
      content: currentRow.value.command,
    });
  } else if (key === "delete") {
    dialog.warning({
      title: `删除命令`,
      content: currentRow.value.command,
    });
  }
}

function addCommand() {
  dialog.info({
    title: `添加命令`,
    maskClosable: false,
    content: () => h(EditCommand, { style: { color: "red" } }),
  });
}

function back() {
  router.back();
}
</script>

<style scoped lang="css">
.header {
  margin: 10px 10px;
}
</style>
