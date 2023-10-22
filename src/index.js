import {getMakeIcon, getSvgString} from './icon_lib.js';
import {betterLogger} from "./better_logger.js";
import {get_all_settings, MySubmenuApplicationClass, regexSettingsMenu} from "./settings_menu.js";


CONFIG.debug.journal_icon_numbers = false


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
    let fonts = {"": ""}
    let query = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAPWX7UhP6KfUIdFl7nF71Wg5PIjl64ycw").catch((e) => {
        betterLogger.error(e)
    })
    if (query === undefined) return ["", "ERROR - Failed to query fonts"]
    let json_fonts = await query.json()
    json_fonts.items.forEach(({family: family, variants: variants}) => {
        fonts[family] = variants
    })
    return fonts
}

export var fontData = {}

export function regTester(label_source, reg_list) {
    for (let reg of reg_list) {
        betterLogger.debug("Testing Regex", reg)
        let matches = label_source.match(reg)
        if (matches) {
            betterLogger.debug("Matches", matches)
            for (let match of matches.reverse()) if (match) return match
        }
    }
}

function autoFolder(data, flags) {
    // folderIcon Mode - Sets the icon based on the folder name (stock icons)

    if (!game.settings.get('journal-icon-numbers', "folderIcon"))
        return false

    if (game.release.generation === 9) {
        for (const iconData of Object.entries(data.icons)) {
            if (iconData[0] === flags['folder']) {
                $('select[name="icon"]').val(iconData[1])
                $('input.icon-path[name="icon"]').val(iconData[1]);            // Fix for Pin Cushion, which uses a file picker instead of the dropdown
                return true
            }
        }
    } else {
        for (const icon of data.icons) {
            if (flags['folder'] === icon.label) {
                $('select[name="icon.selected"]').val(icon.src)
                || game.settings.get('journal-icon-numbers', "folderIcon")
                return true
            }
        }
    }
    return false;
}

function autoPageImage(data, html) {

    // Pages were added in v10
    if (game.release.generation === 9)
        return false

    if (!game.settings.get('journal-icon-numbers', "autoPageImage"))
        return false

    // Sort them based on the page order
    const sortedPages =  data.pages.sort((a, b) => a.sort - b.sort);
    for (const page of sortedPages) {
        if (page.type === 'image' && page.src) {
            html.find('[name="icon.custom"]').val(page.src)
            $('[name="icon.selected"]').val("").change()
            return true
        }
        // Break here if we want to only test the first image.
    }
    return false
}
function dropCanvasJournalPage(_, dropData) {
    var label = ""
    if (dropData.type === "JournalEntryPage" && dropData.anchor?.slug)
        label = dropData.anchor?.name

    Hooks.once("renderNoteConfig", (app, html, data,) => {renderNoteConfig(app, html, data, label)});
}

async function renderNoteConfig(app, html, data, label) {
    const flags = getAllFlags(app.document, label);

    const firstTime = !foundry.utils.hasProperty(data?.data, "_id") || data?.data?._id == null

    if (firstTime && label === undefined){
        // We're creating a new icon, but didn't come from the once hook in the dropCanvasJournalPage
        // This is to support linking to headers in pages!
        return
    }

    if (firstTime) {// Only force the size once, so that user can override it. This checks for item creation
        // Set some default global sizes
        // noinspection JSDeprecatedSymbols,JSUnresolvedVariable
        let gridSize = game.release.generation === 9 ? canvas.scene.data.grid : canvas.scene.grid.size
        $('input[name="iconSize"]').val(Math.round(gridSize * game.settings.get('journal-icon-numbers', "iconScale")));

        let fontSize = game.settings.get('journal-icon-numbers', "fontSize");
        $('input[name="fontSize"]').val(fontSize);

    }

    let autoClose = false;

    if (firstTime) { // Only set the folder icon the first time the journal is created.
        let autoCloseSetting =  game.settings.get('journal-icon-numbers', "autoClose")
        if(!flags.autoIcon) {
            autoClose = autoFolder(data, flags) ? autoCloseSetting : autoClose;
            autoClose = autoPageImage(data, html) ? autoCloseSetting : autoClose;
        }
        autoClose = flags.autoIcon ? autoCloseSetting : autoClose;
    }


    html[0].style.height = "" //Dynamic height. Especially useful for the new color picker
    html[0].style.top = ""; // shift the window up to make room

    const templateName = "modules/journal-icon-numbers/templates/template_notesPage.html"



    betterLogger.debug("Render Flags", flags)
    let new_html = await renderTemplate(templateName,{iconTypes: getIconTypes(), fontTypes: Object.keys(fontData), flags: flags })
    betterLogger.debug("Rendered result", data)

    // Need to keep anything critical for quick mode above here
    html.find('button[type="submit"]').before(new_html);

    if (autoClose) {
        html.find('button[type="submit"]')[0].click()
    }
    await svgWrapper(html)

    // Add listeners for auto updating icon
    html.find('[name^="flags.journal-icon-numbers"]').each((i, x) => x.addEventListener('input', () => {
        svgWrapper(html)
    }))
    html.find('[name^="flags.journal-icon-numbers"]').each((i, x) => x.addEventListener('change', () => {
        svgWrapper(html)
    }))

    //Hook on standard icon changes to detect that (works with pincushion too)
    html.find('[name^="icon"]').each((i, x) => x.addEventListener('change', () => {
        svgWrapper(html)
    }))


}

