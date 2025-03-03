import { betterLogger } from "./better_logger.js";
import {fontData, getIconTypes,svgWrapper,regTester} from "./index.js"
import {getSvgString} from "./icon_lib.js"

export class MySubmenuApplicationClass extends FormApplication {
    // lots of other things...
    constructor(object, options = {}) {
        super(object, options);
    }
    
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'journal-icon-numbers-settings-form',
            title: 'Auto Journal Icon Numbers - Global Settings',
            template: 'modules/journal-icon-numbers/templates/template_globalSettings.html',
            // classes: ['sheet', 'tm-settings'],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData(options={}) {
        return get_all_settings()

    }
    activateListeners(html) {
        super.activateListeners(html);
        svgWrapper().then()

        // Add listeners for auto updating icon
        $('[name^="flags.journal-icon-numbers"]').each((i, x) => x.addEventListener('input', () => { svgWrapper().then() }))
        $('[name^="flags.journal-icon-numbers"]').each((i, x) => x.addEventListener('change', () => { svgWrapper().then() }))
        $('[name^="flags.journal-icon-numbers"]').each((i, x) => x.addEventListener('focusout', () => { svgWrapper().then() }))
    
        //Hook on standard icon changes to detect that (works with pincushion too)
        $('[name="icon"]').each((i, x) => x.addEventListener('change', () => { svgWrapper().then() }))
    }
    async _updateObject(event, formData) {
      const data = foundry.utils.expandObject(formData);
      set_settings(data.flags['journal-icon-numbers'])
    }
  }


  export class regexSettingsMenu extends FormApplication {
    // lots of other things...
    constructor(object, options = {}) {
        super(object, options);
    }
    
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'journal-icon-numbers-settings-form',
            title: 'Auto Journal Icon Numbers - Regex Settings',
            template: 'modules/journal-icon-numbers/templates/template_regexSettings.html',
            // classes: ['sheet', 'tm-settings'],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData(options={}) {
        return get_all_settings() 
    }
    activateListeners(html) {
        super.activateListeners(html);

        // Add listeners for auto updating icon
        this._testRegex()
        $('input').each((i, x) => x.addEventListener('change', () => {this._testRegex() }))

    }
    async _updateObject(event, formData) {
      const data = foundry.utils.expandObject(formData);
      set_settings(data.flags['journal-icon-numbers'])
    }

    _testRegex(){
        let flags = {
            reg_alpha_num: $('input[name="flags.journal-icon-numbers.reg_alpha_num"]')[0].checked,
            reg_num_alpha: $('input[name="flags.journal-icon-numbers.reg_num_alpha"]')[0].checked,
            reg_num: $('input[name="flags.journal-icon-numbers.reg_num"]')[0].checked,
            reg_alpha_space: $('input[name="flags.journal-icon-numbers.reg_alpha_space"]')[0].checked,
            reg_alpha_dot: $('input[name="flags.journal-icon-numbers.reg_alpha_dot"]')[0].checked,
            reg_num_dot: $('input[name="flags.journal-icon-numbers.reg_num_dot"]')[0].checked,
            reg_custom: $('input[name="flags.journal-icon-numbers.reg_custom"]').val(),
            sampleText: $('input[name="flags.journal-icon-numbers.sampleText"]').val() ,
        }


        const label_source = flags.sampleText
        let reg_list = []

        if (flags.reg_num_alpha){
            reg_list.push(/^\d{1,3}[a-zA-Z]/)
        }
        
        if (flags.reg_alpha_num){
            reg_list.push(/^[a-zA-Z]\d{1,3}/)
        }
        
        if (flags.reg_num){
            reg_list.push(/^\d{1,4}/)
        }
        
        if (flags.reg_alpha_space){
            reg_list.push(/^([a-zA-Z]) /)
        }
        if (flags.reg_alpha_dot){
            reg_list.push(/^([a-zA-Z])\./)
        }
        if (flags.reg_num_dot) reg_list.push(/^\d{1,4}\./)
        if (flags.reg_custom){
            reg_list.push(RegExp(flags.reg_custom))
        }
        
        betterLogger.debug("Label to test",label_source)
        const result = regTester(label_source,reg_list)
        betterLogger.debug("Result",result)


        betterLogger.debug("Test Regex",flags)
        betterLogger.debug($('[name="flags.journal-icon-numbers.result"]'))

        if(result) {
            flags = get_all_settings()
            flags['iconText'] = result
            getSvgString(flags).then(v => $('div[name="sample-icon"]')[0].innerHTML = v)
        }
        else {
            // noinspection HtmlUnknownTarget
            $('div[name="sample-icon"]')[0].innerHTML = `<img alt="Example Icon" height=128 width=128 style="border: 0;" src="icons/svg/anchor.svg">`
        }
    }
  }

const settings = ["reg_custom","reg_alpha_dot","reg_num_dot","reg_alpha_space","reg_num","reg_num_alpha","reg_alpha_num","iconScale","iconFontSize","fontSize","fontItalics","fontBold","fontFamily","backColor","foreColor","iconType","strokeWidth"]
export function set_settings(data) {
    
    for (const [key, value] of Object.entries(data)) {
        if (settings.includes(key)){
            game.settings.set('journal-icon-numbers', key, value).then()
        }
    }
}

export function get_all_settings() {

    let data = {
        iconTypes:   getIconTypes(),
        fontTypes:   Object.assign({}, ...Object.keys(fontData).map((x) => ({[x]: x})))
    }

    for (const x of settings) {
        data[x] = game.settings.get('journal-icon-numbers', x)
    }
    return data
}