/**
 * 执行历史记录最好用本地数据库记录，不需要存储在Utools数据库中
 *
 */

import { Action } from "./action";

export type RunStatus = "wait" | "process" | "finish" | "error";

export type Step = {
  index: number;
  command: string;
  result: string;
  status: RunStatus;
};

class ActionRunner {
  private currentIndex: number = 0;
  private currentStatus: RunStatus = "wait";
  private steps: Array<Step> = [];
  private action: Action;
  private running: boolean = false;
  private listeners: Array<(step: Step) => void> = [];

  constructor(action: Action) {
    this.action = action;

    this.steps = action.commands.map((command, index) => {
      return {
        index,
        command: command.command,
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

  setStepChangeListener(listener: (step: Step) => void) {
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

type RunLog = {
  logId: number;
  actionId: number;
};

export class RunManager {
  public static runPool: Map<number, ActionRunner> = new Map<
    number,
    ActionRunner
  >();

  public static spawnRunner(action: Action): boolean {
    if (this.runPool.has(action.id)) {
      console.error(`action(${action.name}) is running`);
      return false;
    }
    const runner = new ActionRunner(action);
    runner.setStepChangeListener(RunManager.onStepChanged);
    this.runPool.set(action.id, runner);
    return true;
  }

  public static getLogsIdByActionId(actionId: number): number[] {
    return [];
  }

  public static getLogById(logId: number): RunLog | null {
    return null;
  }

  public static onStepChanged(step: Step) {

  }
}
