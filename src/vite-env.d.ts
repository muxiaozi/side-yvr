/// <reference types="vite/client" />

interface AppInfo {
  // app名称
  appName: string;
  // 包名
  packageName: string;
  // 版本号
  versionCode: number;
  // 版本名
  versionName: string;
  // 图标路径
  iconPath: string;
  // 类型
  type: "user" | "system";
  // Apk路径（需要下载）
  apkPath: string;
  // 是否为VR应用
  vr: boolean;
  // 是否可以无账号使用
  noAccount: boolean;
  // 是否可以无手柄使用
  supports: boolean;
  // 是否可以无手柄使用
  supportHand: boolean;
}

interface PackageInfo {
  packageName: string;
  apkPath: string;
  type: "user" | "system";
}

type DeviceStatus = {
  device: {
    connected: boolean;
    serialNo: string;
    version: string;
    battery: {
      changeCounter: number;
      isCharging: boolean;
      batteryPercentRemaining: number;
      temperature: number; // ℃
      voltage: number; // V
      health: boolean;
      current: number; // mA
    };
  };
  controllers: {
    name: "LeftController" | "RightController";
    buttons: number;
    touches: number;
    indexTrigger: number;
    thumbstick0: number;
    thumbstick1: number;
    batteryPercentRemaining: number;
    isCharging: boolean;
    freq: number;
    serialNo: string;
    version: string;
    connected: boolean;
  }[];
};

interface Adb {
  // 安装应用
  installApk(path: string): Promise<void>;

  // 获取应用信息
  getAppInfo(packageInfo: PackageInfo): Promise<AppInfo>;

  // 获取包列表
  getPackageListByType(type?: "system" | "user"): Promise<PackageInfo[]>;

  // 获取设备状态
  getDeviceStatus(): Promise<DeviceStatus?>;
}

interface UToolsPayloadFile {
  isFile: boolean;
  isDirectory: false;
  name: string;
  path: string;
}

declare var adb: Adb;

declare function runCommand(command: string | string[]): Promise<string>;
declare function readFile(path: string): Promise<string>;
declare function writeFile(path: string, content: string): Promise<void>;
declare function findPath(cmd: string): Promise<string>;
