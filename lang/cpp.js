const CLang = require("./clang.js");

const run = (code, input, expected) => {
  return CLang(code, input, expected, "g++")
}

module.exports = run