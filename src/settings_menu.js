import { betterLogger } from "./better_logger.js";
import {fontData, getIconTypes,svgWrapper,regTester} from "./index.js"
import {getSvgString} from "./icon_lib.js"

export class MySubmenuApplicationClass extends FormApplication {
    // lots of other things...
    constructor(object, options = {}) {
        super(object, options);
    }
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'ajin-settings-form',
            title: 'Auto Journal Icon Numbers - Global Settings',
            template: 'modules/journal-icon-numbers/templates/template_globalSettings.html',
            // classes: ['sheet', 'tm-settings'],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData() {
        return get_all_settings()

    }
    activateListeners(html) {
        super.activateListeners(html);
        svgWrapper(html)

        // Add listeners for auto updating icon
        html.find('[name^="flags.autoIconFlags"]').each((i, x) => x.addEventListener('input', () => { svgWrapper(html) }))
        html.find('[name^="flags.autoIconFlags"]').each((i, x) => x.addEventListener('change', () => { svgWrapper(html) }))
        html.find('[name^="flags.autoIconFlags"]').each((i, x) => x.addEventListener('focusout', () => { svgWrapper(html) }))
    
        //Hook on standard icon changes to detect that (works with pincushion too)
        html.find('[name="icon"]').each((i, x) => x.addEventListener('change', () => { svgWrapper(html) }))
    }
    _updateObject(event, formData) {
      const data = expandObject(formData);
      set_settings(data.flags.autoIconFlags)
    }
  }


  export class regexSettingsMenu extends FormApplication {
    // lots of other things...
    constructor(object, options = {}) {
        super(object, options);
    }
    
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'ajin-settings-form',
            title: 'Auto Journal Icon Numbers - Regex Settings',
            template: 'modules/journal-icon-numbers/templates/template_regexSettings.html',
            // classes: ['sheet', 'tm-settings'],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData() {
        return get_all_settings() 
    }
    activateListeners(html) {
        super.activateListeners(html);

        // Add listeners for auto updating icon
        this._testRegex(html)
        html.find('input').each((i, x) => x.addEventListener('change', () => {this._testRegex(html) }))

    }
    _updateObject(event, formData) {
      const data = expandObject(formData);
      set_settings(data.flags.autoIconFlags)     
    }

    _testRegex(html){  
        var flags = {
            reg_alpha_num: html.find('input[name="flags.autoIconFlags.reg_alpha_num"]')[0].checked,
            reg_num_alpha: html.find('input[name="flags.autoIconFlags.reg_num_alpha"]')[0].checked,
            reg_num: html.find('input[name="flags.autoIconFlags.reg_num"]')[0].checked,
            reg_alpha_space: html.find('input[name="flags.autoIconFlags.reg_alpha_space"]')[0].checked,
            reg_alpha_dot: html.find('input[name="flags.autoIconFlags.reg_alpha_dot"]')[0].checked,
            reg_custom: html.find('input[name="flags.autoIconFlags.reg_custom"]').val(),
            sampleText: html.find('input[name="flags.autoIconFlags.sampleText"]').val() ,
        }


        var label_source = flags.sampleText
        var reg_list = []

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
        if (flags.reg_custom){
            reg_list.push(RegExp(flags.reg_custom))
        }
        
        betterLogger.debug("Label to test",label_source)
        var result = regTester(label_source,reg_list)
        betterLogger.debug("Result",result)


        betterLogger.debug("Test Regex",flags)
        betterLogger.debug(html.find('[name="flags.autoIconFlags.result"]'))

        if(result) {
            flags = get_all_settings()
            flags['iconText'] = result
            getSvgString(flags).then(v => html.find('div[name="sample-icon"]')[0].innerHTML = v)
        }
        else {
            html.find('div[name="sample-icon"]')[0].innerHTML = `<img height=128 width=128 style="border: 0;" src="icons/svg/anchor.svg">`
        }
    }
  }

var settings = ["reg_custom","reg_alpha_dot","reg_alpha_space","reg_num","reg_num_alpha","reg_alpha_num","iconScale","iconFontSize","fontSize","fontItalics","fontBold","fontFamily","backColor","foreColor","iconType","strokeWidth"]
export function set_settings(data) {
    
    for (const [key, value] of Object.entries(data)) {
        if (settings.includes(key)){
            game.settings.set('journal-icon-numbers', key, value);
        }
    }
}

export function get_all_settings() {

    var data = {
        iconTypes:   getIconTypes(),
        fontTypes:   Object.keys(fontData),
    }

    for (const x of settings) {
        data[x] = game.settings.get('journal-icon-numbers', x)
    }
    return data
}