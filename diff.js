const tmp = require("tmp");
const fs = require("fs");

const {Command} = require("./command.js");

const writeFile = content => {
  let file = tmp.fileSync();
  fs.writeFileSync(file.name, content, { flag: "w+" });
  return file
}

const getDiff = ({actual, expected, hasError}) => {
  return new Promise(async resolve => {
    if (hasError) return resolve("");
    let files = [writeFile(actual), writeFile(expected)];
    let cmd = new Command("diff",files.map(f => f.name));
    await cmd.run();
    files.forEach(f => f.removeCallback());
    return cmd.hasError()? resolve("Error while matching output."): resolve(cmd.output);
  });
}
module.exports = { getDiff }