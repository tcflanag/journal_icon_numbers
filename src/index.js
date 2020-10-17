
const LOG_PREFIX = ["%cAuto Journal Icon Numbers%c - LOG -", 'background: #bada55; color: #222','']
const DEBUG_PREFIX = ["%cAuto Journal Icon Numbers%c - DEBUG -", 'background: #FF9900; color: #222','']
const ERROR_PREFIX = ["%cAuto Journal Icon Numbers%c - ERROR -", 'background: #bada55; color: #FF0000','']


function getIconTypes() {
    return  {
            diamond: game.i18n.format("AutoJournalIcon.Diamond"),
            square: game.i18n.format("AutoJournalIcon.Square"),
            circle: game.i18n.format("AutoJournalIcon.Circle"),
            none: game.i18n.format("AutoJournalIcon.None"),
        };
    }

String.prototype.hashCode = function() {
    var hash = 4325, i = this.length
    while(i)
        hash = (hash * 43) ^ this.charCodeAt(--i)
    return (hash >>> 0).toString(16);
    }

function notUndefPicker(a,b){
    return (a != undefined )? a: b;
}

async function renderNoteConfig(app, html, data) {
    
    const label_source = (data.object.text != undefined && data.object.text.length >=1) ? data.object.text : data.entryName;

    var matches = label_source.match(/^\d{1,2}[a-zA-Z]?|^[a-zA-Z]\d{1,2}/)
    if (!matches) {
        console.debug(...DEBUG_PREFIX,"No Match")
        //return
    }
        
    // Preset the flags if they don't already exist
    if(!('flags' in data.object)) {
        data.object.flags = {}
    }
    if(!('autoIconFlags' in data.object.flags)){
         
        data.object.flags.autoIconFlags = {
            
            autoIcon:notUndefPicker(data.object.flags.autoIcon,!!matches),
            iconText:notUndefPicker(data.object.flags.iconText, matches?matches[0]:""),
            iconType:notUndefPicker(data.object.flags.iconType,game.settings.get('journal-icon-numbers', "iconType")),
            foreColor:notUndefPicker(data.object.flags.foreColor,game.settings.get('journal-icon-numbers', "foreColor")),
            backColor:notUndefPicker(data.object.flags.backColor,game.settings.get('journal-icon-numbers', "backColor")),
            loopDetector:0
        }

        data.object.iconSize = Math.round(game.scenes.viewed.data.grid * game.settings.get('journal-icon-numbers', "iconScale"));
    }
    

    
    try{
        window.Ardittristan.ColorSetting.tester
        var templateName = "modules/journal-icon-numbers/template_newColor.html"
    } catch {
        // Fallback code if no colorSettings module
        var templateName = "modules/journal-icon-numbers/template.html"
    }
    data.object.flags.autoIconFlags.loopDetector = ! data.object.flags.autoIconFlags.loopDetector
    
    html[0].style.height = "" //Dynamic height. Especially usefull for the new color picker
    html[0].style.top = "100px";

    var new_html = await renderTemplate(templateName,{iconTypes:getIconTypes(),flags:data.object.flags})
    
    html.find('button[name="submit"]').before(new_html);
    
    
    // This is a work around for VTTA smashing the iconSize
    // This will keep it where it is set (since this module loads in after VTTA)
    
    $('input[name="iconSize"]').val(data.object.iconSize);
       

}


function templateCircle(fill, stroke) {
    return `<circle style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" cx="256" cy="256" r="241" />`
}
function templateSquare(fill, stroke) {
    return `<rect style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" x="15" y="15" height="482" width="482"/>`
}
function templateDiamond(fill, stroke) {
    return `<rect style="fill:${fill};stroke:${stroke};stroke-width:30;stroke-miterlimit:10;" x="178" y="-182" height="365" width="365"  transform="rotate(45)" ry="50"/>`
}
function templateText(color,label) {
    return `<text font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' font-size="200" font-weight="400"  x="50%" y="50%" text-anchor="middle" fill="${color}" stroke="${color}" dy=".3em">${label}</text></g></svg>`
}
function svgTemplate() {
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" width="512" height="512"><g>';
}

