const Adb = require("./adb");
const { exec } = require("teen_process");
const _ = require("lodash");
const fs = require("fs");
const util = require("util");

async function runCommand(command) {
  try {
    command = _.isArray(command) ? command : command.split(/\s+/);
    const { stdout, stderr, code } = await exec(command[0], command.slice(1), {
      timeout: 20000,
      shell: true,
    });
    return stdout;
  } catch (err) {
    throw err;
  }
}

async function readFile(path) {
  return util.promisify(fs.readFile)(path, {
    encoding: "utf8",
  });
}

window.adb = new Adb();
window.runCommand = runCommand;
window.readFile = readFile;
