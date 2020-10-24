import { getMakeIcon, getSvgString } from './icon_lib.js';


const LOG_PREFIX = ["%cAuto Journal Icon Numbers%c - LOG -", 'background: #bada55; color: #222','']
const DEBUG_PREFIX = ["%cAuto Journal Icon Numbers%c - DEBUG -", 'background: #FF9900; color: #222','']
const ERROR_PREFIX = ["%cAuto Journal Icon Numbers%c - ERROR -", 'background: #bada55; color: #FF0000','']


function getIconTypes() {
    return  {
            hexh: game.i18n.format("AutoJournalIcon.HexagonH"),
            hexv: game.i18n.format("AutoJournalIcon.HexagonV"),
            diamond: game.i18n.format("AutoJournalIcon.Diamond"),
            square: game.i18n.format("AutoJournalIcon.Square"),
            circle: game.i18n.format("AutoJournalIcon.Circle"),
            none: game.i18n.format("AutoJournalIcon.None"),
        };
    }
function getFontNames(){
    return ["","Abel","ABeeZee","Abhaya Libre","Abril Fatface","Aclonica","Acme","Actor","Adamina","Advent Pro","Aguafina Script","Akronim","Aladin","Alata","Alatsi","Aldrich","Alef","Alegreya Sans SC","Alegreya Sans","Alegreya SC","Alegreya","Aleo","Alex Brush","Alfa Slab One","Alice","Alike Angular","Alike","Allan","Allerta Stencil","Allerta","Allura","Almarai","Almendra Display","Almendra SC","Almendra","Amarante","Amaranth","Amatic SC","Amethysta","Amiko","Amiri","Amita","Anaheim","Andada","Andika","Angkor","Annie Use Your Telescope","Anonymous Pro","Antic Didone","Antic Slab","Antic","Anton","Arapey","Arbutus Slab","Arbutus","Architects Daughter","Archivo Black","Archivo Narrow","Archivo","Aref Ruqaa","Arima Madurai","Arimo","Arizonia","Armata","Arsenal","Artifika","Arvo","Arya","Asap Condensed","Asap","Asar","Asset","Assistant","Astloch","Asul","Athiti","Atma","Atomic Age","Aubrey","Audiowide","Autour One","Average Sans","Average","Averia Gruesa Libre","Averia Libre","Averia Sans Libre","Averia Serif Libre","B612 Mono","B612","Bad Script","Bahiana","Bahianita","Bai Jamjuree","Baloo 2","Baloo Bhai 2","Baloo Bhaina 2","Baloo Chettan 2","Baloo Da 2","Baloo Paaji 2","Baloo Tamma 2","Baloo Tammudu 2","Baloo Thambi 2","Balsamiq Sans","Balthazar","Bangers","Barlow Condensed","Barlow Semi Condensed","Barlow","Barriecito","Barrio","Basic","Baskervville","Battambang","Baumans","Bayon","Be Vietnam","Bebas Neue","Belgrano","Bellefair","Belleza","Bellota Text","Bellota","BenchNine","Bentham","Berkshire Swash","Beth Ellen","Bevan","Big Shoulders Display","Big Shoulders Text","Bigelow Rules","Bigshot One","Bilbo Swash Caps","Bilbo","BioRhyme Expanded","BioRhyme","Biryani","Bitter","Black And White Picture","Black Han Sans","Black Ops One","Blinker","Bokor","Bonbon","Boogaloo","Bowlby One SC","Bowlby One","Brawler","Bree Serif","Bubblegum Sans","Bubbler One","Buda","Buenard","Bungee Hairline","Bungee Inline","Bungee Outline","Bungee Shade","Bungee","Butcherman","Butterfly Kids","Cabin Condensed","Cabin Sketch","Cabin","Caesar Dressing","Cagliostro","Cairo","Caladea","Calistoga","Calligraffitti","Cambay","Cambo","Candal","Cantarell","Cantata One","Cantora One","Capriola","Cardo","Carme","Carrois Gothic SC","Carrois Gothic","Carter One","Catamaran","Caudex","Caveat Brush","Caveat","Cedarville Cursive","Ceviche One","Chakra Petch","Changa One","Changa","Chango","Charm","Charmonman","Chathura","Chau Philomene One","Chela One","Chelsea Market","Chenla","Cherry Cream Soda","Cherry Swash","Chewy","Chicle","Chilanka","Chivo","Chonburi","Cinzel Decorative","Cinzel","Clicker Script","Coda Caption","Coda","Codystar","Coiny","Combo","Comfortaa","Comic Neue","Coming Soon","Commissioner","Concert One","Condiment","Content","Contrail One","Convergence","Cookie","Copse","Corben","Cormorant Garamond","Cormorant Infant","Cormorant SC","Cormorant Unicase","Cormorant Upright","Cormorant","Courgette","Courier Prime","Cousine","Coustard","Covered By Your Grace","Crafty Girls","Creepster","Crete Round","Crimson Pro","Crimson Text","Croissant One","Crushed","Cuprum","Cute Font","Cutive Mono","Cutive","Damion","Dancing Script","Dangrek","Darker Grotesque","David Libre","Dawning of a New Day","Days One","Dekko","Delius Swash Caps","Delius Unicase","Delius","Della Respira","Denk One","Devonshire","Dhurjati","Didact Gothic","Diplomata SC","Diplomata","DM Mono","DM Sans","DM Serif Display","DM Serif Text","Do Hyeon","Dokdo","Domine","Donegal One","Doppio One","Dorsa","Dosis","Dr Sugiyama","Duru Sans","Dynalight","Eagle Lake","East Sea Dokdo","Eater","EB Garamond","Economica","Eczar","El Messiri","Electrolize","Elsie Swash Caps","Elsie","Emblema One","Emilys Candy","Encode Sans Condensed","Encode Sans Expanded","Encode Sans Semi Condensed","Encode Sans Semi Expanded","Encode Sans","Engagement","Englebert","Enriqueta","Epilogue","Erica One","Esteban","Euphoria Script","Ewert","Exo 2","Exo","Expletus Sans","Fahkwang","Fanwood Text","Farro","Farsan","Fascinate Inline","Fascinate","Faster One","Fasthand","Fauna One","Faustina","Federant","Federo","Felipa","Fenix","Finger Paint","Fira Code","Fira Mono","Fira Sans Condensed","Fira Sans Extra Condensed","Fira Sans","Fjalla One","Fjord One","Flamenco","Flavors","Fondamento","Fontdiner Swanky","Forum","Francois One","Frank Ruhl Libre","Freckle Face","Fredericka the Great","Fredoka One","Freehand","Fresca","Frijole","Fruktur","Fugaz One","Gabriela","Gaegu","Gafata","Galada","Galdeano","Galindo","Gamja Flower","Gayathri","Gelasio","Gentium Basic","Gentium Book Basic","Geo","Geostar Fill","Geostar","Germania One","GFS Didot","GFS Neohellenic","Gidugu","Gilda Display","Girassol","Give You Glory","Glass Antiqua","Glegoo","Gloria Hallelujah","Goblin One","Gochi Hand","Gorditas","Gothic A1","Gotu","Goudy Bookletter 1911","Graduate","Grand Hotel","Grandstander","Gravitas One","Great Vibes","Grenze Gotisch","Grenze","Griffy","Gruppo","Gudea","Gugi","Gupter","Gurajada","Habibi","Halant","Hammersmith One","Hanalei Fill","Hanalei","Handlee","Hanuman","Happy Monkey","Harmattan","Headland One","Heebo","Henny Penny","Hepta Slab","Herr Von Muellerhoff","Hi Melody","Hind Guntur","Hind Madurai","Hind Siliguri","Hind Vadodara","Hind","Holtwood One SC","Homemade Apple","Homenaje","Ibarra Real Nova","IBM Plex Mono","IBM Plex Sans Condensed","IBM Plex Sans","IBM Plex Serif","Iceberg","Iceland","IM Fell Double Pica SC","IM Fell Double Pica","IM Fell DW Pica SC","IM Fell DW Pica","IM Fell English SC","IM Fell English","IM Fell French Canon SC","IM Fell French Canon","IM Fell Great Primer SC","IM Fell Great Primer","Imprima","Inconsolata","Inder","Indie Flower","Inika","Inknut Antiqua","Inria Sans","Inria Serif","Inter","Irish Grover","Istok Web","Italiana","Italianno","Itim","Jacques Francois Shadow","Jacques Francois","Jaldi","Jim Nightshade","Jockey One","Jolly Lodger","Jomhuria","Jomolhari","Josefin Sans","Josefin Slab","Jost","Joti One","Jua","Judson","Julee","Julius Sans One","Junge","Jura","Just Another Hand","Just Me Again Down Here","K2D","Kadwa","Kalam","Kameron","Kanit","Kantumruy","Karla","Karma","Katibeh","Kaushan Script","Kavivanar","Kavoon","Kdam Thmor","Keania One","Kelly Slab","Kenia","Khand","Khmer","Khula","Kirang Haerang","Kite One","Knewave","Kodchasan","KoHo","Kosugi Maru","Kosugi","Kotta One","Koulen","Kranky","Kreon","Kristi","Krona One","Krub","Kufam","Kulim Park","Kumar One Outline","Kumar One","Kumbh Sans","Kurale","La Belle Aurore","Lacquer","Laila","Lakki Reddy","Lalezar","Lancelot","Lateef","Lato","League Script","Leckerli One","Ledger","Lekton","Lemon","Lemonada","Lexend Deca","Lexend Exa","Lexend Giga","Lexend Mega","Lexend Peta","Lexend Tera","Lexend Zetta","Libre Barcode 128 Text","Libre Barcode 128","Libre Barcode 39 Extended Text","Libre Barcode 39 Extended","Libre Barcode 39 Text","Libre Barcode 39","Libre Baskerville","Libre Caslon Display","Libre Caslon Text","Libre Franklin","Life Savers","Lilita One","Lily Script One","Limelight","Linden Hill","Literata","Liu Jian Mao Cao","Livvic","Lobster Two","Lobster","Londrina Outline","Londrina Shadow","Londrina Sketch","Londrina Solid","Long Cang","Lora","Love Ya Like A Sister","Loved by the King","Lovers Quarrel","Luckiest Guy","Lusitana","Lustria","M PLUS 1p","M PLUS Rounded 1c","Ma Shan Zheng","Macondo Swash Caps","Macondo","Mada","Magra","Maiden Orange","Maitree","Major Mono Display","Mako","Mali","Mallanna","Mandali","Manjari","Manrope","Mansalva","Manuale","Marcellus SC","Marcellus","Marck Script","Margarine","Markazi Text","Marko One","Marmelad","Martel Sans","Martel","Marvel","Mate SC","Mate","Maven Pro","McLaren","Meddon","MedievalSharp","Medula One","Meera Inimai","Megrim","Meie Script","Merienda One","Merienda","Merriweather Sans","Merriweather","Metal Mania","Metal","Metamorphous","Metrophobic","Michroma","Milonga","Miltonian Tattoo","Miltonian","Mina","Miniver","Miriam Libre","Mirza","Miss Fajardose","Mitr","Modak","Modern Antiqua","Mogra","Molengo","Molle","Monda","Monofett","Monoton","Monsieur La Doulaise","Montaga","Montez","Montserrat Alternates","Montserrat Subrayada","Montserrat","Moul","Moulpali","Mountains of Christmas","Mouse Memoirs","Mr Bedfort","Mr Dafoe","Mr De Haviland","Mrs Saint Delafield","Mrs Sheppards","Mukta Mahee","Mukta Malar","Mukta Vaani","Mukta","Mulish","MuseoModerno","Mystery Quest","Nanum Brush Script","Nanum Gothic Coding","Nanum Gothic","Nanum Myeongjo","Nanum Pen Script","Neucha","Neuton","New Rocker","News Cycle","Niconne","Niramit","Nixie One","Nobile","Nokora","Norican","Nosifer","Notable","Nothing You Could Do","Noticia Text","Noto Sans HK","Noto Sans JP","Noto Sans KR","Noto Sans SC","Noto Sans TC","Noto Sans","Noto Serif JP","Noto Serif KR","Noto Serif SC","Noto Serif TC","Noto Serif","Nova Cut","Nova Flat","Nova Mono","Nova Oval","Nova Round","Nova Script","Nova Slim","Nova Square","NTR","Numans","Nunito Sans","Nunito","Odibee Sans","Odor Mean Chey","Offside","Old Standard TT","Oldenburg","Oleo Script Swash Caps","Oleo Script","Open Sans Condensed","Open Sans","Oranienbaum","Orbitron","Oregano","Orienta","Original Surfer","Oswald","Over the Rainbow","Overlock SC","Overlock","Overpass Mono","Overpass","Ovo","Oxanium","Oxygen Mono","Oxygen","Pacifico","Padauk","Palanquin Dark","Palanquin","Pangolin","Paprika","Parisienne","Passero One","Passion One","Pathway Gothic One","Patrick Hand SC","Patrick Hand","Pattaya","Patua One","Pavanam","Paytone One","Peddana","Peralta","Permanent Marker","Petit Formal Script","Petrona","Philosopher","Piazzolla","Piedra","Pinyon Script","Pirata One","Plaster","Play","Playball","Playfair Display SC","Playfair Display","Podkova","Poiret One","Poller One","Poly","Pompiere","Pontano Sans","Poor Story","Poppins","Port Lligat Sans","Port Lligat Slab","Pragati Narrow","Prata","Preahvihear","Press Start 2P","Pridi","Princess Sofia","Prociono","Prompt","Prosto One","Proza Libre","PT Mono","PT Sans Caption","PT Sans Narrow","PT Sans","PT Serif Caption","PT Serif","Public Sans","Puritan","Purple Purse","Quando","Quantico","Quattrocento Sans","Quattrocento","Questrial","Quicksand","Quintessential","Qwigley","Racing Sans One","Radley","Rajdhani","Rakkas","Raleway Dots","Raleway","Ramabhadra","Ramaraja","Rambla","Rammetto One","Ranchers","Rancho","Ranga","Rasa","Rationale","Ravi Prakash","Recursive","Red Hat Display","Red Hat Text","Red Rose","Redressed","Reem Kufi","Reenie Beanie","Revalia","Rhodium Libre","Ribeye Marrow","Ribeye","Righteous","Risque","Roboto Condensed","Roboto Mono","Roboto Slab","Roboto","Rochester","Rock Salt","Rokkitt","Romanesco","Ropa Sans","Rosario","Rosarivo","Rouge Script","Rowdies","Rozha One","Rubik Mono One","Rubik","Ruda","Rufina","Ruge Boogie","Ruluko","Rum Raisin","Ruslan Display","Russo One","Ruthie","Rye","Sacramento","Sahitya","Sail","Saira Condensed","Saira Extra Condensed","Saira Semi Condensed","Saira Stencil One","Saira","Salsa","Sanchez","Sancreek","Sansita Swashed","Sansita","Sarabun","Sarala","Sarina","Sarpanch","Satisfy","Sawarabi Gothic","Sawarabi Mincho","Scada","Scheherazade","Schoolbell","Scope One","Seaweed Script","Secular One","Sedgwick Ave Display","Sedgwick Ave","Sen","Sevillana","Seymour One","Shadows Into Light Two","Shadows Into Light","Shanti","Share Tech Mono","Share Tech","Share","Shojumaru","Short Stack","Shrikhand","Siemreap","Sigmar One","Signika Negative","Signika","Simonetta","Single Day","Sintony","Sirin Stencil","Six Caps","Skranji","Slabo 13px","Slabo 27px","Slackey","Smokum","Smythe","Sniglet","Snippet","Snowburst One","Sofadi One","Sofia","Solway","Song Myung","Sonsie One","Sora","Sorts Mill Goudy","Source Code Pro","Source Sans Pro","Source Serif Pro","Space Mono","Spartan","Special Elite","Spectral SC","Spectral","Spicy Rice","Spinnaker","Spirax","Squada One","Sree Krushnadevaraya","Sriracha","Srisakdi","Staatliches","Stalemate","Stalinist One","Stardos Stencil","Stint Ultra Condensed","Stint Ultra Expanded","Stoke","Strait","Stylish","Sue Ellen Francisco","Suez One","Sulphur Point","Sumana","Sunflower","Sunshiney","Supermercado One","Sura","Suranna","Suravaram","Suwannaphum","Swanky and Moo Moo","Syncopate","Syne Mono","Syne Tactile","Syne","Tajawal","Tangerine","Taprom","Tauri","Taviraj","Teko","Telex","Tenali Ramakrishna","Tenor Sans","Text Me One","Thasadith","The Girl Next Door","Tienne","Tillana","Timmana","Tinos","Titan One","Titillium Web","Tomorrow","Trade Winds","Trirong","Trispace","Trocchi","Trochut","Trykker","Tulpen One","Turret Road","Ubuntu Condensed","Ubuntu Mono","Ubuntu","Ultra","Uncial Antiqua","Underdog","Unica One","UnifrakturCook","UnifrakturMaguntia","Unkempt","Unlock","Unna","Vampiro One","Varela Round","Varela","Varta","Vast Shadow","Vesper Libre","Viaoda Libre","Vibes","Vibur","Vidaloka","Viga","Voces","Volkhov","Vollkorn SC","Vollkorn","Voltaire","VT323","Waiting for the Sunrise","Wallpoet","Walter Turncoat","Warnes","Wellfleet","Wendy One","Wire One","Work Sans","Yanone Kaffeesatz","Yantramanav","Yatra One","Yellowtail","Yeon Sung","Yeseva One","Yesteryear","Yrsa","ZCOOL KuaiLe","ZCOOL QingKe HuangYou","ZCOOL XiaoWei","Zeyada","Zhi Mang Xing","Zilla Slab Highlight","Zilla Slab"]
}

