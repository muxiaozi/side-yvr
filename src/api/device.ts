type DeviceStatus = {
  serialNo: string;
  hmdBattery: number;
  leftControllerBattery: number;
  rightControllerBattery: number;
  rooted: boolean;
};

const deviceMap: Map<string, DeviceStatus> = new Map();
let deviceCheckTimer: number = -1;

function updateDeviceStatus() {
  console.log("update device status");
  getDeviceStatus();
}

export function getDeviceStatus(serialNo?: string): DeviceStatus | undefined {
  if (serialNo) {
    return deviceMap.get(serialNo);
  } else {
    for (let status of deviceMap.values()) {
      return status;
    }
    return undefined;
  }
}

export function startDeviceCheck() {
  if (deviceCheckTimer === -1) {
    console.log("start check device fail, already running");
    return;
  }
  deviceCheckTimer = setInterval(updateDeviceStatus, 1000);
  console.log("start check device, interval: 1s");
}

export function stopDeviceCheck() {
  if (deviceCheckTimer !== -1) {
    clearInterval(deviceCheckTimer);
    deviceCheckTimer = -1;
    console.log("stop check device");
  }
}
