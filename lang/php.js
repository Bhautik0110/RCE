const { Command } = require("../command.js");
const command = require("../fcmd.js");
const {runner, dir} = require('./common.js')

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    command("php", [file.name])
      .run({cwd: dir(file.name)})
      .then(resolve)
      .catch(reject)
  });
}


const run = (code, input, expected) => {
  return runner("Program.php", code, input, expected, runCode)
}

module.exports = run