async function getMakeIcon(flags ) {            
    // user-placed map note
    if (!flags.autoIcon) { return [null,null] }
    
    const iconType = flags.iconType
    const foreColor = flags.foreColor
    const backColor = flags.backColor
    const iconText = flags.iconText
       
    // Shorten the name, as well as cover for non-case sensitive host OS's (like Windows)
    // Keep iconText in here as well as in the file name for clarity and to (hopefully) minimize collisions.
    var uniqueBits = `${foreColor}_${backColor}_${iconType}_${iconText}`
    var iconFilename = `${uniqueBits.hashCode()}_${iconText}.svg`;

    console.debug(...DEBUG_PREFIX,"Making",iconText,iconFilename);


    var svgString = svgTemplate()
    
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
    
    
    
    let file = new File([svgString], iconFilename, {});
    var uploadPath = game.settings.get('journal-icon-numbers', "uploadPath")
    var full_path = uploadPath + "/" + iconFilename

    var dest = typeof ForgeVTT === "undefined" ?"data":"forgevtt"
    var existing = await FilePicker.browse(dest,uploadPath)
    if (existing.files.includes(full_path)){
        return full_path
    }
    
    var result = await FilePicker.upload(dest, uploadPath, file, {  });            
    return result.path;

}




Hooks.once("canvasInit", () => {
    if (game.user.isGM) {
    	makeDirs(game.settings.get('journal-icon-numbers', "uploadPath"))
        cleanup_legacy_icons();
    }
})

Hooks.on("renderNoteConfig", renderNoteConfig); 
Hooks.on("updateNote", updateNote) 
Hooks.on("createNote", updateNote) 
Hooks.on("preUpdateNote", preUpdateNote) 


Hooks.once("init", registerSettings);


