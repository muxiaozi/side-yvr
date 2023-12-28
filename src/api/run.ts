import { Action } from "./action";
import md5 from "crypto-js/md5";

export type RunStatus = "wait" | "process" | "finish" | "error";

export type Step = {
  index: number;
  command: string;
  result: string;
  exit_code: number;
  status: RunStatus;
  allow_fail: boolean;
};

type RunLog = {
  id: string;
  time: string;
  current: number;
  status: RunStatus;
  steps: Step[];
};

type RunListener = (action: Action, logId: string, step: Step) => void;

class ActionRunner {
  private action: Action;
  private steps: Step[];
  private running: boolean = false;
  private logId: string;
  private current: number = 0;
  private listener: RunListener;

  constructor(action: Action, listener: RunListener) {
    this.action = action;
    this.logId = md5(
      `${utools.getNativeId()}_${action.id}_${Date.now().toString()}`
    ).toString();
    this.listener = listener;
    this.steps = action.commands.map((command, index) => {
      return {
        index,
        command: command.command,
        result: "",
        exit_code: 0,
        status: "wait",
        allow_fail: command.allow_fail,
      };
    });
  }

  getLogId(): string {
    return this.logId;
  }

  getSteps(): Array<Step> {
    return this.steps;
  }

  getCurrent(): number {
    return this.current;
  }

  getCurrentStatus(): RunStatus {
    return this.steps[this.current].status;
  }

  private runStep(step: Step): Promise<Step> {
    return new Promise((resolve, reject) => {
      step.status = "process";
      this.current = step.index;
      this.listener(this.action, this.logId, step);

      adb
        .runCommand(step.command)
        .then((result) => {
          step.result = result;
          step.exit_code = 0;
          step.status = "finish";
          resolve(step);
          this.listener(this.action, this.logId, step);
        })
        .catch((err) => {
          step.result = err.message;
          step.exit_code = err.code;
          step.status = "error";
          reject(err);
          this.listener(this.action, this.logId, step);
        });
    });
  }

  run(): Promise<Step[]> {
    if (this.running) {
      return Promise.reject("Action is running");
    }
    this.running = true;

    return new Promise(async (resolve, reject) => {
      for (let step of this.steps) {
        try {
          await this.runStep(step);
        } catch (err) {
          if (!step.allow_fail) {
            reject(err);
            return;
          }
        }
      }
      resolve(this.steps);
    });
  }
}

export class RunManager {
  public static runPool: Map<number, ActionRunner> = new Map<
    number,
    ActionRunner
  >();
  public static runListeners: RunListener[] = [];

  public static spawnRunner(action: Action): boolean {
    if (RunManager.runPool.has(action.id)) {
      console.error(`action(${action.name}) is running`);
      return false;
    }
    const runner = new ActionRunner(action, RunManager.onStepChanged);
    RunManager.runPool.set(action.id, runner);
    runner.run().finally(() => {
      console.log(
        `action(${action.name}) logId(${runner.getLogId()}) is finished`
      );
      // 把运行日志存到数据库
      RunManager.runPool.delete(action.id);
    });
    return true;
  }

  public static addRunListener(listener: RunListener) {
    RunManager.runListeners.push(listener);
  }

  public static removeRunListener(listener: RunListener) {
    const index = RunManager.runListeners.indexOf(listener);
    if (index > -1) {
      RunManager.runListeners.splice(index, 1);
    }
  }

  public static getLogsByActionId(actionId: number): RunLog[] {
    // 通过读取数据库来加载日志
    const runner = RunManager.runPool.get(actionId);
    if (!runner) {
      return [];
    }
    return [
      {
        id: runner.getLogId(),
        time: new Date().toLocaleString(),
        current: runner.getCurrent(),
        status: runner.getCurrentStatus(),
        steps: runner.getSteps(),
      },
    ];
  }

  public static onStepChanged(action: Action, logId: string, step: Step) {
    RunManager.runListeners.forEach((listener) => {
      listener(action, logId, step);
    });
  }
}
