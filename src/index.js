import { getMakeIcon, getSvgString } from './icon_lib.js';
import {betterLogger } from "./better_logger.js";




function getIconTypes() {
    return {
        hexh: game.i18n.format("AutoJournalIcon.HexagonH"),
        hexv: game.i18n.format("AutoJournalIcon.HexagonV"),
        diamond: game.i18n.format("AutoJournalIcon.Diamond"),
        square: game.i18n.format("AutoJournalIcon.Square"),
        circle: game.i18n.format("AutoJournalIcon.Circle"),
        none: game.i18n.format("AutoJournalIcon.None"),
    };
}

async function getFontNames() {
    let fonts = {"":""}
    let query = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAPWX7UhP6KfUIdFl7nF71Wg5PIjl64ycw").catch((e) => { betterLogger.error(e) })
    if (query === undefined) return ["", "ERROR - Failed to query fonts"]
    let json_fonts = await query.json()
    json_fonts.items.forEach(x => { fonts[x.family] = x.family })
    return fonts
}

function setPropertyOnce(object, property, value) {
    if (hasProperty(object, property)) return
    setProperty(object, property, value)
}

function initliazeData(note) {
    // Init the data.  This is outside the above block so that I can add new flags easily
    const label_source = (note.text != undefined && note.text.length >= 1) ? note.text : game.journal.get(note.entryId).data.name; // TODO entryName
    let folder_id = game.journal.get(note.entryId).data.folder
    let folder = game.folders.get(folder_id)
    var matches = label_source.match(/^\d{1,3}[a-zA-Z]|^[a-zA-Z]\d{1,3}|\d{1,4}/)
    setPropertyOnce(note, "flags.autoIconFlags.autoIcon", !!matches)
    setPropertyOnce(note, "flags.autoIconFlags.iconText", matches ? matches[0] : "")
    setPropertyOnce(note, "flags.autoIconFlags.folder", folder ? folder.data.name: "")
    setPropertyOnce(note, "flags.autoIconFlags.iconType", game.settings.get('journal-icon-numbers', "iconType"))
    setPropertyOnce(note, "flags.autoIconFlags.foreColor", game.settings.get('journal-icon-numbers', "foreColor"))
    setPropertyOnce(note, "flags.autoIconFlags.backColor", game.settings.get('journal-icon-numbers', "backColor"))
    setPropertyOnce(note, "flags.autoIconFlags.fontFamily", game.settings.get('journal-icon-numbers', "fontFamily"))

}

async function renderNoteConfig(app, html, data) {

    if (!hasProperty(data, "data.data._id")) // Only force the size once, so that user can override it. This checks for item creation
        data.data.iconSize = Math.round(game.scenes.viewed.data.grid * game.settings.get('journal-icon-numbers', "iconScale"));
        data.data.fontSize = game.settings.get('journal-icon-numbers', "fontSize");

    initliazeData(data.data) // Set all my flags

    html[0].style.height = "" //Dynamic height. Especially usefull for the new color picker
    html[0].style.top = ""; // shift the window up to make room

    var templateName = "modules/journal-icon-numbers/template_newColor.html"
    var new_html = await renderTemplate(templateName, { iconTypes: getIconTypes(), fontTypes: await getFontNames(), flags: data.data.flags })

    if (!hasProperty(data, "data._id") && game.settings.get('journal-icon-numbers', "folderIcon")) { // Only set the folder icon the first time the journal is created.
        for(var iconFilepath in data.entryIcons) {
            if  (data.entryIcons[iconFilepath] === getProperty(data.data.flags, 'autoIconFlags.folder')) {
                $('select[name="icon"]', html).val(iconFilepath)
                $('input.icon-path[name="icon"]').val(iconFilepath);            // Fix for Pin Cushion, which uses a file picker instead of the dropdown
            }
        }
    }
    html.find('button[name="submit"]').before(new_html);

    svgWrapper(html)

    // Add listeners for auto updating icon
    html.find('[name^="flags.autoIconFlags"]').each((i, x) => x.addEventListener('input', () => { svgWrapper(html) }))
    html.find('[name^="flags.autoIconFlags"]').each((i, x) => x.addEventListener('change', () => { svgWrapper(html) }))

    //Hook on standard icon changes to detect that (works with pincushion too)
    html.find('[name="icon"]').each((i, x) => x.addEventListener('change', () => { svgWrapper(html) }))

    // This is a work around for VTTA smashing the iconSize
    // This will keep it where it is set (since this module loads in after VTTA)
    $('input[name="iconSize"]').val(data.data.iconSize);
    $('input[name="fontSize"]').val(data.data.fontSize);
}

