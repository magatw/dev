const fs = require("fs");
const replace = require("buffer-replace");

const folderBin = __dirname + "/pack/ui/bin/image/map/";
const folderPng = __dirname + "/pack/ui/skins/default";

const template = fs.readFileSync(__dirname + "/bin/image");
const toReplace = "maga_000000000000000000000000000000000000000000000000000";


fs.readdirSync(folderPng).forEach( function(name) {
    if (name.search("_reg_") == -1) return;

    name = name.replace(".png", "");
    let binName = name.replace(/0/g, "");
    let buffer = replace(template, toReplace, name);

    fs.writeFileSync(folderBin + binName, buffer);
    console.log(binName + " done");
})
