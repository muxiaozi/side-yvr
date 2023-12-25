const { ADB } = require("appium-adb");

class AdbApi {
  adb;

  constructor() {
    this.init();
  }

  async init() {
    this.adb = await ADB.createADB();
  }

  async installApk(apkPath) {
    await this.adb.install(apkPath, {
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

  async getAppList() {
    const list = await this.adb.startLogcat({
      debug: true,
    });
    console.log(list);
  }

  async startLogcat() {
    await this.adb.startLogcat();
    this.adb.setLogcatListener((line) => console.log(line));
  }
}

window.adb = new AdbApi();
