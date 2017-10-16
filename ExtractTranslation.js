const fs = require("fs-extra");
const parser = require("xml2js").Parser();
const magaFolder = "C:/Program Files (x86)/Steam/steamapps/common/Total War Attila/data/Maga";


function toLua(data, filename) {
    const stream = fs.createWriteStream(filename + ".lua");

    stream.once("open", function() {
        stream.write("local Data = {\n");

        Object.keys(data).forEach( function(key) {
            stream.write("[\"" + key + "\"] = \"" + data[key] + "\",\n");
        })

        stream.write("} --: map<string, string>\n\n");
        stream.write("return Data;");
        stream.end();
    })
}


function extractRegionNameFromTranslated(campaign) {
    const LineByLineReader = require("line-by-line");
    const lr = new LineByLineReader(__dirname + "/xml/translated_texts.xml");

    const campaignPrefix = {
        "main_attila": "att",
        "bel_attila": "bel",
        "cha_attila": "cha"
    }

    const prefix = campaignPrefix[campaign];
    const key = "<key>start_pos_settlements_onscreen_name_settlement:" + prefix;

    // faction key => name
    let obj = {
        "en": {}, "fr": {}, "cz": {}, "de": {}, "es": {},
        "it": {}, "pl": {}, "ru": {}, "tr": {}
    }

    let keyFind = false;
    let counter = 0;
    let language;
    let english;
    let translated;
    let region;

    function processLine(line) {
        if (!keyFind) {
            if (line.indexOf(key) == -1) return;

            let str = line.replace(/\<(.+?)\>/g, "").replace(/\d/g, "");
            region = str.replace("start_pos_settlements_onscreen_name_settlement:", "");

            // fix for some bel region key (province_name:name)
            region = region.split(":")[0];
            keyFind = true;
            return;
        }

        if (keyFind) {
            counter++;
            if (counter == 1) language = line.replace(/\<(.+?)\>/g, "");
            if (counter == 2) english = line.replace(/\<(.+?)\>/g, "");
            if (counter == 5) translated = line.replace(/\<(.+?)\>/g, "");

            if (counter == 6) {
                obj[language][region] = translated;
                obj["en"][region] = english;

                counter = 0;
                keyFind = false;
            }
        }
    }

    lr.on("line", function(line) {
        lr.pause();
        processLine(line);
        lr.resume();
    })

    lr.on("end", function() {
        Object.keys(obj).forEach( function(lang) {
            let upper = lang.toUpperCase();
            let folder = magaFolder + "/Local/" + upper + "/" + campaign;

            fs.ensureDirSync(folder);

            let filePath = folder + "/RegionsName";
            toLua(obj[lang], filePath);
        })
    })
}


// extractRegionNameFromTranslated("main_attila");
// extractRegionNameFromTranslated("bel_attila");
// extractRegionNameFromTranslated("cha_attila");
