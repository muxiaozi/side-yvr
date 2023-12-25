import { getPlatform } from "./app";
import { Platform } from "./command";

export type Action = {
  id: number;
  name: string;
  commands: Array<string>;
  platforms: Array<Platform>;
  tags: Array<string>;
};

type Step = {
  index: number;
  command: string;
  result: string;
  status: "wait" | "process" | "finish" | "error";
};

export class ActionRunner {
  private steps: Array<Step> = [];
  private action: Action;
  private running: boolean = false;
  private listeners: Array<(step: Step) => void> = [];

  constructor(action: Action) {
    this.action = action;

    // 判断是否支持当前平台
    let platform = getPlatform();
    if (!action.platforms.includes(platform)) {
      throw new Error(
        `Action(${action.name}) not support platform: ${platform.toString()}`
      );
    }

    this.steps = action.commands.map((command, index) => {
      return {
        index,
        command,
        result: "",
        status: "wait",
      };
    });
  }

  getAction(): Action {
    return this.action;
  }

  getSteps(): Array<Step> {
    return this.steps;
  }

  onStepChanged(listener: (step: Step) => void) {
    this.listeners.push(listener);
  }

  private runStep(step: Step): Promise<Step> {
    return new Promise((resolve, reject) => {
      step.status = "process";
      this.listeners.forEach((listener) => listener(step));

      adb
        .runCommand(step.command)
        .then((result) => {
          step.result = result;
          step.status = "finish";
          resolve(step);
          this.listeners.forEach((listener) => listener(step));
        })
        .catch((err) => {
          step.result = err;
          step.status = "error";
          reject(err);
          this.listeners.forEach((listener) => listener(step));
        });
    });
  }

  run(): Promise<Step[]> {
    if (this.running) {
      return Promise.reject("Action is running");
    }
    this.running = true;

    return Promise.all(this.steps.map((step) => this.runStep(step)));
  }
}

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
