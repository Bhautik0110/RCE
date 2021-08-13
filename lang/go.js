const command = require("../fcmd.js");
const {runner, dir} = require('./common.js')

const runCode = (file, opt) => {
  return new Promise(async (resolve, reject) => {
    command("go", ["run", "Program.go"])
      .run({cwd: dir(file.name), ...opt})
      .then(resolve)
      .catch(reject)
  });
}


const run = (code, input, expected) => {
  return runner("Program.go", code, input, expected, runCode)
}

module.exports = run