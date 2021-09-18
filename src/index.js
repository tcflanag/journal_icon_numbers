import { getMakeIcon, getSvgString } from './icon_lib.js';
import {betterLogger } from "./better_logger.js";
import {MySubmenuApplicationClass,regexSettingsMenu,get_all_settings} from "./settings_menu.js";


//CONFIG.debug.journal_icon_numbers = true // TODO REMOVE BEFORE TAKE-OFF



export function getIconTypes() {
    return {
        hexh: game.i18n.format("AutoJournalIcon.HexagonH"),
        hexv: game.i18n.format("AutoJournalIcon.HexagonV"),
        diamond: game.i18n.format("AutoJournalIcon.Diamond"),
        square: game.i18n.format("AutoJournalIcon.Square"),
        circle: game.i18n.format("AutoJournalIcon.Circle"),
        none: game.i18n.format("AutoJournalIcon.None"),
    };
}


export async function getFontData() {
    let fonts = {"":""}
    let query = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAPWX7UhP6KfUIdFl7nF71Wg5PIjl64ycw").catch((e) => { betterLogger.error(e) })
    if (query === undefined) return ["", "ERROR - Failed to query fonts"]
    let json_fonts = await query.json()
    json_fonts.items.forEach(x => { fonts[x.family] = x.variants })
    return fonts
}

export var fontData = {}

function setPropertyOnce(object, property, value) {
    if (hasProperty(object, property)) return
    setProperty(object, property, value)
}

function initializeData(note) {
    // Init the data.  This is outside the above block so that I can add new flags easily
    const label_source = (note.text != undefined && note.text.length >= 1) ? note.text : game.journal.get(note.entryId).data.name; // TODO entryName
    let folder_id = game.journal.get(note.entryId).data.folder
    let folder = game.folders.get(folder_id)

    var reg_list = []
    var settings = get_all_settings()
    

    if (settings.reg_num_alpha){
        reg_list.push(/^\d{1,3}[a-zA-Z]/)
    }
    
    if (settings.reg_alpha_num){
        reg_list.push(/^[a-zA-Z]\d{1,3}/)
    }
    
    if (settings.reg_num){
        reg_list.push(/^\d{1,4}/)
    }
    
    if (settings.reg_alpha_space){
        reg_list.push(/^([a-zA-Z]) /)
    }

    if (settings.reg_alpha_dot){
        reg_list.push(/^([a-zA-Z])\./)
    }
    
    if (settings.reg_custom){
        reg_list.push(RegExp(settings.reg_custom))
    }
    
    betterLogger.debug("Label to test",label_source)
    var result = regTester(label_source,reg_list)
    betterLogger.debug("Result",result)

    setPropertyOnce(note, "flags.autoIconFlags.autoIcon", !!result)
    setPropertyOnce(note, "flags.autoIconFlags.iconText", result )
    setPropertyOnce(note, "flags.autoIconFlags.folder", folder ? folder.data.name: "")
    setPropertyOnce(note, "flags.autoIconFlags.iconType", settings.iconType)
    setPropertyOnce(note, "flags.autoIconFlags.foreColor", settings.foreColor)
    setPropertyOnce(note, "flags.autoIconFlags.backColor", settings.backColor)
    setPropertyOnce(note, "flags.autoIconFlags.fontFamily", settings.fontFamily)
    setPropertyOnce(note, "flags.autoIconFlags.fontBold", settings.fontBold)
    setPropertyOnce(note, "flags.autoIconFlags.fontItalics", settings.fontItalics)
    setPropertyOnce(note, "flags.autoIconFlags.strokeWidth", settings.strokeWidth)
    betterLogger.debug("Initial Flags",note)

}

export function regTester(label_source,reg_list){
    for( var reg of reg_list) {
        betterLogger.debug("Testing Regex",reg)
        var matches = label_source.match(reg)
        if (matches){
            betterLogger.debug("Matches",matches)
            for (var match of matches.reverse())
            if (match) return match         
        }
    }
}

