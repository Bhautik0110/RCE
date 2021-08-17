const command = require("../command.js");
const {runner} = require('./common.js')

const runCode = (file, opt) => {
  return new Promise(async (resolve, reject) => {
    command("go", ["run", file.name])
      .run(opt)
      .then(resolve)
      .catch(reject)
  });
}


const run = (code, input, expected) => {
  return runner("Program.go", code, input, expected, runCode)
}

module.exports = run