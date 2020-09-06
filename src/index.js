
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
    for (const number of numbers) {
        for (const letter of letters) {
            const label = number + letter;
            yield label;
        }
    }
    
    // Letter + Number ordering
    for (const letter of letters) {
        for (const number of numbers) {
            const label = letter + number;
            yield label;
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
        for (const label of label_itr()) {
            const iconFilename = `modules/journal-icon-numbers/icons/${label}.svg`;
            if (idx === label) {
               
                // Iterator returns >10K entries, so only display ones that match this label
                $('select[name="icon"]', html).append(`<option value="${iconFilename}" selected>${label}</option>`);
                $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
                return;
            }
        }        
    }  
}



Hooks.once("ready", function() {
  Hooks.on("renderNoteConfig", renderNoteConfig);

});





