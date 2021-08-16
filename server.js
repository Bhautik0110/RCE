/* eslint-disable @typescript-eslint/no-var-requires */
/// Packages
const express = require("express");
const cors = require("cors");
const router = require("./router.js");

// async function old_run(lang, code, inputs, expOutput) {
//   return new Promise((resolve) => {
//     /// Execution of JAVA
//     /// Before run java program set default classpath
//     if (lang === "java") {
//       /// It will create file if not exist ; if exist then overwrite
//       let output = java(code, inputs, expOutput);
//       resolve(output);
//     } else if (lang === "cpp") {
//       let output = cpp(code, inputs, expOutput);
//       resolve(output);
//     } else if (lang === "objective-c") {
//       let output = c(code, inputs, expOutput);
//       resolve(output);
//     } else {
//       /// All Interpreters type languages
//       let output = others(lang, code, inputs, expOutput);
//       resolve(output);
//     }
//   });
// }

// async function run(lang, code, inputs, expected) {
//   return LANGS[lang](code, inputs, expected);
// }



/// Server
const init = (port = 5124) => {
  const app = express();
  /// Middleware
  app.use(express.json());

  /// Add host in PRODUCTION
  app.use(cors());

  router(app);

  const server = app.listen(port, "0.0.0.0", () => {
    console.info("Server is started!");
  });
  
  process.on("SIGINT", () => {
    console.info("Server is closing due to SIGINT!");
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
   // clearInterval(cleanup);
  
    //  In production Graceful ShutDown
    setTimeout(() => {
      console.error("Server is closed due to SIGINT!");
      process.exit(0);
    }, 10000); /// 10s
  });
  
  process.on("SIGTERM", () => {
    console.error("Server is closing due to SIGTERM!");
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error("Server is closed due to SIGTERM!");
      process.exit(0);
    }, 10000); /// 10s
  });

  return app;
}

module.exports = init;