async function renderNoteConfig(app, html, data) {

    console.log(data.data._id)
    if (!hasProperty(data, "data._id") || data.data._id == null) {// Only force the size once, so that user can override it. This checks for item creation
        data.data.iconSize = Math.round(game.scenes.viewed.data.grid * game.settings.get('journal-icon-numbers', "iconScale"));
        data.data.fontSize = game.settings.get('journal-icon-numbers', "fontSize");
    }
    initializeData(data.data) // Set all my flags

    html[0].style.height = "" //Dynamic height. Especially usefull for the new color picker
    html[0].style.top = ""; // shift the window up to make room

    var templateName = "modules/journal-icon-numbers/templates/template_notesPage.html"
    var fontData = await getFontData()
    betterLogger.debug("Render Flags",data.data.flags)
    var new_html = await renderTemplate(templateName, { iconTypes: getIconTypes(), fontTypes: Object.keys(fontData), flags: data.data.flags })
    betterLogger.debug("Rendered result",data)
    if ((!hasProperty(data, "data._id") || data.data._id == null ) && game.settings.get('journal-icon-numbers', "folderIcon")) { // Only set the folder icon the first time the journal is created.
        for (const [iconName, iconFilepath] of Object.entries(data.icons)){
            if  (iconName === getProperty(data.data.flags, 'autoIconFlags.folder')) {
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

export async function svgWrapper(html) {
    var fontData = await getFontData()
    if (html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked) {
        const flags = {
            autoIcon: html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked,
            iconType: html.find('select[name="flags.autoIconFlags.iconType"]').val(),
            iconText: html.find('input[name="flags.autoIconFlags.iconText"]').val(),
            foreColor: html.find('input[name="flags.autoIconFlags.foreColor"]').val(),
            backColor: html.find('input[name="flags.autoIconFlags.backColor"]').val(),
            fontFamily: html.find('select[name="flags.autoIconFlags.fontFamily"]').val(),
            strokeWidth: html.find('input[name="flags.autoIconFlags.strokeWidth"]').val(),
            fontBold: html.find('input[name="flags.autoIconFlags.fontBold"]')[0].checked,
            fontItalics: html.find('input[name="flags.autoIconFlags.fontItalics"]')[0].checked,

        }
        getSvgString(flags).then(v => html.find('div[name="sample-icon"]')[0].innerHTML = v)
        
        var fontName = html.find('select[name="flags.autoIconFlags.fontFamily"]').val()
        betterLogger.debug(fontName,fontData[fontName])

        if (fontData[fontName].includes('700')){
            html.find('input[name="flags.autoIconFlags.fontBold"]')[0].disabled = false
        }
        else {
            html.find('input[name="flags.autoIconFlags.fontBold"]')[0].disabled = true
            html.find('input[name="flags.autoIconFlags.fontBold"]')[0].checked = false
        }
        
        if (fontData[fontName].includes('italic')){
            html.find('input[name="flags.autoIconFlags.fontItalics"]')[0].disabled = false
        }
        else {
            html.find('input[name="flags.autoIconFlags.fontItalics"]')[0].disabled = true
            html.find('input[name="flags.autoIconFlags.fontItalics"]')[0].checked = false
        }

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
            
            initializeData(new_note)
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


function settingsWrapper(key,type,def){
    game.settings.register('journal-icon-numbers', key, {type:type,default: def,scope:"world"});
}

async function registerSettings() {

    fontData = await getFontData()

    game.settings.registerMenu("journal-icon-numbers", "mySettingsMenu", {
        name: "SETTINGS.AutoJournalIcon.iconSettingsN",
        label: "SETTINGS.AutoJournalIcon.iconSettingsL",      // The text label used in the button
        hint: "SETTINGS.AutoJournalIcon.iconSettingsH",
        icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
        type: MySubmenuApplicationClass,   // A FormApplication subclass
        restricted: true                   // Restrict this submenu to gamemaster only?
      });

      game.settings.registerMenu("journal-icon-numbers", "myRegexSettingsMenu", {
        name: "SETTINGS.AutoJournalIcon.regexSettingsN",
        label: "SETTINGS.AutoJournalIcon.regexSettingsL",      // The text label used in the button
        hint: "SETTINGS.AutoJournalIcon.regexSettingsH",
        icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
        type: regexSettingsMenu,   // A FormApplication subclass
        restricted: true                   // Restrict this submenu to gamemaster only?
      });

      game.settings.register('journal-icon-numbers', "folderIcon", {
        name: "SETTINGS.AutoJournalIcon.folderIconN",
        hint: "SETTINGS.AutoJournalIcon.folderIconH",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register('journal-icon-numbers', "uploadPath", {
        name: "SETTINGS.AutoJournalIcon.uploadPathN",
        hint: "SETTINGS.AutoJournalIcon.uploadPathH",
        scope: "world",
        type: String,
        default: "upload/journal-icon-numbers",
        config: true,
    });

    settingsWrapper("fontFamily", String,"");
    
    settingsWrapper( "fontBold", Boolean,false);
    settingsWrapper("fontItalics", Boolean,false);
    settingsWrapper( "iconType", String,"circle");
    settingsWrapper("iconScale", Number,0.75);    
    settingsWrapper("strokeWidth", Number,10);
    settingsWrapper("fontSize", Number,48);
    settingsWrapper("reg_alpha_num",Boolean,true);
    settingsWrapper("reg_num_alpha", Boolean,true);
    settingsWrapper("reg_num",Boolean,true);
    settingsWrapper("reg_alpha_space", Boolean,false);
    settingsWrapper("reg_alpha_dot", Boolean,false);
    settingsWrapper("reg_custom", String, "");

    settingsWrapper("foreColor", String,"#000000ff")
    settingsWrapper("backColor", String,"##ffffff56")

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

