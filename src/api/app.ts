import { Platform } from "./command";

export function getAppInfo(packageName: string): AppInfo | undefined {
  utools.showNotification(`获取应用信息 ${packageName}`);
  return undefined;
}

export function getPlatform(): Platform {
  if (utools.isWindows()) {
    return "windows";
  } else if (utools.isMacOS()) {
    return "mac";
  } else if (utools.isLinux()) {
    return "linux";
  } else {
    throw new Error("Unknown platform");
  }
}
