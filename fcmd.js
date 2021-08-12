const { spawn, exec } = require("child_process");
const { streamWrite, streamEnd } = require("@rauschma/stringio");

const command = (cmd, args = [], opts = {}) => {
  let complete = false;
  let waitControl = null;

  const success = (fn, error, output) => {
    if (complete) return;
    if (waitControl != null) clearInterval(waitControl);
    complete = true
    fn({error, output})
  }

  const fail = (fn, e) => {
    if(complete) return;
    if (waitControl != null) clearInterval(waitControl);
    complete = true
    fn(e)
  }

  const run = iopts => {
    return new Promise((resolve, reject) => {
      
      let {input, timeout} = { timeout: 4000, ...opts, ...iopts };
      let output = error = ""

      // Create new child process 
      let p = spawn(cmd, args, {
        stdio: ["pipe"],
        ...opts
      })

      // Set wait control to end process if it take longer then timeout specified.
      waitControl = setTimeout(() => {
        if (!p.killed) {
          p.kill(); /// Kill after 4s
          success(resolve, error, output)
        }
      }, timeout)

      // Set Input Capturing
      if (input) {
        streamWrite(p.stdin, input).then(() => streamEnd(p.stdin));
      } else streamEnd(p.stdin);

      // Collect output
      p.stdout.on("data", data => { output += data.toString() });
      p.stdout.on("end", () => { success(resolve, error, output) });

      // Collect errors
      p.stderr.on("data", err => { error += err.toString() });
      p.stderr.on("end", () => { 
        if (error != "") {
          p.kill();
          success(resolve, error, output);
        }
      });

      // Error handling
      p.on('error', e => fail(reject, e));
    })
  }

  const execute = iopts => {
    return new Promise((resolve, reject) => {
      exec([cmd, ...args].join(" "), {...opts, ...iopts}, (err, out, serr) => {
        if(err) {
          return fail(reject, err)
        }
        if (serr) {
          return success(resolve, serr, "")
        }
        success(resolve, "", out);
      })
    })
  }

  return { run, execute }
}

module.exports = command