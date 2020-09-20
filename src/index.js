

async function renderNoteConfig(app, html, data) {
    
    const label_source = (data.object.text != undefined && data.object.text.length >=1) ? data.object.text : data.entryName;
    var [iconFilepath,label] = await getMakeIcon(label_source);
    if (iconFilepath === null){
        return; // Not valid, so keep default icon.
    }
    // Fix for Pin Cushion, which uses a file picker instead of the dropdown
    $('input.icon-path[name="icon"]').val(iconFilepath);
    //$('input.icon-path[name="icon"]').val("auto.svg");

    // Add item to selector
    $('select[name="icon"]', html).append(`<option value=${iconFilepath} selected>${label}</option>`);
    //$('select[name="icon"]', html).append(`<option value=Auto selected>Auto</option>`);
    
    //console.log($('section.window-content',html)[0].children)
    //console.log($('section.window-content',html)[0].children[0])
    //console.log($('section.window-content',html)[0].children[0][8])
    //html.find('div.form-group')[6].after("<p> asdf</p>")
    
    // TODO Add config for this size override
    $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
}


function templateCircle(fill, stroke) {
    return `<circle style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" cx="250" cy="250" r="220" />`
}
function templateSquare(fill, stroke) {
    return `<rect style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" x="31" y="31" height="450" width="450"/>`
}
function templateDiamond(fill, stroke) {
    return `<rect style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" x="190" y="-170" height="340" width="340"  transform="rotate(45)" ry="50"/>`
}
function templateText(color,label) {
    return `<text font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' font-size="200" font-weight="400"  x="50%" y="50%" text-anchor="middle" fill="${color}" stroke="${color}" dy=".3em">${label}</text></g></svg>`
}


async function getMakeIcon(label_source) {            
    // user-placed map note
     
    var matches = label_source.match(/^\d{1,2}[a-zA-Z]?|^[a-zA-Z]\d{1,2}/)
    if (matches) {
        var label = matches[0];
        var u_l = label.match(/[A-Z]/) ?"upper":"lower"; 
        
        const iconType = game.settings.get('journal-icon-numbers', "iconType");
        const iconColor = game.settings.get('journal-icon-numbers', "iconColor");
        
        var iconFilename = `${iconColor}_${iconType}_${u_l}_${label}.svg`;
    
        console.debug("Auto-Journal-Icon",label,iconFilename);


        var svgString = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" width="512" height="512"><g>';
         
        if (iconColor == "black") {
            var foreColor = "#FFFFFF";
            var backColor = "#000000";
        }
        else {
            var foreColor = "#000000";
            var backColor = "#FFFFFF";
        }
        
        switch (iconType) {
            case "square":
                svgString += templateSquare(foreColor,backColor) + templateText(backColor, label);
                break;
            case "diamond":
                svgString += templateDiamond(foreColor,backColor) + templateText(backColor, label);
                break;
            case "none":
                svgString += templateTextStart(backColor);
                break;
            default:
                svgString += templateCircle(foreColor,backColor) + templateText(backColor, label);
                break;
        }
        
        let file = new File([svgString], iconFilename, {});
        
        // TODO Add config for save path (And maybe code for s3?)
        var result = await FilePicker.upload("data", "upload/journal-icon-numbers", file, {  });
            
        console.log("Auto-Journal-Icon - Succesfully uploaded", result);
        return [result.path,label];

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

//Hooks.on("closeNoteConfig", closeNote)

async function closeNote(c,d) {  
   // TODO Good spot for generating file after requested
   console.log("AJIN - closeNoteConfig",c,d); 
   console.log(c.getData())
   //c.object.data.icon = "fake.svg"
   
   const label_source = (c.object.data.text != undefined && c.object.data.text.length >=1) ? c.object.data.text : c.object.entry.data.name;
    var [iconFilepath,label] = await getMakeIcon(label_source);
    if (iconFilepath === null){
        return;
    }
   
   console.log(canvas.notes.get(c.object.data._id).update({icon:iconFilepath}))
};

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
    if (game.user.isGM) {
        cleanup_legacy_icons();
    }
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
        scope: "world",
        type: String,
        choices: {
            diamond: "Diamond",
            square: "Square",
            circle: "Circle",
            none: "None",
        },
        default: "circle",
        config: true,
        onChange: s => {}
    });
    game.settings.register('journal-icon-numbers', "iconColor", {
        name: "SETTINGS.IconColorN",
        hint: "SETTINGS.IconColorH",
        scope: "world",
        type: String,
        choices: {
            white: "White on Black",
            black: "Black on White",
        },
        default: "black",
        config: true,
        onChange: s => {}
    });
    

}