function setPropertyOnce(object, property, value){
    if (hasProperty(object,property)) return
    setProperty(object,property,value)
}

function initliazeData(note){
    // Init the data.  This is outside the above block so that I can add new flags easily
    const label_source = (note.text != undefined && note.text.length >=1) ? note.text : game.journal.get(note.entryId).data.name; // TODO entryName
    var matches = label_source.match(/^\d{1,2}[a-zA-Z]?|^[a-zA-Z]\d{1,2}/)
    setPropertyOnce(note,"flags.autoIconFlags.autoIcon",!!matches)
    setPropertyOnce(note,"flags.autoIconFlags.iconText",matches?matches[0]:"")
    setPropertyOnce(note,"flags.autoIconFlags.iconType",game.settings.get('journal-icon-numbers', "iconType"))
    setPropertyOnce(note,"flags.autoIconFlags.foreColor",game.settings.get('journal-icon-numbers', "foreColor"))
    setPropertyOnce(note,"flags.autoIconFlags.backColor",game.settings.get('journal-icon-numbers', "backColor"))
    setPropertyOnce(note,"flags.autoIconFlags.fontFamily",game.settings.get('journal-icon-numbers', "fontFamily"))
    setPropertyOnce(note,"flags.autoIconFlags.loopDetector",0)

}

