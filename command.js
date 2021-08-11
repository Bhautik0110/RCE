const { spawn, exec } = require("child_process");
const { streamWrite, streamEnd } = require("@rauschma/stringio");
const { SIGSTOP, SIGCONT } = require("constants");


class Command {


  constructor(cmd, args = [], opts = {}) {

    // console.log(cmd, args)
    let strcmd = [cmd, ...args].map(x => x.trim()).join(" ")
    // console.log("COMMAND: " + strcmd)
    let {input, timeout, cpu} = {
      input: "",
      timeout: 4000,
      ...opts
    }
    this.cmd = cmd;
    this.args = args;
    this.input = input;
    this.timeout = timeout; // command can take max 4s to execute, if excced then we terminate
    this.cpu = cpu;
    this.output = "";
    this.error = "";
    this.isTimeout = false;
    this.proc = null;
    this.waitControl = null;
  }

  hasError() {
    return this.error !== "";
  }

  cleanUp(callback) {
    clearInterval(this.waitControl);
    callback();
  }

  setProcessTimeout(resolve) {
    try {
      this.waitControl = setTimeout(() => {
        if (!this.proc.killed) {
          this.proc.kill(); /// Kill after 4s
          this.isTimeout = true;
          resolve()
        }
      }, this.timeout);
    } catch (e) {
      reject(e);
    }
  }

  handleOutput(resolve, reject) {
    try {
      /// Whenever data is received add to result
      this.proc.stdout.on("data", (data) => {
        // console.log("out >>", data.toString())
        this.output += data.toString();
      });
  
      /// When output stream end
      this.proc.stdout.on("end", () => {
        this.cleanUp(resolve);
      });
    } catch (e) {
      reject(e);
    }
  }

  handleError(resolve, reject) {
    try {
      /// Error occur in program
      this.proc.stderr.on("data", (err) => {
        // console.log("err >>", err.toString())
        this.error += err.toString();
      });
  
      this.proc.stderr.on("end", () => {
        if (this.error) {
          this.proc.kill();
          this.cleanUp(resolve);
        }
      });
    } catch (e) {
      reject(e);
    }
  }

  provideInput(resolve, reject) {
    try {
      if (this.input) {
        streamWrite(this.proc.stdin, this.input).then(() => streamEnd(this.proc.stdin));
      } else streamEnd(this.proc.stdin);
    } catch (e) {
      reject(e)
    }
  }

  run(opts = {}) {
    return new Promise(async (resolve, reject) => {
      this.proc = spawn(this.cmd, this.args, {
        timeout: this.timeout,
        stdio: ["pipe"],
        ...opts
      });
      this.setProcessTimeout(resolve, reject);
      this.provideInput(resolve, reject);
      this.handleOutput(resolve, reject);
      this.handleError(resolve, reject);
    });
  }
  
  execute(opts = {}) {
    return new Promise((resolve, reject) => {
      exec([this.cmd, ...this.args].join(" "), opts, (err, out, serr) => {
        if(err) {
          // console.log("---- > rejecting !")
          return reject(err)
        }
        if (serr) {
          this.error = serr;
          return resolve()
        }
        this.output = out;
        resolve();
      })
    })
  }

}
module.exports = { Command }