

export renderNoteConfig (app, html, data) => {
  // Right-click on an imported, pre-set map note
  if (data.object.flags && data.object.flags.vtta) {
    const icon = data.object.icon;
    for (let i = 1; i < 100; i++) {
      const label = ("" + i).padStart(2, "0");
      const iconFilename = `modules/vtta-dndbeyond/icons/${label}.svg`;
      let selected = "";
      if (data.object.flags && data.object.flags.vtta) {
        selected = iconFilename === icon ? " selected" : "";
      }
      $('select[name="icon"]', html).append(`<option value="${iconFilename}" ${selected}>${label}</option>`);
    }
    $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
  } else {
    // user-placed map note
    const idx = data.entryName.length >= 2 ? parseInt(data.entryName.substr(0, 2)) : NaN;
    for (let i = 1; i < 100; i++) {
      const label = ("" + i).padStart(2, "0");
      const iconFilename = `modules/vtta-dndbeyond/icons/${label}.svg`;
      let selected = "";
      if (!isNaN(idx) && idx === i) {
        selected = "selected";
      }
      $('select[name="icon"]', html).append(`<option value="${iconFilename}" ${selected}>${label}</option>`);
    }
    $('input[name="iconSize"]').val(Math.round(game.scenes.viewed.data.grid * 0.75));
  }
};


Hooks.on("renderNoteConfig", renderNoteConfig);
