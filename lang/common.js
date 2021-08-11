const tmp = require("tmp");
const fs = require("fs");


const fileWrite = (content, opts = {}) => {
  return new Promise((resolve, reject) => {
    let folder = tmp.dirSync({ unsafeCleanup: true });
    let file = tmp.fileSync({...opts, ...{dir: folder.name}})
    fs.write(file.fd, content, err => {
      if(err) reject(err);
      resolve({file, folder})
    })
  })
}

const executable = fpath => {
  fpath = fpath.split(".")
  fpath.pop();
  fpath = fpath.join(".").split("/");
  fpath.push(fpath.pop().split("-").join(""))
  return fpath.join("/")
}

const dir = fpath => {
  let splited = fpath.split("/");
  if(splited.length > 1) {
    splited.pop()
  } else return "/";
  return splited.join("/");
}

const runner = (progName, code, input, expected, mainCmd, preCmds = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {file, folder} = await fileWrite(code, { name: progName });
      await Promise.all(preCmds.map(p => p(file)));
      cmd = await mainCmd(file, {input});
      folder.removeCallback()
      let message = "Program run successfully."
      message = cmd.hasError() ? "Program has an error.": message;
      message = cmd.isTimeout ? "Out of resources.": message;
      resolve({
        matches: cmd.output.toString() === expected,
        message,
        hasError: cmd.hasError(),
        expected,
        actual: cmd.output.toString(),
        outOfResources: cmd.isTimeout,
        errorMessage: cmd.error.toString(),
      });
    } catch (e) {
      resolve({
        matches: false,
        message: "Raised an error !",
        hasError: true,
        expected,
        actual: e.toString(),
        outOfResources: false,
        errorMessage: e.toString(),
      });
    }
  })
}


module.exports = { executable, dir, runner }