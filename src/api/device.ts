import { reactive } from "vue";

export type DeviceStatus = {
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

export interface DeviceOnlineEvent {
  prototype: DeviceOnlineEvent;
  serialNo: string;
  online: boolean;
  wireless: boolean; // 无线连接
}

export interface DeviceStatusEvent {
  prototype: DeviceStatusEvent;
  serialNo: string;
  status: DeviceStatus;
}

export const deviceStore = reactive({
  online: false,
  wireless: false,
  serialNo: "",
});

interface DeviceEventMap {
  device_online: DeviceOnlineEvent;
  device_status: DeviceStatusEvent;
}

type DeviceListener = (status: DeviceStatus) => void;

async function updateDeviceStatus() {
  console.log("update device status");
  const status = await adb.getDeviceStatus();
  deviceStore.online = status?.device.connected ?? false;
  deviceStore.serialNo = status?.device.serialNo ?? "";
}

const deviceEventListeners = new Map<keyof DeviceEventMap, Function[]>();

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
  // deviceCheckEnable = true;
  // await updateDeviceStatus();
  // if (deviceCheckEnable) {
  //   deviceCheckTimer = setTimeout(startDeviceCheck, 1000);
  // }
}

export function stopDeviceCheck() {
  // if (deviceCheckTimer !== 0) {
  //   clearTimeout(deviceCheckTimer);
  //   deviceCheckTimer = 0;
  //   console.log("stop check device");
  // }
}

export function addEventListener<K extends keyof DeviceEventMap>(type: K, listener: (ev: DeviceEventMap[K]) => any) {
  deviceEventListeners.get(type)?.push(listener);
}

export function removeEventListener<K extends keyof DeviceEventMap>(type: K, listener: (ev: DeviceEventMap[K]) => any) {
  const listeners = deviceEventListeners.get(type);
  if (listeners) {
    deviceEventListeners.set(
      type,
      listeners.filter((l) => l !== listener),
    );
  }
}

export function getDeviceStatus(): DeviceStatus | undefined {
  return currentDeviceStatus;
}
