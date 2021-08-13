const getDiff = require("./diff.js");
const codeRunner = require("./lang/index.js");

const router = app => {

  app.get("/healthz", (req, res) => {
    return res.status(200).json({ status: "running" });
  });
  
  app.post("/run", async (req, res) => {
    let startTime = Date.now();
    let lang = req.body.language;
    let code = req.body.code;
    let input = req.body.input;
    let eo = req.body.eo;
  
    if (!lang || !code || !input || !eo) {
  
      let fields = [
        !lang ? "language": "",
        !code ? "code": "",
        !input ? "input": "",
        !eo ? "eo": ""
      ].filter(x => x !== "").join(", ")
      return res.status(400).json({
        success: false,
        message: "Please suuply needed fields: " + fields,
        totalTime: Date.now() - startTime,
      });
    }
  
    if (!codeRunner.hasOwnProperty(lang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        totalTime: Date.now() - startTime,
      });
    }
  
    /// Return time in milliseconds
    codeRunner[lang](code, input, eo).then(result => {
      getDiff(result).then(diff => {
        return res.status(200).json({
          ...result,
          ...{ totalTime: Date.now() - startTime },
          ...{ diff }
        });
      }).catch(console.log)
    }).catch(console.log);
  })
    
    
  app.use("*", (req, res) => {
    res.status(404).send("Page not found!");
  });
  
}

module.exports = router