function preUpdateNote(scene,note,changes) {

    // Not using autoIcon for this icon, so skip other checks
    if (!('autoIconFlags' in note.flags) || ! note.flags.autoIconFlags.autoIcon) return true
    
    if(changes.icon && !('flags' in changes && 'autoIconFlags' in changes.flags && 'loopDetector' in changes.flags.autoIconFlags)) {
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
    if(!('autoIconFlags' in note.flags)  || ! note.flags.autoIconFlags.autoIcon) { console.debug(...DEBUG_PREFIX,"Off"); return }
    
    // If icon changes, and loopDetector does, that means we're in a loop caused 
    // by the update at the end of this function
    if ('flags' in changes && 'autoIconFlags' in changes.flags && 'loopDetector' in changes.flags.autoIconFlags ){
        console.debug(...DEBUG_PREFIX,"LOOP DETECTOR!!!")
        return
    }
    
    // Nothing important changed, quit early
    console.debug(...DEBUG_PREFIX,changes)
    if (!('renderSheet' in changes || 'flags' in changes && 'autoIconFlags' in changes.flags)) {
        console.debug(...DEBUG_PREFIX,"No changes")
        return
    }
    
        
    var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
    new_note.icon = await getMakeIcon(note.flags.autoIconFlags)
          
    // Since getMakeIcon is async (due to block for file upload, we need to explictly call update here
    // instead of doing this whole thing as a preUpdate block and getting it for free
    // This does cause potential infinite loops of changes, hence loop detector above
    // Inverting the value to ensure it changes.
    new_note.flags.autoIconFlags.loopDetector = ! new_note.flags.autoIconFlags.loopDetector
    
    console.debug(...DEBUG_PREFIX,"Trigger Update !!")
    scene.updateEmbeddedEntity("Note",new_note)      

};



async function makeDirs(full_path) {
   console.debug(...DEBUG_PREFIX, "Creating dirs");
   var dest = typeof ForgeVTT === "undefined" ?"data":"forgevtt"
   var base_path = ""
    for (var path of full_path.split("/")) {
        base_path += path+ "/"
        await FilePicker.createDirectory(dest,base_path,{}).then((result) => {
            console.log(...LOG_PREFIX,"Created "+base_path);
        })
        .catch((error) => {
            if (!error.includes("EEXIST")) {
                console.error(...ERROR_PREFIX,error);
            }        
        });
    }
};





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
                    autoIconFlags:{
                        autoIcon:true,
                        iconText: matches[0],
                        iconType:game.settings.get('journal-icon-numbers', "iconType"),
                        foreColor:game.settings.get('journal-icon-numbers', "foreColor"),
                        backColor:game.settings.get('journal-icon-numbers', "backColor"),
                        loopDetector:0
                    }
                }
                
                var iconFilepath = await getMakeIcon(flags)
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
        name: "SETTINGS.AutoJournalIcon.IconStyleN",
        hint: "SETTINGS.AutoJournalIcon.IconStyleH",
        scope: "world",
        type: String,
        choices:getIconTypes(),
        default: "circle",
        config: true
    });

    game.settings.register('journal-icon-numbers', "uploadPath", {
        name: "SETTINGS.AutoJournalIcon.uploadPathN",
        hint: "SETTINGS.AutoJournalIcon.uploadPathH",
        scope: "world",
        type: String,
        default: "upload/journal-icon-numbers",
        onChange: (newPath) =>{ makeDirs(newPath)},
        config: true
    });
    
    game.settings.register('journal-icon-numbers',"iconScale", {
        name: "SETTINGS.AutoJournalIcon.iconScaleN",
        hint: "SETTINGS.AutoJournalIcon.iconScaleH",
        scope: "world",
        type: Number,
        default: 0.75,
        config: true
    });

    var useColorPicker = true
    
    try{window.Ardittristan.ColorSetting.tester} catch { useColorPicker = false}
        
    if (useColorPicker){
        new window.Ardittristan.ColorSetting("journal-icon-numbers", "foreColor", {
            name: "SETTINGS.AutoJournalIcon.foreColorN",      // The name of the setting in the settings menu
            hint: "SETTINGS.AutoJournalIcon.foreColorH",   // A description of the registered setting and its behavior
            label: "SETTINGS.AutoJournalIcon.foreColorL",         // The text label used in the button
            restricted: true,             // Restrict this setting to gamemaster only?
            defaultColor: "#000000ff",     // The default color of the setting
            scope: "world",               // The scope of the setting
            onChange: (value) => {}        // A callback function which triggers when the setting is changed
        })
        
        new window.Ardittristan.ColorSetting("journal-icon-numbers", "backColor", {
            name: "SETTINGS.AutoJournalIcon.backColorN",      // The name of the setting in the settings menu
            hint: "SETTINGS.AutoJournalIcon.backColorH",   // A description of the registered setting and its behavior
            label: "SETTINGS.AutoJournalIcon.backColorL",         // The text label used in the button
            restricted: true,             // Restrict this setting to gamemaster only?
            defaultColor: "#ffffffff",     // The default color of the setting
            scope: "world",               // The scope of the setting
            onChange: (value) => {}        // A callback function which triggers when the setting is changed
        })
    }
    else {
        game.settings.register('journal-icon-numbers', "foreColor", {
            name: "SETTINGS.AutoJournalIcon.foreColorN",
            hint: "SETTINGS.AutoJournalIcon.foreColorH",
            scope: "world",
            type: String,
            default: "#000000",
            config: true,
            onChange: s => {}
        });    
        
        
        game.settings.register('journal-icon-numbers', "backColor", {
            name: "SETTINGS.AutoJournalIcon.backColorN",
            hint: "SETTINGS.AutoJournalIcon.backColorH",
            scope: "world",
            type: String,
            default: "#FFFFFF",
            config: true,
            onChange: s => {}
        });    
    }
    

}
