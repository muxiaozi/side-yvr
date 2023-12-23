type Step = {
  index: number;
  cmd: string;
  result: string;
  status: "finish" | "wait" | "process" | "error";
};

export class Action {
  private steps: Array<Step> = [];
  private actionId: number;
  private running: boolean = false;
  private listeners: Array<(step: Step) => void> = [];

  constructor(actionId: number) {
    this.actionId = actionId;
  }

  getActionId() {
    return this.actionId;
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
        .runCommand(step.cmd)
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
