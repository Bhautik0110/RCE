const { Command } = require("../command.js");
const {fileWrite, executable, runner} = require('./common.js')
const fs = require("fs");



const compileCode = (file, compiler) => {
  return new Promise(async (resolve, reject) => {
    try {
      let exFile = executable(file.name);
      let cmpl = new Command(compiler, ["-c", file.name])
      let opgen = new Command(compiler, ["-o", exFile, file.name])
      await cmpl.execute()
      await opgen.execute()
      resolve(true)
    } catch(e) {
      reject(e);
    }
  })
}

const runCode = file => {
  return new Promise(async (resolve, reject) => {
    try {
      let exFile = executable(file.name);
      let cmd = new Command(exFile, []);
      await cmd.run()
      resolve(cmd)
    } catch(e) {
      reject(e)
    }
  });
}

const getCompiler = cmplr => {
  return file => {
    return compileCode(file, cmplr)
  }
}

const run = (code, input, expected, compiler = "gcc") => {
  return runner("Program.c", code, input, expected, runCode, [getCompiler(compiler)])
}

module.exports = run