const { ADB } = require("appium-adb");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

class Adb {
  constructor() {
    ADB.createADB()
      .then((adb) => {
        this.adb = adb;
      })
      .catch((err) => {
        console.error(`init adb fail: ${err.message}`);
      });
  }

  async root() {
    try {
      if ((await this.adb.shell("getprop service.dev.mode")) === "1") {
        console.log("already root");
        return;
      }

      let result;
      result = await this.adb.shell("am broadcast -a com.yvr.demo.action.dev.mode --include-stopped-packages");
      console.log("root[1] result: ", result);
      result = await this.adb.shell("setprop service.dev.mode 1");
      console.log("root[2] result: ", result);
      await this.adb.waitForDevice();
    } catch (e) {
      console.error(e.message);
    }
  }

  async installApk(apkPath) {
    await this.adb.install(apkPath, {
      grantPermissions: true,
    });
  }

  /**
   * 根据类型获取包列表
   * @param {string} type 'user' | 'system' | undefined
   * @returns [{ apkPath, packageName, type }]
   */
  async getPackageListByType(type) {
    if (_.isUndefined(type)) {
      return [...(await this.getPackageListByType("user")), ...(await this.getPackageListByType("system"))];
    }

    let appsStr = await this.adb.shell(`pm list packages -f ${type == "user" ? "-3" : "-s"}`);
    return appsStr.split("\n").map((line) => {
      const [, apkPath, packageName] = line.match(/package:(.+)=([^\s]+)/);
      return { apkPath, packageName, type };
    });
  }

  /**
   * 获取应用具体信息
   */
  async getAppInfo(packageInfo) {
    let versionCode, versionName, appName, iconPath;

    let aaptDumpBadgingStr;
    try {
      aaptDumpBadgingStr = await this.adb.shell(`/data/local/tmp/aapt-arm-pie dump badging ${packageInfo.apkPath}`);
    } catch (e) {
      aaptDumpBadgingStr = e.stdout;
      console.error(e.message);
    }

    try {
      const [, _1, _2] = aaptDumpBadgingStr.match(/package: name='[^']+' versionCode='([^']+)' versionName='([^']+)'/);
      versionCode = versionCode || _1;
      versionName = versionName || _2;
    } catch (ignore) {}

    try {
      const [, _1] = aaptDumpBadgingStr.match(/application-label-zh-CN:'([^']+)'/);
      appName = appName || _1;
    } catch (ignore) {}

    try {
      const [, _1, _2] = aaptDumpBadgingStr.match(/application: label='([^']*)' icon='([^']*)'/);
      appName = appName || _1;
      iconPath = iconPath || _2;
    } catch (ignore) {}

    console.log(`versionCode: ${versionCode}, versionName: ${versionName}, appName: ${appName}, iconPath: ${iconPath}`);

    if (iconPath && [".png", ".webp"].includes(path.extname(iconPath))) {
      try {
        await this.adb.shell(`mkdir -p /data/local/tmp/sideyvr_icons`);
        await this.adb.shell(`unzip -o -d /data/local/tmp/sideyvr_icons/ ${packageInfo.apkPath} ${iconPath}`);
        let localPath = path.resolve(
          utools.getPath("temp"),
          "sideyvr",
          packageInfo.packageName,
          path.parse(iconPath).base,
        );
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        await this.adb.pull(`/data/local/tmp/sideyvr_icons/${iconPath}`, localPath);
        iconPath = localPath;
      } catch (e) {
        console.error(e.message);
      }
    } else {
      iconPath = "";
    }

