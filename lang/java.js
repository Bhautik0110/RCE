const { Command } = require("../command.js");
const {runner, dir} = require('./common.js')

const compileCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let cmpl = new Command("javac", [file.name])
      await cmpl.execute({dir: dir(file.name)})
      resolve(true)
    } catch(e) {
      reject(e);
    }
  })
}

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let exFile = file.name.substr(0, file.name.length - 5);
      let cmd = new Command("java", ["Program"]);
      await cmd.run({cwd: dir(file.name)})
      resolve(cmd)
    } catch(e) {
      reject(e)
    }
  });
}


const run = (code, input, expected) => {
  return runner("Program.java", code, input, expected, runCode, [compileCode])
}

module.exports = run