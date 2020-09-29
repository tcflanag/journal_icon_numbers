
const LOG_PREFIX = ["%cAuto Journal Icon Numbers%c - LOG -", 'background: #bada55; color: #222','']
const DEBUG_PREFIX = ["%cAuto Journal Icon Numbers%c - DEBUG -", 'background: #FF9900; color: #222','']
const ERROR_PREFIX = ["%cAuto Journal Icon Numbers%c - ERROR -", 'background: #bada55; color: #FF0000','']



var iconTypes = {
            diamond: "Diamond",
            square: "Square",
            circle: "Circle",
            none: "None",
        };

async function renderNoteConfig(app, html, data) {
    
    const label_source = (data.object.text != undefined && data.object.text.length >=1) ? data.object.text : data.entryName;

    var matches = label_source.match(/^\d{1,2}[a-zA-Z]?|^[a-zA-Z]\d{1,2}/)
    if (!matches) {
        console.debug(...DEBUG_PREFIX,"No Match")
        //return
    }
    
    // Preset the flags if they don't already exist
    if(!('flags' in data.object)){
        data.object.flags = {
            autoIcon:!!matches,
            iconText: matches?matches[0]:"",
            iconType:game.settings.get('journal-icon-numbers', "iconType"),
            foreColor:game.settings.get('journal-icon-numbers', "foreColor"),
            backColor:game.settings.get('journal-icon-numbers', "backColor"),
            loopDetector:0
            }
    }
    

    var templateName = "modules/journal-icon-numbers/template_newColor.html"
    html[0].style.height = "525px";  //Add extra room for 
    html[0].style.top = "100px";
    try{window.Ardittristan.ColorSetting.tester} catch {
        // Fallback code if no colorSettings module
        templateName = "modules/journal-icon-numbers/template.html"
        html[0].style.height = "525px";
    }
    data.object.flags.loopDetector = ! data.object.flags.loopDetector
    var new_html = await renderTemplate(templateName,{iconTypes:iconTypes,flags:data.object.flags})
    
    html.find('button[name="submit"]').before(new_html);
    
       
    
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


async function getMakeIcon(flags ) {            
    // user-placed map note
    if (!flags.autoIcon) { return [null,null] }
    
    const iconType = flags.iconType
    const foreColor = flags.foreColor
    const backColor = flags.backColor
    const iconText = flags.iconText
    
    var u_l = iconText.match(/[A-Z]/) ?"u":"l";   // TODO This will get confused if multiple letters on non-case sensitive host OSs
    
    
    var iconFilename = `${foreColor.replace("#","")}_${backColor.replace("#","")}_${iconType}_${u_l}_${iconText}.svg`;

    console.debug(...DEBUG_PREFIX,"Making",iconText,iconFilename);


    var svgString = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" width="512" height="512"><g>';

    
    switch (iconType) {
        case "square":
            svgString += templateSquare(backColor,foreColor);
            break;
        case "diamond":
            svgString += templateDiamond(backColor,foreColor);
            break;
        case "none":
            break;
        default:
            svgString += templateCircle(backColor,foreColor);
            break;
    }
    
    svgString += templateText(foreColor, iconText);
    
    
    
    // TODO Add config for save path (And maybe code for s3?)
    // Unsure, since The Forge does weird things with the path
    let file = new File([svgString], iconFilename, {});
    var result = await FilePicker.upload("data", "upload/journal-icon-numbers", file, {  });            
    console.log(...LOG_PREFIX,"Succesfully uploaded", result);

    return [result.path,iconText];
    


}




Hooks.once("canvasInit", () => {
    if (game.user.isGM) {
        makeDirs();
        cleanup_legacy_icons();
    }
})

Hooks.on("renderNoteConfig", renderNoteConfig); 
Hooks.on("updateNote", updateNote) 
Hooks.on("createNote", updateNote) 
Hooks.on("preUpdateNote", preUpdateNote) 

function preUpdateNote(scene,note,changes) {

    // Not using autoIcon for this icon, so skip other checks
    if(! note.flags.autoIcon) {
        return true
    }
    
    if(changes.icon && !('flags' in changes && 'loopDetector' in changes.flags)) {
        console.debug(...DEBUG_PREFIX,"Icon without Loop")
        delete changes['icon']
    }
    if (Object.keys(changes).length == 1) {
        console.debug (...DEBUG_PREFIX,"Nothing Left")
        return false
    }
}

async function updateNote(scene,note,changes) {  
    
    // Not using autoIcon for this icon, so quit
    if(! note.flags.autoIcon) { console.debug(...DEBUG_PREFIX,"Off"); return }
    
    // If icon changes, and loopDetector does, that means we're in a loop caused 
    // by the update at the end of this function
    if (changes.icon && changes.flags && 'loopDetector' in changes.flags ){
        console.debug(...DEBUG_PREFIX,"LOOP DETECTOR!!!", 'background: #222; color: #bada55')
        return
    }
    
    // Nothing important changed, quit early
    if (!('renderSheet' in changes || 'flags' in changes)) {
        console.debug(...DEBUG_PREFIX,"No changes")
        return
    }
    
    var [iconFilePath,label] = await getMakeIcon(note.flags)
    
    var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
    new_note.icon = iconFilePath
          
    // Since getMakeIcon is async (due to block for file upload, we need to explictly call update here
    // instead of doing this whole thing as a preUpdate block and getting it for free
    // This does cause potential infinite loops of changes, hence loop detector above
    // Inverting the value to ensure it changes.
    new_note.flags.loopDetector = ! new_note.flags.loopDetector
    
    console.debug(...DEBUG_PREFIX,"Trigger Update !!", 'background: #bada55; color: #222')
    scene.updateEmbeddedEntity("Note",new_note)      

};



async function makeDirs() {
  console.debug(...DEBUG_PREFIX, "Creating dirs");
  
  await FilePicker.createDirectory("data","upload",{}).then((result) => {
    console.log(...LOG_PREFIX,"Created upload");
  })
  .catch((error) => {
    if (!error.includes("EEXIST")) {
        console.error(...ERROR_PREFIX,error);
    }        
  });
  await FilePicker.createDirectory("data","upload/journal-icon-numbers",{}).then((result) => {
        console.log(...LOG_PREFIX,"Created upload/journal-icon-numbers");
    })
    .catch((error) => {
        if (!error.includes("EEXIST")) {
            console.error(...ERROR_PREFIX,error);
        }        
    });
};

/**
 * Hook on init
 */
Hooks.on("init", () => {
    registerSettings();
});




async function cleanup_legacy_icons() {
    // Check for icons using the old style of pre-generated paths
    // Build new icons for them, and update them to the new paths
    console.debug(...DEBUG_PREFIX,"Legacy Cleanup")
    for (var scene of game.scenes.entities) {
    
        var new_data = [];
        for (const note of scene.data.notes) {
            var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
            if (note.icon.startsWith("modules/journal-icon-numbers")) {
                
                const label_source = (note.text != undefined && note.text.length >=1) ? note.text : game.journal.get(note.entryId).data.name;
                var matches = label_source.match(/^\d{1,2}[a-zA-Z]?|^[a-zA-Z]\d{1,2}/)
                if (!matches) {
                    console.debug(...DEBUG_PREFIX,"No Match")
                    return
                }
                var flags = {
                    autoIcon:true,
                    iconText: matches[0],
                    iconType:game.settings.get('journal-icon-numbers', "iconType"),
                    foreColor:game.settings.get('journal-icon-numbers', "foreColor"),
                    backColor:game.settings.get('journal-icon-numbers', "backColor"),
                    loopDetector:0
                }
                
                var [iconFilepath,label] = await getMakeIcon(flags)
                console.log(...LOG_PREFIX,"Replacing old path " + note.icon + " with " + iconFilepath);
                
                new_note.icon = iconFilepath;
                
            }
            new_data.push(new_note)
        }
        // Only trigger scene update if we have changes
        if(Object.keys(diffObject(new_data, scene.data.notes)).length > 0) {
            scene.update({notes: new_data})
        }
    }    
    

}
   
function registerSettings() {

    game.settings.register('journal-icon-numbers', "iconType", {
        name: "SETTINGS.IconStyleN",
        hint: "SETTINGS.IconStyleH",
        scope: "world",
        type: String,
        choices:iconTypes,
        default: "circle",
        config: true,
        onChange: s => {}
    });


    
    var useColorPicker = true
    
    try{window.Ardittristan.ColorSetting.tester} catch { useColorPicker = false}
        
    if (useColorPicker){
        new window.Ardittristan.ColorSetting("journal-icon-numbers", "foreColor", {
            name: "SETTINGS.foreColorN",      // The name of the setting in the settings menu
            hint: "SETTINGS.foreColorH",   // A description of the registered setting and its behavior
            label: "SETTINGS.foreColorL",         // The text label used in the button
            restricted: true,             // Restrict this setting to gamemaster only?
            defaultColor: "#000000ff",     // The default color of the setting
            scope: "world",               // The scope of the setting
            onChange: (value) => {}        // A callback function which triggers when the setting is changed
        })
        
        new window.Ardittristan.ColorSetting("journal-icon-numbers", "backColor", {
            name: "SETTINGS.backColorN",      // The name of the setting in the settings menu
            hint: "SETTINGS.backColorH",   // A description of the registered setting and its behavior
            label: "SETTINGS.backColorL",         // The text label used in the button
            restricted: true,             // Restrict this setting to gamemaster only?
            defaultColor: "#ffffffff",     // The default color of the setting
            scope: "world",               // The scope of the setting
            onChange: (value) => {}        // A callback function which triggers when the setting is changed
        })
    }
    else {
        game.settings.register('journal-icon-numbers', "foreColor", {
            name: "SETTINGS.foreColorN",
            hint: "SETTINGS.foreColorH",
            scope: "world",
            type: String,
            default: "#000000",
            config: true,
            onChange: s => {}
        });    
        
        
        game.settings.register('journal-icon-numbers', "backColor", {
            name: "SETTINGS.backColorN",
            hint: "SETTINGS.backColorH",
            scope: "world",
            type: String,// DirectoryPicker.Directory,
            default: "#FFFFFF",
            config: true,
            onChange: s => {}
        });    
    }
    

}
