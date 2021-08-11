const { Command } = require("../command.js");
const {runner, dir} = require('./common.js')

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let cmd = new Command("php", ["Program.php"]);
      await cmd.run({cwd: dir(file.name)})
      resolve(cmd)
    } catch(e) {
      reject(e)
    }
  });
}


const run = (code, input, expected) => {
  return runner("Program.php", code, input, expected, runCode)
}

module.exports = run