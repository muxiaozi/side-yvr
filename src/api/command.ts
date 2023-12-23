export type Platform = "windows" | "mac" | "linux";

export interface Command {
  id: number;
  name: string;
  command: string;
  platforms: Array<Platform>;
  tags: Array<string>;
}

function generateCommandId() {
  let id = utools.dbStorage.getItem("maxCommandId") as number || 0;
  id += 1;
  utools.dbStorage.setItem("maxCommandId", id);
  return id;
}

export function loadCommands(): Array<Command> {
  let commands: Array<Command> = utools.dbStorage.getItem("commands");
  console.log("load commands:", commands);
  return commands;
}

export function saveCommand(command: Command): Command {
  let commands: Array<Command> = utools.dbStorage.getItem("commands") as Array<Command> || [];

  let _command = commands.find((item: Command) => item.id === command.id);
  if (_command) {
    Object.assign(_command, command);
    console.log("update command", command);
  } else {
    command.id = generateCommandId();
    commands.push(command);
    console.log("save command", command);
  }

  utools.dbStorage.setItem("commands", commands);
  return command;
}

export function SaveCommands(commands: Array<Command>) {
  for (let command of commands) {
    saveCommand(command);
  }
}

export function removeCommand(command: Command) {
  console.log("remove command:", command);
  let commands: Array<Command> = utools.dbStorage.getItem("commands");
  commands = commands.filter((item: Command) => item.id !== command.id);
  utools.dbStorage.setItem("commands", commands);
}
