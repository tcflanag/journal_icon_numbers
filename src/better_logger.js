const name  = 'journal-icon-numbers'

export var betterLogger = {}

function setLogger() {
  let version = ""
  let title = name
  if (foundry.utils.hasProperty(game, 'modules')) {
    // noinspection JSUnresolvedVariable
    version = game.modules.get(name).version??game.modules.get(name).data.version
    // noinspection JSUnresolvedVariable
    title = game.modules.get(name).title??game.modules.get(name).data.title
    
  }
  const LOG_PREFIX = ["%c" + title + "%c " + version + " - LOG -", 'background: #bada55; color: #222', '']
  const DEBUG_PREFIX = ["%c" + title + "%c " + version + " - DEBUG -", 'background: #FF9900; color: #222', '']
  const ERROR_PREFIX = ["%c" + title + "%c " + version + " - ERROR -", 'background: #bada55; color: #FF0000', '']
  const WARN_PREFIX = ["%c" + title + "%c " + version + " - WARN -", 'background: #bada55; color: #FF0000', '']

  betterLogger["info"] = window.console.info.bind(window.console, ...LOG_PREFIX)
  betterLogger["log"] = window.console.info.bind(window.console, ...LOG_PREFIX)
  betterLogger["error"] = window.console.error.bind(window.console, ...ERROR_PREFIX)

  if (isDebug) {
    betterLogger["debug"] = window.console.debug.bind(window.console, ...DEBUG_PREFIX)
    betterLogger["warn"] = window.console.warn.bind(window.console, ...WARN_PREFIX)
  }
  else {
    betterLogger["debug"] = function () { };
    betterLogger["warn"] = function () { };
  }
  
}

let isDebug = false

Object.defineProperty(CONFIG.debug, 'journal_icon_numbers', {
  get: function () { return isDebug; },
  set: function (v) {
    isDebug = v;
    setLogger(v);
  }
});

setLogger()

Hooks.once("ready",() => {
    setLogger()
    betterLogger.info("Use 'CONFIG.debug.journal_icon_numbers = true' for additional debugging")
});