    return {
      packageName: packageInfo.packageName,
      apkPath: packageInfo.apkPath,
      type: packageInfo.type,
      versionCode: versionCode || "",
      versionName: versionName || "",
      appName: appName || packageInfo.packageName,
      iconPath: iconPath || "",
    };
  }

  async startLogcat() {
    await this.adb.startLogcat();
    this.adb.setLogcatListener((line) => console.log(line));
  }

  /**
   * 获取设备电量
   */
  async getDeviceBattery() {
    const result = await this.adb.shell("dumpsys battery");
    const chargeCounter = /Charge counter: (\d+)/.exec(result);
    const isCharging = /status: (\d+)/.exec(result);
    const level = /level: (\d+)/.exec(result);
    const temperature = /temperature: (\d+)/.exec(result);
    const voltage = /^  voltage: (\d+)/m.exec(result);
    const health = /health: (\w+)/.exec(result);
    const current = await this.adb.shell("cat /sys/class/power_supply/battery/current_now");
    return {
      changeCounter: _.toNumber(chargeCounter[1]),
      isCharging: _.toNumber(isCharging[1]) === 2,
      batteryPercentRemaining: _.toNumber(level[1]),
      temperature: _.toNumber(temperature[1]) / 10, // ℃
      voltage: _.toNumber(voltage[1]) / 1000, // V
      health: _.toNumber(health[1]) === 2,
      current: _.toNumber(current) / 1000, // mA
    };
  }

  /**
   * 获取手柄状态
   */
  async getControllerState() {
    await this.root();
    const result = await this.adb.shell("dumpsys android.yvr.trackingservice --controllerState");
    const leftController =
      /Left Controller Buttons:(\S+)\s+Touches:(\S+)\s+IndexTrigger:(\S+)\s+Thumbstick\[0\]:(\S+)\s+Thumbstick\[1\]:(\S+)\s+BatteryPercentRemaining:(\S+)\s+is_charging:(\S+)\s+Freq:(\S+)\s+SN:(\S+)\s+Version:(\S+)/.exec(
        result,
      );
    const rightController =
      /Right Controller Buttons:(\S+)\s+Touches:(\S+)\s+IndexTrigger:(\S+)\s+Thumbstick\[0\]:(\S+)\s+Thumbstick\[1\]:(\S+)\s+BatteryPercentRemaining:(\S+)\s+is_charging:(\S+)\s+Freq:(\S+)\s+SN:(\S+)\s+Version:(\S+)/.exec(
        result,
      );
    return [
      leftController
        ? {
            name: "LeftController",
            buttons: _.toNumber(leftController[1]),
            touches: _.toNumber(leftController[2]),
            indexTrigger: _.toNumber(leftController[3]),
            thumbstick0: _.toNumber(leftController[4]),
            thumbstick1: _.toNumber(leftController[5]),
            batteryPercentRemaining: _.toNumber(leftController[6]),
            isCharging: leftController[7] !== "0",
            freq: _.toNumber(leftController[8]),
            serialNo: leftController[9],
            version: leftController[10],
            connected: _.toNumber(leftController[6]) !== 0,
          }
        : null,
      rightController
        ? {
            name: "RightController",
            buttons: _.toNumber(rightController[1]),
            touches: _.toNumber(rightController[2]),
            indexTrigger: _.toNumber(rightController[3]),
            thumbstick0: _.toNumber(rightController[4]),
            thumbstick1: _.toNumber(rightController[5]),
            batteryPercentRemaining: _.toNumber(rightController[6]),
            isCharging: rightController[7] !== "0",
            freq: _.toNumber(rightController[8]),
            serialNo: rightController[9],
            version: rightController[10],
            connected: _.toNumber(rightController[6]) !== 0,
          }
        : null,
    ];
  }

  async getDeviceVersion() {
    const result = await this.adb.shell("getprop ro.fota.version");
    return result;
  }

  /**
   * 获取设备状态
   */
  async getDeviceStatus() {
    const devices = await this.adb.getConnectedDevices();
    if (devices.length === 0) {
      return null;
    }
    const controllerState = await this.getControllerState();
    const deviceBattery = await this.getDeviceBattery();
    const deviceVersion = await this.getDeviceVersion();

    return {
      device: {
        connected: true,
        serialNo: devices[0].udid,
        version: deviceVersion,
        battery: deviceBattery,
      },
      controllers: controllerState,
    };
  }
}

module.exports = Adb;
