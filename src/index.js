
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
                // TODO Add config for save path (And maybe code for s3?)
                const iconFilepath = `upload/journal-icon-numbers/${iconFilename}`;
                yield [label,iconFilepath,iconFilename];
            }
        }
    }
}

function renderNoteConfig(app, html, data) {
    // user-placed map note
    const label_source = (data.object.text != undefined && data.object.text.length >=1) ? data.object.text : data.entryName;
    const idx1 = label_source.length >= 1 ? label_source.substr(0, 1) : "";
    const idx2 = label_source.length >= 2 ? label_source.substr(0, 2) : "";
    const idx3 = label_source.length >= 3 ? label_source.substr(0, 3) : "";
    
    
    for (const idx of [idx3, idx2, idx1]) {
        for (const [label,iconFilepath,iconFilename] of label_itr()) {
            
            if (idx === label) {
                console.debug("Auto-Journal-Icon",label,iconFilename);
                // Iterator returns >10K entries, so only display ones that match this label

                const iconType = game.settings.get('journal-icon-numbers', "iconType");
                
                // Fix for Pin Cushion, which uses a file picker instead of the dropdown
                $('input.icon-path[name="icon"]').val(iconFilepath);
                
                // Add item to selector
                $('select[name="icon"]', html).append(`<option value=${iconFilepath} selected>${label}</option>`);
                
                // TODO Add config for this size override
                $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
                
                
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
                
                let file = new File([typeString  + label + '</text></g></svg>'], iconFilename, { type: data.type });
                
                
                const result = FilePicker.upload("data", "upload/journal-icon-numbers", file, {  });
                // TODO Error checking 
               
                return;
            }
        }        
    }  
}


// Add the hook in ready() to ensure it goes after other conflicting modules 
// Need to figure out a better way to do this

Hooks.once("ready", function() {
    makeDirs();
    Hooks.on("renderNoteConfig", renderNoteConfig);
});

async function makeDirs() {
  // TODO add checks here to see dirs already exist
  FilePicker.createDirectory("data","upload/journal-icon-numbers",{});
};

/**
 * Hook on init
 */
Hooks.on("init", () => {
    registerSettings();
});

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
        default: "white_circle_black_font",
        config: true,
        onChange: s => {}
    });
}

