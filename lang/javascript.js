const { Command } = require("../command.js");
const {runner, dir} = require('./common.js')

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let cmd = new Command("node", ["Program.js"]);
      await cmd.run({cwd: dir(file.name)})
      resolve(cmd)
    } catch(e) {
      reject(e)
    }
  });
}


const run = (code, input, expected) => {
  return runner("Program.js", code, input, expected, runCode)
}

module.exports = run