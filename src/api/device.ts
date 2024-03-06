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

export enum DeviceType {
  // YVR
  YVR_D1_Headset,
  YVR_D2_Headset,
  YVR_LeftController,
  YVR_RightController,

  // Quest
  META_QUEST2_Headset,
  META_QUEST2_LeftController,
  META_QUEST2_RightController,

  META_QUEST3_Headset,
  META_QUEST3_LeftController,
  META_QUEST3_RightController,

  // Pico
  PICO4_Headset,
  PICO4_LeftController,
  PICO4_RightController,
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