async function renderNoteConfig(app, html, data) {
         
    if (!hasProperty(data,"_id")) // Only force the size once, so that user can override it.
        data.object.iconSize = Math.round(game.scenes.viewed.data.grid * game.settings.get('journal-icon-numbers', "iconScale"));
    
    initliazeData(data.object) // Set all my flags
            
    html[0].style.height = "" //Dynamic height. Especially usefull for the new color picker
    html[0].style.top = "100px"; // shift the window up to make room

    var templateName = "modules/journal-icon-numbers/template_newColor.html"
    var new_html = await renderTemplate(templateName,{iconTypes:getIconTypes(),fontTypes:getFontNames(),flags:data.object.flags})
    

    
    html.find('button[name="submit"]').before(new_html);
    await svgWrapper(html)
    
    console.log(html.find('div[name="sample-icon"]')[0])
    
    html.find('input[name="flags.autoIconFlags.iconText"]').each((i,x)=>x.addEventListener('input', ()=>{svgWrapper(html)}))
    html.find('select[name="flags.autoIconFlags.iconType"]').each((i,x)=>x.addEventListener('change',()=>{svgWrapper(html)}))
    html.find('select[name="flags.autoIconFlags.fontFamily"]').each((i,x)=>x.addEventListener('change',()=>{svgWrapper(html)}))
    html.find('input[name="flags.autoIconFlags.autoIcon"]').each((i,x)=>x.addEventListener('change',()=>{svgWrapper(html)}))
    html.find('[name="icon"]').each((i,x)=>x.addEventListener('change',()=>{svgWrapper(html)}))
    
    // This is a work around for VTTA smashing the iconSize
    // This will keep it where it is set (since this module loads in after VTTA)
    $('input[name="iconSize"]').val(data.object.iconSize);
}

