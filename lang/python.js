const { Command } = require("../command.js");
const {runner, dir} = require('./common.js')

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let cmd = new Command("python", ["Program.py"]);
      await cmd.run({cwd: dir(file.name)})
      resolve(cmd)
    } catch(e) {
      reject(e)
    }
  });
}


const run = (code, input, expected) => {
  return runner("Program.py", code, input, expected, runCode)
}

module.exports = run