const command = require("../command.js");
const {runner} = require('./common.js')

const compileCode = (file, opt) => {
  return new Promise(async (resolve, reject) => {
    command("javac", [file.name])
      .execute(opt)
      .then(() => resolve(true))
      .catch(reject);
  })
}

const runCode = (file, opt) => {
  return new Promise((resolve, reject) => {
    let exFile = file.name.substr(0, file.name.length - 5);
    command("java", ["Program"])
      .run(opt)
      .then(resolve)
      .catch(reject);
  });
}


const run = (code, input, expected) => {
  return runner("Program.java", code, input, expected, runCode, [compileCode])
}

module.exports = run