async function svgWrapper(html) {

    if (html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked) {
        const flags = {
            autoIcon: html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked,
            iconType: html.find('select[name="flags.autoIconFlags.iconType"]').val(),
            iconText: html.find('input[name="flags.autoIconFlags.iconText"]').val(),
            foreColor: html.find('input[name="flags.autoIconFlags.foreColor"]').val(),
            backColor: html.find('input[name="flags.autoIconFlags.backColor"]').val(),
            fontFamily: html.find('select[name="flags.autoIconFlags.fontFamily"]').val()

        }
        getSvgString(flags).then(v => html.find('div[name="sample-icon"]')[0].innerHTML = v)
        betterLogger.debug("DONE")
    }
    else
        html.find('div[name="sample-icon"]')[0].innerHTML = `<img height=128 width=128 style="border: 0;" src="${html.find('[name="icon"]').val()}">`

}


Hooks.once("init", registerSettings);
Hooks.once('ready', () => {
    try{window.Ardittristan.ColorSetting.tester} catch {
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
    if (game.user.isGM) {
        Hooks.on("renderNoteConfig", renderNoteConfig);
        Hooks.on("updateNote", updateNote)
        Hooks.on("createNote", updateNote)
    }
});

async function updateNote(note, changes,id) {

    // // Not using autoIcon for this icon, so quit
    if (!getProperty(note.data.flags, 'autoIconFlags.autoIcon')) return true

    var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
    
    new_note.icon = await getMakeIcon(note.data.flags.autoIconFlags)
    betterLogger.debug( "Trigger Update !!")
    canvas.scene.updateEmbeddedDocuments("Note",[new_note], {recursive:false})
};


async function cleanup_legacy_icons(value) {
    // Rebuild all icons - either legacy pre 1.0.4 fixed paths, or current modern paths
    // This is good to call if the images get deleted, or you are migrating locations

    // This function only fires onChange, and the setting is always false in game.
    // If this function is passed false, do nothing
    // If true, reset to false, and do the magic
    if (value == "no") return
    game.settings.set('journal-icon-numbers', "cleanupLegacy", "no")

    betterLogger.debug( "Legacy Cleanup")

    for (var scene of game.scenes.entities) {
        let changes = false
        var new_data = [];
        for (const note of scene.data.notes) {
            var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
            if (value == "full") 
                delete new_note.flags['autoIconFlags']
            
            initliazeData(new_note)
            if (new_note.flags.autoIconFlags.autoIcon) {
                if (value == "full") {
                    let new_size = Math.round(game.scenes.viewed.data.grid * game.settings.get('journal-icon-numbers', "iconScale"));
                    if (new_note.iconSize != new_size)
                        changes = true
                    new_note.iconSize = new_size
                }
                var iconFilePath = await getMakeIcon(new_note.flags.autoIconFlags)
                if (note.icon !== iconFilePath) {
                    betterLogger.log( "Replacing old path " + note.icon + " with " + iconFilePath);
                    new_note.icon = iconFilePath;
                    changes = true
                }
            }
            new_data.push(new_note)
        }

        if (changes) // Only trigger scene update if we have changes
            scene.update({ notes: new_data })
    }
    window.location.reload()
}



async function registerSettings() {

    game.settings.register('journal-icon-numbers', "fontFamily", {
        name: "SETTINGS.AutoJournalIcon.fontFamilyN",
        hint: "SETTINGS.AutoJournalIcon.fontFamilyH",
        scope: "world",
        type: String,
        choices: await getFontNames(),
        default: "",
        config: true
    });
    game.settings.register('journal-icon-numbers', "iconType", {
        name: "SETTINGS.AutoJournalIcon.IconStyleN",
        hint: "SETTINGS.AutoJournalIcon.IconStyleH",
        scope: "world",
        type: String,
        choices: getIconTypes(),
        default: "circle",
        config: true
    });

    game.settings.register('journal-icon-numbers', "uploadPath", {
        name: "SETTINGS.AutoJournalIcon.uploadPathN",
        hint: "SETTINGS.AutoJournalIcon.uploadPathH",
        scope: "world",
        type: String,
        default: "upload/journal-icon-numbers",
        config: true
    });

    game.settings.register('journal-icon-numbers', "iconScale", {
        name: "SETTINGS.AutoJournalIcon.iconScaleN",
        hint: "SETTINGS.AutoJournalIcon.iconScaleH",
        scope: "world",
        type: Number,
        default: 0.75,
        config: true
    });
    
    game.settings.register('journal-icon-numbers', "fontSize", {
        name: "SETTINGS.AutoJournalIcon.fontSizeN",
        hint: "SETTINGS.AutoJournalIcon.fontSizeH",
        scope: "world",
        type: Number,
        default: 48,
        config: true
    });

    game.settings.register('journal-icon-numbers', "fontSize", {
        name: "SETTINGS.AutoJournalIcon.fontSizeN",
        hint: "SETTINGS.AutoJournalIcon.fontSizeH",
        scope: "world",
        type: Number,
        default: 48,
        config: true
    });

    game.settings.register('journal-icon-numbers', "fontSize", {
        name: "SETTINGS.AutoJournalIcon.fontSizeN",
        hint: "SETTINGS.AutoJournalIcon.fontSizeH",
        scope: "world",
        type: Number,
        default: 48,
        config: true
    });

    game.settings.register('journal-icon-numbers', "folderIcon", {
        name: "SETTINGS.AutoJournalIcon.folderIconN",
        hint: "SETTINGS.AutoJournalIcon.folderIconH",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    new window.Ardittristan.ColorSetting("journal-icon-numbers", "foreColor", {
        name: "SETTINGS.AutoJournalIcon.foreColorN",      // The name of the setting in the settings menu
        hint: "SETTINGS.AutoJournalIcon.foreColorH",   // A description of the registered setting and its behavior
        label: "SETTINGS.AutoJournalIcon.foreColorL",         // The text label used in the button
        restricted: true,             // Restrict this setting to gamemaster only?
        defaultColor: "#000000ff",     // The default color of the setting
        scope: "world",               // The scope of the setting
        onChange: (value) => { }        // A callback function which triggers when the setting is changed
    })

    new window.Ardittristan.ColorSetting("journal-icon-numbers", "backColor", {
        name: "SETTINGS.AutoJournalIcon.backColorN",      // The name of the setting in the settings menu
        hint: "SETTINGS.AutoJournalIcon.backColorH",   // A description of the registered setting and its behavior
        label: "SETTINGS.AutoJournalIcon.backColorL",         // The text label used in the button
        restricted: true,             // Restrict this setting to gamemaster only?
        defaultColor: "#ffffff6f",     // The default color of the setting
        scope: "world",               // The scope of the setting
        onChange: (value) => { }        // A callback function which triggers when the setting is changed
    })

    game.settings.register('journal-icon-numbers', "cleanupLegacy", {
        name: "SETTINGS.AutoJournalIcon.rebuildN",
        hint: "SETTINGS.AutoJournalIcon.rebuildH",
        scope: "world",
        type: String,
        default: "no",
        choices: {no: game.i18n.format("AutoJournalIcon.norebuild"), partial: game.i18n.format("AutoJournalIcon.partialrebuild"), full: game.i18n.format("AutoJournalIcon.fullrebuild")},
        config: true,
        onChange: (value) => { cleanup_legacy_icons(value) }        // A callback function which triggers when the setting is changed
    });
}
