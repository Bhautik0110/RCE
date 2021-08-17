const tmp = require("tmp");
const fs = require("fs");
const command = require("./command.js");


const writeFile = content => {
  let file = tmp.fileSync();
  fs.writeFileSync(file.name, content, { flag: "w+" });
  return file
}

const getDiff = ({actual, expected, hasError}) => {
  return new Promise((resolve, reject) => {
    if (hasError) return resolve("");
    let files = [writeFile(actual), writeFile(expected)];
    command("diff", files.map(f => f.name))
    .run()
    .then(({error, output, timeout}) => {
      if (error && error.trim() != "") return reject("Error while matching output.");
      if(timeout === true) return reject("Timeout");
      resolve(output);
      files.forEach(f => f.removeCallback());
    });
  });
}
module.exports = getDiff