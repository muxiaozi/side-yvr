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

  async installApk(apkPath) {
    await this.adb?.install(apkPath, {
      grantPermissions: true,
    });
  }

  async getDevices() {
    const devices = await this.adb.getConnectedDevices();
    console.log(devices);
    return devices;
  }

  async getDeviceInfo() {
    const text = await this.adb.shell("ip addr");
    console.log(text);
  }

  /**
   * 根据类型获取包列表
   * @param {string} type 'user' | 'system' | undefined
   * @returns [{ apkPath, packageName, type }]
   */
  async getPackageListByType(type) {
    if (_.isUndefined(type)) {
      return [
        ...(await this.getPackageListByType("user")),
        ...(await this.getPackageListByType("system")),
      ];
    }

    let appsStr = await this.adb.shell(
      `pm list packages -f ${type == "user" ? "-3" : "-s"}`
    );
    return appsStr.split("\n").map((line) => {
      const [, apkPath, packageName] = line.match(/package:(.+)=([^\s]+)/);
      return { apkPath, packageName, type };
    });
  }

  /**
   * 获取应用具体信息
   * @param {*} packageInfo 包名
   * @returns [{ packageName, apkPath, versionCode, versionName, appName, iconPath }]
   */
  async getAppInfo(packageInfo) {
    let versionCode, versionName, appName, iconPath;

    let aaptDumpBadgingStr;
    try {
      aaptDumpBadgingStr = await this.adb.shell(
        `/data/local/tmp/aapt-arm-pie dump badging ${packageInfo.apkPath}`
      );
    } catch (e) {
      aaptDumpBadgingStr = e.stdout;
      console.error(e.message);
    }

    try {
      const [, _1, _2] = aaptDumpBadgingStr.match(
        /package: name='[^']+' versionCode='([^']+)' versionName='([^']+)'/
      );
      versionCode = versionCode || _1;
      versionName = versionName || _2;
    } catch (ignore) {}

    try {
      const [, _1] = aaptDumpBadgingStr.match(
        /application-label-zh-CN:'([^']+)'/
      );
      appName = appName || _1;
    } catch (ignore) {}

    try {
      const [, _1, _2] = aaptDumpBadgingStr.match(
        /application: label='([^']*)' icon='([^']*)'/
      );
      appName = appName || _1;
      iconPath = iconPath || _2;
    } catch (ignore) {}

    console.log(
      `versionCode: ${versionCode}, versionName: ${versionName}, appName: ${appName}, iconPath: ${iconPath}`
    );

    if (iconPath && [".png", ".webp"].includes(path.extname(iconPath))) {
      try {
        await this.adb.shell(`mkdir -p /data/local/tmp/sideyvr_icons`);
        await this.adb.shell(
          `unzip -o -d /data/local/tmp/sideyvr_icons/ ${packageInfo.apkPath} ${iconPath}`
        );
        let localPath = path.resolve(
          utools.getPath("temp"),
          "sideyvr",
          packageInfo.packageName,
          path.parse(iconPath).base
        );
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        await this.adb.pull(
          `/data/local/tmp/sideyvr_icons/${iconPath}`,
          localPath
        );
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

  async runCommand(command) {
    let adbShellPattern = /(adb)\s+(shell)\s+(.*)/i;
    let adbExecPattern = /(adb)\s+(\w+)/i;
    let result = adbShellPattern.exec(command);
    if (result) {
      console.log("run shell", result);
      return this.adb.shell(result[3]);
    }
    result = adbExecPattern.exec(command);
    if (result) {
      console.log("run exec", result);
      return this.adb.adbExec(result[2]);
    }
    console.log(command);
    return this.adb.adbExec(command);
  }
}

module.exports = Adb;
