const doc = app.activeDocument;
const map = app.activeDocument.name.replace(".psd", "");

const exportPath = "C:/Users/Max/Desktop/magatw/dev/pack/ui/skins/default/";

const sizes = {
    "main_attila": [240, 170],
    "bel_attila": [203, 150],
    "cha_attila": [180,181]
}

const color = new SolidColor();
const colors = {
    "yellow": "f2ac00",
    "green": "699008"
}

const opts = new ExportOptionsSaveForWeb();
opts.format = SaveDocumentType.PNG;
opts.PNG8 = false;
opts.quality = 100;


// Set group visibility
doc.layers[0].visible = false; // regions
doc.layers[1].visible = true; // shapes
doc.layers[2].visible = false; // color
doc.layers[3].visible = false; // map

// Make sure every shapes are hided
for (var i = 0; i < doc.layers[1].layers.length; i++) {
    doc.layers[1].layers[i].visible = false;
}

// Resize the image
var w = UnitValue(sizes[map][0],"px");
var h = UnitValue(sizes[map][1],"px");
doc.resizeImage(w, h, null, ResampleMethod.BICUBIC);


function saveToPNG(name) {
    while (true) {
        if (name.length == 56) break;
        if (name.length > 56) {alert(name); break};
        if (name.length < 56) name = name + "0";
    }

    var pngFile = new File(exportPath + name + ".png");
    doc.exportDocument(pngFile, ExportType.SAVEFORWEB, opts);
}

function exportColor(col) {
    color.rgb["hexValue"] = colors[col];

    for (var i = 0; i < doc.layers[1].layers.length; i++) {
        var layer = doc.layers[1].layers[i];
        layer.visible = true;

        doc.activeLayer = layer;
        doc.selection.fill(color);

        saveToPNG(layer.name + "_" + col);

        layer.visible = false;
    }
}


doc.selection.selectAll();

exportColor("yellow");
exportColor("green");

doc.close(SaveOptions.DONOTSAVECHANGES);