async function svgWrapper(html) {

    if (html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked)
    {
        const flags = {
            autoIcon: html.find('input[name="flags.autoIconFlags.autoIcon"]')[0].checked,
            iconType: html.find('select[name="flags.autoIconFlags.iconType"]').val(),
            iconText: html.find('input[name="flags.autoIconFlags.iconText"]').val(),
            foreColor:html.find('input[name="flags.autoIconFlags.foreColor"]').val(),
            backColor:html.find('input[name="flags.autoIconFlags.backColor"]').val(),
            fontFamily: html.find('select[name="flags.autoIconFlags.fontFamily"]').val()

        }
        getSvgString(flags).then(v=> html.find('div[name="sample-icon"]')[0].innerHTML = v)  
        console.debug(...DEBUG_PREFIX,"DONE")
    }   
    else
        html.find('div[name="sample-icon"]')[0].innerHTML = `<img height=128 width=128 style="border: 0;" src="${html.find('[name="icon"]').val()}">`
    
}

Hooks.on("renderNoteConfig", renderNoteConfig); 
Hooks.on("updateNote", updateNote) 
Hooks.on("createNote", updateNote) 
 

Hooks.once("init", registerSettings);


async function updateNote(scene,note,changes) {  
    
    // Not using autoIcon for this icon, so quit
    if (!getProperty(note.flags,'autoIconFlags.autoIcon')) return true
    
    // If icon changes, and loopDetector does, that means we're in a loop caused 
    // by the update at the end of this function
    if (hasProperty(changes,'flags.autoIconFlags.loopDetector')){
        console.debug(...DEBUG_PREFIX,"LOOP DETECTOR!!!")
        return
    }
    
    // Nothing important changed, quit early
    console.debug(...DEBUG_PREFIX,changes)
    if (!('renderSheet' in changes || hasProperty(changes,'flags.autoIconFlags'))) {
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
    scene.updateEmbeddedEntity("Note",new_note) //TODO: try 0.7.5 recursive:false here
};


async function cleanup_legacy_icons(value) {
    // Rebuild all icons - either legacy pre 1.0.4 fixed paths, or current modern paths
    // This is good to call if the images get deleted, or you are migrating locations

    // This function only fires onChange, and the setting is always false in game.
    // If this function is passed false, do nothing
    // If true, reset to false, and do the magic
    if (!value) return 
    game.settings.set('journal-icon-numbers',"cleanupLegacy",false)

    console.debug(...DEBUG_PREFIX,"Legacy Cleanup")
    
    for (var scene of game.scenes.entities) {
        let changes = false
        var new_data = [];
        for (const note of scene.data.notes) {
            var new_note = JSON.parse(JSON.stringify(note));  // Ugly way of cloning
             
            initliazeData(new_note)
            if (new_note.flags.autoIconFlags.autoIcon) {
                var iconFilePath = await getMakeIcon(new_note.flags.autoIconFlags)
                if (note.icon !== iconFilePath){
                    console.log(...LOG_PREFIX,"Replacing old path " + note.icon + " with " + iconFilePath);
                    new_note.icon = iconFilePath;
                    changes = true
                }
            }
            new_data.push(new_note)
        }
        
        if (changes) // Only trigger scene update if we have changes
            scene.update({notes: new_data})  
    }   
    window.location.reload()
}



function registerSettings() {

    game.settings.register('journal-icon-numbers', "fontFamily", {
        name: "SETTINGS.AutoJournalIcon.fontFamilyN",
        hint: "SETTINGS.AutoJournalIcon.fontFamilyH",
        scope: "world",
        type: String,
        choices: getFontNames(),
        default: "",
        config: true
    });
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
        defaultColor: "#ffffff6f",     // The default color of the setting
        scope: "world",               // The scope of the setting
        onChange: (value) => {}        // A callback function which triggers when the setting is changed
    })

    game.settings.register('journal-icon-numbers',"cleanupLegacy", {
        name: "Rebuild all icons",
        hint: "SETTINGS.AutoJournalIcon.iconScaleH",
        scope: "world",
        type: Boolean,
        default: false,
        config: true,
        onChange: (value) => {cleanup_legacy_icons(value)}        // A callback function which triggers when the setting is changed
    });

}
