
function* label_itr() {
    // Generate all letters [a-zA-Z], including blank
    var letters = [""]
    for (let x = 0;x<26;x++) {
        letters.push(String.fromCharCode(97+x));
    }
    for (let x = 0;x<26;x++) {
        letters.push(String.fromCharCode(65+x));
    }
    
    // All numbers 1-99, both 0 padded and not
    var numbers = []
    for (let i = 1; i < 10; i++) {
        numbers.push(("" + i ))
    }
    for (let i = 1; i < 100; i++) {
        numbers.push(("" + i ).padStart(2, "0"));
    }

    // Number + Letter ordering
    for (const order of [0,1]){
        for (const number of numbers) {
            for (const letter of letters) {
                const label = order ? number + letter: letter + number;
                const u_l = letter == letter.toUpperCase()?"upper":"lower";
                const iconType = game.settings.get('journal-icon-numbers', "iconType");
                
                const iconFilename = `${iconType}_${u_l}_${label}.svg`;
                yield [label,iconFilename];
            }
        }
    }
}


    

async function renderNoteConfig(app, html, data) {

    const label_source = (data.object.text != undefined && data.object.text.length >=1) ? data.object.text : data.entryName;
    var [iconFilepath,label] = await getMakeIcon(label_source);
    if (iconFilepath === null){
        return;
    }
    // Fix for Pin Cushion, which uses a file picker instead of the dropdown
    $('input.icon-path[name="icon"]').val(iconFilepath);

    // Add item to selector
    $('select[name="icon"]', html).append(`<option value=${iconFilepath} selected>${label}</option>`);

    // TODO Add config for this size override
    $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
}



async function getMakeIcon(label_source) {            
    // user-placed map note
    
    const idx1 = label_source.length >= 1 ? label_source.substr(0, 1) : "";
    const idx2 = label_source.length >= 2 ? label_source.substr(0, 2) : "";
    const idx3 = label_source.length >= 3 ? label_source.substr(0, 3) : "";
    
    for (const idx of [idx3, idx2, idx1]) {
        for (const [label,iconFilename] of label_itr()) {
            
            if (idx === label) {
                console.debug("Auto-Journal-Icon",label,iconFilename);
                // Iterator returns >10K entries, so only display ones that match this label

                const iconType = game.settings.get('journal-icon-numbers', "iconType");
                              
                // TODO refactor blobs of html
                var typeString = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" width="512" height="512"><g>';
                
                switch (iconType) {
                    case "wcbf":
                        typeString += '<circle style="fill:#ffffff;stroke:#010101;stroke-width:30;stroke-miterlimit:10;" cx="250" cy="250" r="220"> </circle> <text font-family=\'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"\' font-size="200" font-weight="400" fill="black" x="50%" y="52%" text-anchor="middle" stroke="#000000" dy=".3em">';
                        break
                    case "ncwf":
                        typeString += ' <text font-family=\'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"\' font-size="200" font-weight="400" fill="white" x="50%" y="52%" text-anchor="middle" stroke="#FFFFFF" dy=".3em">';
                        break;
                    case "bcwf":
                        typeString += '<circle style="fill:#010101;stroke:#FFFFFF;stroke-width:30;stroke-miterlimit:10;" cx="250" cy="250" r="220"> </circle> <text font-family=\'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"\' font-size="200" font-weight="400" fill="white" x="50%" y="52%" text-anchor="middle" stroke="#FFFFFF" dy=".3em">';
                }
                
                let file = new File([typeString  + label + '</text></g></svg>'], iconFilename, {});
                
                // TODO Add config for save path (And maybe code for s3?)
                var result = await FilePicker.upload("data", "upload/journal-icon-numbers", file, {  });
                    
                console.log("Auto-Journal-Icon - Succesfully uploaded", result);
                return [result.path,label];
                
            }
        }        
    }
    console.log("Auto-Journal-Icon - No Match found");
    return [null,null];
}


// Added the hook in ready() to ensure it goes after other conflicting modules 
// Need to figure out a better way to do this

Hooks.once("ready", function() {
    makeDirs();
    Hooks.on("renderNoteConfig", renderNoteConfig); 
});

Hooks.on("closeNoteConfig", function(c) {  
   // TODO Good spot for generating file after requested
   //console.log("AJIN - closeNoteConfig",c); 
});

async function makeDirs() {
  console.log("Auto-Journal-Icon - Creating dirs");
  
  await FilePicker.createDirectory("data","upload",{}).then((result) => {
    console.log("Auto-Journal-Icon - Created upload");
  })
  .catch((error) => {
    if (!error.includes("EEXIST")) {
        console.error("Auto-Journal-Icon - ",error);
    }        
  });
  await FilePicker.createDirectory("data","upload/journal-icon-numbers",{}).then((result) => {
        console.log("Auto-Journal-Icon - Created upload/journal-icon-numbers");
    })
    .catch((error) => {
        if (!error.includes("EEXIST")) {
            console.error("Auto-Journal-Icon - ",error);
        }        
    });
};

/**
 * Hook on init
 */
Hooks.on("init", () => {
    registerSettings();
});


Hooks.on("canvasInit", () => {
    cleanup_legacy_icons();
})

async function cleanup_legacy_icons() {
    // Check for icons using the old style of pre-generated paths
    // Build new icons for them, and update them to the new paths
    for (var scene of game.scenes.entities) {
    
        var new_data = [];
        for (const note of scene.data.notes) {
            var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
            if (note.icon.startsWith("modules/journal-icon-numbers")) {
                
                const label_source = (note.text != undefined && note.text.length >=1) ? note.text : game.journal.get(note.entryId).data.name;
                var [iconFilepath,label] = await getMakeIcon(label_source)
                console.log("Auto-Journal-Icon : Replacing old path " + note.icon + " with " + iconFilepath);
                
                new_note.icon = iconFilepath;
                
            }
            new_data.push(new_note)
        }
        scene.update({notes: new_data})
    }    
    

}
   

function registerSettings() {

    game.settings.register('journal-icon-numbers', "iconType", {
        name: "SETTINGS.IconStyleN",
        hint: "SETTINGS.IconStyleH",
        scope: "client",
        type: String,
        choices: {
            wcbf: "Black text on white circle",
            bcwf: "White text on black circle",
            ncwf: "White text, no circle"
        },
        default: "wcbf",
        config: true,
        onChange: s => {}
    });
}


