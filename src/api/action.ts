import { Platform } from "./command";
import md5 from "crypto-js/md5";

export type ActionCommand = {
  command: string;
  allow_fail: boolean;
};

export type Action = {
  id: string;
  name: string;
  commands: ActionCommand[];
  platforms: Platform[];
  tags: string[];
};

export function generateActionId() {
  const token = `action_${utools.getNativeId()}_${Date.now().toString()}_${Math.random()}`;
  return md5(token).toString();
}

export function loadActions(): Action[] {
  let actions: Action[] = utools.dbStorage.getItem("actions") || [];
  console.log("load actions:", actions);
  return actions;
}

export function saveAction(action: Action): Action {
  let actions = loadActions();
  let _action = actions.find((item) => item.id === action.id);
  if (_action) {
    Object.assign(_action, action);
    console.log("update action", action);
  } else {
    actions.push(action);
    console.log("save action", action);
  }

  utools.dbStorage.setItem("actions", actions);
  return action;
}

export function saveActions(actions: Action[]) {
  let _actions = loadActions();
  for (let action of actions) {
    let _action = _actions.find((item) => item.id === action.id);
    if (_action) {
      Object.assign(_action, action);
      console.log("update action", action);
    } else {
      _actions.push(action);
      console.log("save action", action);
    }
  }
  utools.dbStorage.setItem("actions", _actions);
}

export function removeAction(actionId: string) {
  console.log("remove action id:", actionId);
  let actions = loadActions();
  actions = actions.filter((item: Action) => item.id !== actionId);
  utools.dbStorage.setItem("actions", actions);
}
