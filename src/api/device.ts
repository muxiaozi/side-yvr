type DeviceStatus = {
  serialNo: string;
  hmdBattery: number;
  leftControllerBattery: number;
  rightControllerBattery: number;
  rooted: boolean;
};

let deviceCheckTimer: number = 0;
let deviceCheckEnable: boolean = false;
let currentDeviceSerialNo: string = "";
let currentDeviceStatus: DeviceStatus | undefined;
let deviceStatusListeners: DeviceListener[] = [];

type DeviceListener = (status: DeviceStatus) => void;

async function updateDeviceStatus() {
  console.log("update device status");
  // adb.getDeviceStatus();
}

export async function startDeviceCheck() {
  deviceCheckEnable = true;
  await updateDeviceStatus();
  if (deviceCheckEnable) {
    deviceCheckTimer = setTimeout(startDeviceCheck, 1000);
  }
}

export function stopDeviceCheck() {
  if (deviceCheckTimer !== 0) {
    clearTimeout(deviceCheckTimer);
    deviceCheckTimer = 0;
    console.log("stop check device");
  }
}

export function addEventListener(listener: DeviceListener) {
  deviceStatusListeners.push(listener);
}

export function removeEventListener(listener: DeviceListener) {
  deviceStatusListeners = deviceStatusListeners.filter((l) => l !== listener);
}

export function getDeviceStatus(): DeviceStatus | undefined {
  return currentDeviceStatus;
}