const tmp = require("tmp");
const fs = require("fs");


const fileWrite = (content, opts = {}) => {
  return new Promise((resolve, reject) => {
    let folder = tmp.dirSync({ unsafeCleanup: true });
    let file = tmp.fileSync({...opts, ...{dir: folder.name}})
    fs.write(file.fd, content, err => {
      if(err) return reject(err);
      return resolve({file, folder})
    })
  })
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
    const fail = (e, msg) => {
      reject({
        message: msg,
        error: e,
      });
    }
    fileWrite(code, { name: progName })
    .then(({file, folder}) => {
      Promise.all(preCmds.map(p => p(file)))
      .then(() => {
        mainCmd(file, {input})
        .then(({error, output, timeout}) => {
          folder.removeCallback()
          let message = "Program run successfully."
          message = error && error.toString().length > 0 ? "Program has an error.": message;
          message = timeout ? "Out of resources.": message;
          resolve({
            matches: output.toString() === expected,
            message,
            hasError: Boolean(error && error.toString().length > 0),
            expected,
            actual: output,
            outOfResources: timeout,
            errorMessage: error.toString(),
          });
        })
        .catch(error => {
          resolve({
            matches: false,
            message,
            hasError: error && error.toString().length > 0,
            expected,
            actual: error.toString(),
            outOfResources: timeout,
            errorMessage: error.toString(),
          });
        });
      })
      .catch(error => {
        resolve({
          matches: false,
          message: "Compilation failed",
          hasError: Boolean(error && error.toString().length > 0),
          expected,
          actual: error.toString(),
          outOfResources: false,
          errorMessage: error.toString(),
        });
      });
    })
    .catch(e => fail(e, "File write failed."));
  })
}


module.exports = { dir, runner }