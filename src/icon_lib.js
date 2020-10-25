const LOG_PREFIX = ["%cAuto Journal Icon Numbers%c - LOG -", 'background: #bada55; color: #222', '']
const DEBUG_PREFIX = ["%cAuto Journal Icon Numbers%c - DEBUG -", 'background: #FF9900; color: #222', '']
const ERROR_PREFIX = ["%cAuto Journal Icon Numbers%c - ERROR -", 'background: #bada55; color: #FF0000', '']

function commonStyle(fill, stroke, stroke_width) {
  return `style="fill:${fill};stroke:${stroke};stroke-width:${stroke_width};stroke-miterlimit:10;"`
}

function templateCircle(fill, stroke, stroke_width = 10) {
  let x = 256
  let y = 256
  let r = (512 - stroke_width) / 2
  return `<circle ${commonStyle(fill, stroke, stroke_width)} cx="${x}" cy="${y}" r="${r}" />`
}
function templateSquare(fill, stroke, stroke_width = 10) {
  let x = stroke_width / 2
  let y = stroke_width / 2
  let width = 512 - stroke_width
  let height = 512 - stroke_width

  return `<rect ${commonStyle(fill, stroke, stroke_width)} x="${x}" y="${y}" height="${height}" width="${width}"/>`
}
function templateDiamond(fill, stroke, stroke_width = 10) {
  let radius = 20
  let x = -.4 * radius + stroke_width / 2
  let y = 512 / 2
  let height = (512 - stroke_width) / 1.4 + 0.4 * radius
  let width = (512 - stroke_width) / 1.4 + 0.4 * radius
  return `<rect ${commonStyle(fill, stroke, stroke_width)} x="0" y="0" height="${height}" width="${width}" ry="${radius}" transform="translate(${y},${x}) rotate(45)" />`

}

function templateHexH(fill, stroke, stroke_width = 10) {
  let r = (512 - stroke_width) / 2
  let x1 = 0 + .27 * r / 2
  let x2 = 1.73 * r / 2 + .27 * r / 2
  let x3 = 1.73 * r + .27 * r / 2

  let y0 = 0
  let y1 = r / 2
  let y2 = 3 * r / 2
  let y3 = 4 * r / 2

  return `<polyline ${commonStyle(fill, stroke, stroke_width)} points="${x2},${y0} ${x3},${y1} ${x3},${y2} ${x2},${y3} ${x1},${y2} ${x1},${y1} ${x2},${y0}" />`
}
function templateHexV(fill, stroke, stroke_width = 10) {
  let r = (512 - stroke_width) / 2
  let x1 = 0 + .27 * r / 2
  let x2 = 1.73 * r / 2 + .27 * r / 2
  let x3 = 1.73 * r + .27 * r / 2

  let y0 = 0
  let y1 = r / 2
  let y2 = 3 * r / 2
  let y3 = 4 * r / 2
  return `<polyline ${commonStyle(fill, stroke, stroke_width)} points="${y0},${x2} ${y1},${x3} ${y2},${x3} ${y3},${x2} ${y2},${x1} ${y1},${x1} ${y0},${x2}" />`
}

const stock_font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
function templateText(color, label, fontFamily) {
  if (fontFamily === "") fontFamily = stock_font
  return `<text font-family='${fontFamily}' font-size="200" font-weight="400"  x="50%" y="50%" text-anchor="middle" fill="${color}" stroke="${color}" dy=".3em">${label}</text></g></svg>`
}
function svgTemplate() {
  return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" width="128" height="128"><g>';
}

function fetchCSS(url) {
  return fetch(url).then(function (res) {
    return res.text()
  }, errorHandler)
}


function embedFonts(cssText) {
  var fontLocations = cssText.match(/https:\/\/[^)]+/g)
  var fontLoadedPromises = fontLocations.map(function (location) {
    return new Promise(function (resolve, reject) {
      fetch(location).then(function (res) {
        return res.blob()
      }).then(function (blob) {
        var reader = new FileReader()
        reader.addEventListener('load', function () {
          // Side Effect
          cssText = cssText.replace(location, this.result)
          resolve([location, this.result])
        })
        reader.readAsDataURL(blob)
      }).catch(reject)
    })
  })
  return Promise.all(fontLoadedPromises).then(function () {
    return cssText
  })
}



function errorHandler(e) {
  console.info('ERR', e)
}

async function getEmbeddedFont(fontFamily, label) {

  if (fontFamily === "") return ""
  let fontCSS = '<defs><style type="text/css">'
  // Get just the characters needed to save space
  fontCSS += await fetchCSS(`https://fonts.googleapis.com/icon?family=${fontFamily}&text=${label}`).then(embedFonts).catch(errorHandler)
  fontCSS += '</style></defs>'
  return fontCSS
}

String.prototype.hashCode = function () {
  var hash = 4325, i = this.length
  while (i)
    hash = (hash * 43) ^ this.charCodeAt(--i)
  return (hash >>> 0).toString(16);
}


export async function getSvgString(flags) {

  var svgString = svgTemplate()

  svgString += await getEmbeddedFont(flags.fontFamily, flags.iconText)

  let backFunction = () => { }  // Default case

  if (flags.iconType == "square") backFunction = templateSquare
  if (flags.iconType == "diamond") backFunction = templateDiamond
  if (flags.iconType == "circle") backFunction = templateCircle
  if (flags.iconType == "hexh") backFunction = templateHexH
  if (flags.iconType == "hexv") backFunction = templateHexV

  svgString += backFunction(flags.backColor, flags.foreColor, flags.strokeWidth)
  svgString += templateText(flags.foreColor, flags.iconText, flags.fontFamily);
  return svgString
}

export async function getMakeIcon(flags) {

  var svgString = await getSvgString(flags)

  // user-placed map note
  if (!flags.autoIcon) { return null }

  // Shorten the name, as well as cover for non-case sensitive host OS's (like Windows)
  // Keep iconText in here as well as in the file name for clarity and to (hopefully) minimize collisions.
  var iconFilename = `${JSON.stringify(flags).hashCode()}_${flags.iconText}.svg`;

  console.debug(...DEBUG_PREFIX, "Making", flags.iconText, iconFilename);

  let file = new File([svgString], iconFilename, {});
  var uploadPath = game.settings.get('journal-icon-numbers', "uploadPath")
  var full_path = uploadPath + "/" + iconFilename

  var dest = typeof ForgeVTT === "undefined" ? "data" : "forgevtt"
  var existing = await FilePicker.browse(dest, uploadPath).catch((error) => { if (!error.includes("does not exist")) console.error(...ERROR_PREFIX, error) })
  console.log(existing)
  if (existing == undefined || existing.target != uploadPath) { // Directory not found above
    await makeDirs(dest, uploadPath)
  }
  else if (existing.files.includes(full_path)) {
    return full_path
  }

  var result = await FilePicker.upload(dest, uploadPath, file, {});
  return result.path;

}


async function makeDirs(dest, full_path) {
  console.debug(...DEBUG_PREFIX, "Creating dirs");

  var base_path = ""
  for (var path of full_path.split("/")) {
    base_path += path + "/"
    await FilePicker.createDirectory(dest, base_path, {}).then((result) => {
      console.log(...LOG_PREFIX, "Created " + base_path);
    })
      .catch((error) => {
        if (!error.includes("EEXIST")) {
          console.error(...ERROR_PREFIX, error);
        }
      });
  }
};
