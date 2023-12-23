export type Tag = "buildin" | "user";

interface Command {
  id: number;
  name: string;
  command: string;
  tags: Array<Tag>;
}

interface DisplayCommand extends Command {
  buildin: boolean;
}

const buildInCommands: Array<Command> = [
  {
    id: 1,
    name: "获取设备列表",
    command: "adb devices",
    tags: [],
  },
  {
    id: 2,
    name: "重启设备",
    command: "adb reboot",
    tags: [],
  },
  {
    id: 3,
    name: "设置开发者模式",
    command: "adb shell setprop service.dev.mode 1",
    tags: [],
  },
];

export function loadCommands(): Array<DisplayCommand> {
  let displayCommands: Array<DisplayCommand> = [];

  // 读取内置命令
  displayCommands.push(
    ...buildInCommands.map((item: Command) => {
      return <DisplayCommand>{
        id: item.id,
        name: item.name,
        command: item.command,
        tags: [...item.tags, "buildin"],
        buildin: true,
      };
    })
  );

  // 读取用户命令
  let userCommands: Array<Command> = utools.dbStorage.getItem("user_commands");
  displayCommands.push(
    ...userCommands.map((item: Command) => {
      return <DisplayCommand>{
        id: item.id,
        name: item.name,
        command: item.command,
        tags: item.tags ? [...item.tags, "user"] : ["user"],
        buildin: false,
      };
    })
  );

  return displayCommands;
}

export function saveCommand(command: Command): boolean {
  let userCommands: Array<Command> = utools.dbStorage.getItem("user_commands");
  let updated = false;
  for (let item of userCommands) {
    if (item.id === command.id) {
      item.command = command.command;
      item.name = command.name;
      item.tags = command.tags;
      console.log("updateCommand", command);
      updated = true;
      break;
    }
  }
  if (!updated) {
    userCommands.push(command);
    console.log("saveCommand", userCommands);
  }
  utools.dbStorage.setItem("user_commands", userCommands);
  return true;
}

export function removeCommand(command: DisplayCommand) {
  let userCommands: Array<Command> = utools.dbStorage.getItem("user_commands");
  let index = userCommands.findIndex((item: Command) => {
    return item.id === command.id;
  });
  if (index >= 0) {
    let removedCommands = userCommands.splice(index, 1);
    utools.dbStorage.setItem("user_commands", userCommands);
    console.log("removeCommand", removedCommands);
  }
}
