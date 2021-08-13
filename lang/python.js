const command = require("../fcmd.js");
const {runner, dir} = require('./common.js')

const runCode = (file, opt) => {
  return new Promise(async (resolve, reject) => {
    command("python", [file.name])
      .run({cwd: dir(file.name), ...opt})
      .then(resolve)
      .catch(reject)
  });
}


const run = (code, input, expected) => {
  return runner("Program.py", code, input, expected, runCode)
}

module.exports = run