export async function svgWrapper(html) {

    if (html.find('input[name="flags.journal-icon-numbers.autoIcon"]').length === 0) return;

    if (html.find('input[name="flags.journal-icon-numbers.autoIcon"]')[0].checked) {
        const flags = {
            autoIcon: html.find('input[name="flags.journal-icon-numbers.autoIcon"]')[0].checked,
            iconType: html.find('select[name="flags.journal-icon-numbers.iconType"]').val(),
            iconText: html.find('input[name="flags.journal-icon-numbers.iconText"]').val(),
            foreColor: html.find('input[name="flags.journal-icon-numbers.foreColor"]').val(),
            backColor: html.find('input[name="flags.journal-icon-numbers.backColor"]').val(),
            fontFamily: html.find('select[name="flags.journal-icon-numbers.fontFamily"]').val(),
            strokeWidth: html.find('input[name="flags.journal-icon-numbers.strokeWidth"]').val(),
            iconFontSize: html.find('input[name="flags.journal-icon-numbers.iconFontSize"]').val(),
            fontBold: html.find('input[name="flags.journal-icon-numbers.fontBold"]')[0].checked,
            fontItalics: html.find('input[name="flags.journal-icon-numbers.fontItalics"]')[0].checked,

        }
        getSvgString(flags).then(v => html.find('div[name="sample-icon"]')[0].innerHTML = v)

        let fontName = html.find('select[name="flags.journal-icon-numbers.fontFamily"]').val()
        betterLogger.debug(fontName, fontData[fontName])

        if (fontData[fontName].includes('700')) {
            html.find('input[name="flags.journal-icon-numbers.fontBold"]')[0].disabled = false
        } else {
            html.find('input[name="flags.journal-icon-numbers.fontBold"]')[0].disabled = true
            html.find('input[name="flags.journal-icon-numbers.fontBold"]')[0].checked = false
        }

        if (fontData[fontName].includes('italic')) {
            html.find('input[name="flags.journal-icon-numbers.fontItalics"]')[0].disabled = false
        } else {
            html.find('input[name="flags.journal-icon-numbers.fontItalics"]')[0].disabled = true
            html.find('input[name="flags.journal-icon-numbers.fontItalics"]')[0].checked = false
        }

        betterLogger.debug("DONE")
    } else {
        // Preview built-in icons
        let path = html.find('[name="icon"]').val() // V9 only
        if (!path) // V10 Built-in
            path = html.find('[name="icon.selected"]').val()
        if (!path) // V10 custom path (ala pin cushion)
            path = html.find('[name="icon.custom"]').val()
        html.find('div[name="sample-icon"]')[0].innerHTML = `<img alt="Icon Preview" height=128 width=128 style="border: 0;" src="${path}">`
    }

}


