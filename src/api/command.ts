import md5 from "crypto-js/md5";

export type Platform = "windows" | "mac" | "linux";

export type Command = {
  id: string;
  name: string;
  command: string;
  platforms: Platform[];
  tags: string[];
};

export function generateCommandId() {
  const token = `command_${utools.getNativeId()}_${Date.now().toString()}_${Math.random()}`;
  console.log("generate command id:", token);
  return md5(token).toString();
}

export function loadCommands(): Command[] {
  let commands: Command[] = utools.dbStorage.getItem("commands") || [];
  console.log("load commands:", commands);
  return commands;
}

export function saveCommand(command: Command): Command {
  let commands = loadCommands();
  let _command = commands.find((item: Command) => item.id === command.id);
  if (_command) {
    Object.assign(_command, command);
    console.log("update command", command);
  } else {
    commands.push(command);
    console.log("save command", command);
  }

  utools.dbStorage.setItem("commands", commands);
  return command;
}

export function saveCommands(commands: Command[]) {
  let _commands = loadCommands();
  for (let command of commands) {
    const _command = _commands.find((item) => item.id === command.id);
    if (_command) {
      Object.assign(_command, command);
      console.log("update command", command);
    } else {
      _commands.push(command);
      console.log("save command", command);
    }
  }
  utools.dbStorage.setItem("commands", _commands);
}

export function removeCommand(commandId: string) {
  console.log("remove command id:", commandId);
  let commands = loadCommands();
  commands = commands.filter((item: Command) => item.id !== commandId);
  utools.dbStorage.setItem("commands", commands);
}
