import { Platform } from "./command";

export type ActionCommand = {
  command: string;
  allow_fail: boolean;
};

export type Action = {
  id: number;
  name: string;
  commands: ActionCommand[];
  platforms: Platform[];
  tags: string[];
};

function generateActionId() {
  let id = (utools.dbStorage.getItem("maxActionId") as number) || 0;
  id += 1;
  utools.dbStorage.setItem("maxActionId", id);
  return id;
}

export function loadActions(): Array<Action> {
  let actions: Array<Action> = utools.dbStorage.getItem("actions");
  console.log("load actions:", actions);
  return actions;
}

export function saveAction(action: Action): Action {
  let actions: Array<Action> =
    (utools.dbStorage.getItem("actions") as Array<Action>) || [];

  let _action = actions.find((item) => item.id === action.id);
  if (_action) {
    Object.assign(_action, action);
    console.log("update action", action);
  } else {
    action.id = generateActionId();
    actions.push(action);
    console.log("save action", action);
  }

  utools.dbStorage.setItem("actions", actions);
  return action;
}

export function saveActions(actions: Array<Action>) {
  for (let action of actions) {
    saveAction(action);
  }
}

export function removeAction(actionId: number) {
  console.log("remove action id:", actionId);
  let actions: Array<Action> = utools.dbStorage.getItem("actions");
  actions = actions.filter((item: Action) => item.id !== actionId);
  utools.dbStorage.setItem("actions", actions);
}