Hooks.once("init", registerSettings);
Hooks.once('ready', () => {
    try {
        // noinspection JSUnresolvedVariable
        window.Ardittristan.ColorSetting.tester
    } catch {
        // noinspection JSUnresolvedFunction
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
    if (game.permissions.NOTE_CREATE.includes(game.user.role)) {
        Hooks.on("renderNoteConfig", renderNoteConfig);
        Hooks.on("dropCanvasData", dropCanvasJournalPage);
    }
    if (game.permissions.FILES_UPLOAD.includes(game.user.role)
        && game.permissions.FILES_BROWSE.includes(game.user.role)) {
        Hooks.on("updateNote", updateNote)
        Hooks.on("createNote", updateNote)
    }
});

function getAllFlags(document, label = "",defaults_only = false) {

    const folder = document?.entry?.folder?.name
    const label_source = label === ""? document.label : label
    const settings = get_all_settings()

    let reg_list = []
    if (settings.reg_num_alpha) reg_list.push(/^\d{1,3}[a-zA-Z]/)
    if (settings.reg_alpha_num) reg_list.push(/^[a-zA-Z]\d{1,3}/)
    if (settings.reg_num) reg_list.push(/^\d{1,4}/)
    if (settings.reg_alpha_space) reg_list.push(/^([a-zA-Z]) /)
    if (settings.reg_alpha_dot) reg_list.push(/^([a-zA-Z])\./)
    if (settings.reg_num_dot) reg_list.push(/^\d{1,4}\./)
    if (settings.reg_custom) reg_list.push(RegExp(settings.reg_custom))

    betterLogger.debug("Label to test", label_source)
    const result = regTester(label_source, reg_list)
    betterLogger.debug("Result", result)


    let flags = {};
    flags["iconText"] = result
    flags["folder"] = folder
    flags["iconType"] = settings.iconType
    flags["foreColor"] = settings.foreColor
    flags["backColor"] = settings.backColor
    flags["fontFamily"] = settings.fontFamily
    flags["fontBold"] = settings.fontBold
    flags["fontItalics"] = settings.fontItalics
    flags["strokeWidth"] = settings.strokeWidth
    flags["iconFontSize"] = settings.iconFontSize
    flags["autoIcon"] = !!result

    if (defaults_only) return flags
    return Object.assign({}, flags, data_wrap(document)?.flags['autoIconFlags'], data_wrap(document)?.flags['journal-icon-numbers']);
}

function srcName() {
    if (game.release.generation === 9) {
        return "icon"
    } else {
        return 'texture.src'
    }
}

async function updateNote(note, changes, id, zzz) {


    betterLogger.debug("updateNote", note, changes, id, zzz)
    if (!note.getFlag('journal-icon-numbers', 'autoIcon')) return true



    let flags = data_wrap(note)?.flags['journal-icon-numbers'];


    const src = await getMakeIcon(flags)



    let flagCleanup = !!data_wrap(note).flags['autoIconFlags']
    if (flagCleanup) { // Cleanup old flags
        note.update({[srcName()]: src, flags: {'-=autoIconFlags': null}})
    } else {
        note.update({[srcName()]: src})
    }

    betterLogger.debug("Trigger Update !!")

}

function data_wrap(obj) { return game.release.generation === 9 ? obj.data : obj}


async function cleanup_legacy_icons(value) {
    // Rebuild all icons - either legacy pre 1.0.4 fixed paths, or current modern paths
    // This is good to call if the images get deleted, or you are migrating locations

    // This function only fires onChange, and the setting is always false in game.
    // If this function is passed false, do nothing
    // If true, reset to false, and do the magic
    if (value === "no") return
    await game.settings.set('journal-icon-numbers', "cleanupLegacy", "no")

    betterLogger.debug("Legacy Cleanup")

    let totalNotes = 0
    for (let scene of game["scenes"]) {

        for (const note of scene.notes) {
            totalNotes++

        }
    }

    let curNoteNum = 0

    async function iconRebuild(note, scene) {
        const label = note.flags['journal-icon-numbers'].iconText
        let flags = getAllFlags(note, label, value ==="full")

        if (!flags['autoIcon']) return

        let data = {
            [srcName()]:"icons/svg/book.svg",
            'flags.journal-icon-numbers': flags
        }

        if (value === "full") {
            let gridSize = game.release.generation === 9 ? scene.data.grid : scene.grid.size
            data['iconSize']= Math.round(gridSize * game.settings.get('journal-icon-numbers', "iconScale"))
        }

        await note.update(data)

    }

    for (let scene of game["scenes"]) {

        for (const note of scene.notes) {
            curNoteNum ++
            const pct = curNoteNum/totalNotes*100
            SceneNavigation.displayProgressBar({label:"Icon Rebuild",pct:pct.toFixed(2)})

            await iconRebuild(note, scene);

        }
    }
    // noinspection JSUnresolvedFunction
    ui.notifications.notify("Icon rebuild done!")
}


async function registerSettings() {

    fontData = await getFontData()

    game.settings.registerMenu("journal-icon-numbers", "mySettingsMenu", {
        name: "SETTINGS.AutoJournalIcon.iconSettingsN", label: "SETTINGS.AutoJournalIcon.iconSettingsL",      // The text label used in the button
        hint: "SETTINGS.AutoJournalIcon.iconSettingsH", icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
        type: MySubmenuApplicationClass,   // A FormApplication subclass
        restricted: true                   // Restrict this submenu to game master only?
    });

    game.settings.registerMenu("journal-icon-numbers", "myRegexSettingsMenu", {
        name: "SETTINGS.AutoJournalIcon.regexSettingsN", label: "SETTINGS.AutoJournalIcon.regexSettingsL",      // The text label used in the button
        hint: "SETTINGS.AutoJournalIcon.regexSettingsH", icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
        type: regexSettingsMenu,   // A FormApplication subclass
        restricted: true                   // Restrict this submenu to game master only?
    });

    game.settings.register('journal-icon-numbers', "folderIcon", {
        name: "SETTINGS.AutoJournalIcon.folderIconN",
        hint: "SETTINGS.AutoJournalIcon.folderIconH",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });


    game.settings.register('journal-icon-numbers', "autoClose", {
        name: "SETTINGS.AutoJournalIcon.autoCloseN",
        hint: "SETTINGS.AutoJournalIcon.autoCloseH",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register('journal-icon-numbers', "autoPageImage", {
        name: "SETTINGS.AutoJournalIcon.autoPageImageN",
        hint: "SETTINGS.AutoJournalIcon.autoPageImageH",
        scope: "world",
        type: Boolean,
        default: false,
        config: game.release.generation !== 9 // Only supported in v10
    });

    game.settings.register('journal-icon-numbers', "uploadPath", {
        name: "SETTINGS.AutoJournalIcon.uploadPathN",
        hint: "SETTINGS.AutoJournalIcon.uploadPathH",
        scope: "world",
        type: String,
        default: "upload/journal-icon-numbers",
        config: true,
    });

    game.settings.register('journal-icon-numbers', "fontFamily", {type: String, default: "", scope: "world"});

    game.settings.register('journal-icon-numbers', "fontBold", {type: Boolean, default: false, scope: "world"});
    game.settings.register('journal-icon-numbers', "fontItalics", {type: Boolean, default: false, scope: "world"});
    game.settings.register('journal-icon-numbers', "iconType", {type: String, default: "circle", scope: "world"});
    game.settings.register('journal-icon-numbers', "iconScale", {type: Number, default: 0.75, scope: "world"});
    game.settings.register('journal-icon-numbers', "strokeWidth", {type: Number, default: 10, scope: "world"});
    game.settings.register('journal-icon-numbers', "iconFontSize", {type: Number, default: 200, scope: "world"});
    game.settings.register('journal-icon-numbers', "fontSize", {type: Number, default: 48, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_alpha_num", {type: Boolean, default: true, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_num_alpha", {type: Boolean, default: true, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_num", {type: Boolean, default: true, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_alpha_space", {type: Boolean, default: false, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_alpha_dot", {type: Boolean, default: false, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_num_dot", {type: Boolean, default: false, scope: "world"});
    game.settings.register('journal-icon-numbers', "reg_custom", {type: String, default: "", scope: "world"});

    game.settings.register('journal-icon-numbers', "foreColor", {type: String, default: "#000000ff", scope: "world"});
    game.settings.register('journal-icon-numbers', "backColor", {type: String, default: "#ffffff56", scope: "world"});

    game.settings.register('journal-icon-numbers', "cleanupLegacy", {
        name: "SETTINGS.AutoJournalIcon.rebuildN",
        hint: "SETTINGS.AutoJournalIcon.rebuildH",
        scope: "world",
        type: String,
        default: "no",
        choices: {
            no: game.i18n.format("AutoJournalIcon.no_rebuild"),
            partial: game.i18n.format("AutoJournalIcon.partial_rebuild"),
            full: game.i18n.format("AutoJournalIcon.full_rebuild")
        },
        config: true,
        onChange: (value) => {
            cleanup_legacy_icons(value)
        }        // A callback function which triggers when the setting is changed
    });
}

