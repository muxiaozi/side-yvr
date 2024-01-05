const Adb = require("./adb");
const { exec } = require("teen_process");
const _ = require("lodash");
const fs = require("fs");
const util = require("util");

/**
 * 运行命令
 *
 * @param {string | string[]} command 命令
 * @returns {Promise<string>} 返回命令执行的结果
 */
async function runCommand(command) {
  try {
    command = _.isArray(command) ? command : command.split(/\s+/);
    const result = await exec(command[0], command.slice(1), {
      timeout: 10000,
      shell: true,
    });
    return result.stdout;
  } catch (err) {
    throw err;
  }
}

async function readFile(path) {
  return util.promisify(fs.readFile)(path, {
    encoding: "utf8",
  });
}

async function writeFile(path, content) {
  return util.promisify(fs.writeFile)(path, content, {
    encoding: "utf8",
  });
}

window.adb = new Adb();
window.runCommand = runCommand;
window.readFile = readFile;
window.writeFile = writeFile;
