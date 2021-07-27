const { spawn } = require("child_process");
const { streamWrite, streamEnd } = require("@rauschma/stringio");


class Command {


  constructor(cmd, args = [], input = '') {
    this.cmd = cmd;
    this.args = args;
    this.input = input;
    this.timeout = 4000; // command can take max 4s to execute, if excced then we terminate
    this.output = "";
    this.error = "";
  }

  hasError() {
    return this.error !== "";
  }

  run() {
    return new Promise(async resolve => {
      let p = spawn(this.cmd, this.args, {
        timeout: this.timeout,
        stdio: ["pipe"]
      });

      let waitControl = setTimeout(() => {
        if (!p.killed) {
          console.log("Killing, as time is over.")
          p.kill(); /// Kill after 4s
          resolve()
        }
      }, this.timeout);
  
      /// Whenever data is received add to result
      p.stdout.on("data", (data) => {
        console.log("get op data: ", data);
        this.output += data.toString();
      });
  
      /// When output stream end
      p.stdout.on("end", () => {
        console.log("get op ended.");
        clearInterval(waitControl);
        resolve()
      });
  
      /// Error occur in program
      p.stderr.on("data", (err) => {
        console.log("get err: ", err)
        this.error += err.toString();
      });
  
      p.stderr.on("end", () => {
        if (this.error) {
          p.kill();
          console.log("get err ended.");
          clearInterval(waitControl);
          resolve();
        }
      });
  
      /// Pass input to process in STDIN if needs input
      try {
        if (this.input) {
          await streamWrite(p.stdin, this.input);
          await streamEnd(p.stdin);
        } else await streamEnd(p.stdin);
      } catch (e) {
        console.log("error while providing input.", e)
      }
    });
  }
  
}
module.exports = { Command }