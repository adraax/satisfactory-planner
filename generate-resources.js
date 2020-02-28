const fs = require("fs");

let file = fs.readFileSync("./resources.jsonc", {encoding: 'utf8'});

let json = file.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

fs.writeFileSync("./src/assets/resources.json", JSON.stringify(JSON.parse(json)));
