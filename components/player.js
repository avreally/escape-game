AFRAME.registerComponent("player", {
  init: function () {
    this.shields = 3;
    this.keys = [];

    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.loseShown = false;
    this.loseTextEl = document.getElementById("loseText");

    this.loseTextEl.setAttribute("animation__lose__fadein", {
      property: "text.opacity",
      from: 0,
      to: 1,
      startEvents: "showLoseText",
    });
  },

  tick: function () {
    const player = this.el;
    const pos = this.el.object3D.position;
    const minmax = 21;

    //  Checking pressed keys
    if (this.keys["ArrowLeft"]) {
      if (pos.x > -minmax) {
        player.object3D.position.set(pos.x - 0.5, pos.y, pos.z);
      }
    }

    if (this.keys["ArrowRight"]) {
      if (pos.x < minmax) {
        player.object3D.position.set(pos.x + 0.5, pos.y, pos.z);
      }
    }

    if (this.shields < 0 && !this.loseShown) {
      this.el.remove();
      this.loseTextEl.emit("showLoseText", null, false);
    }
  },
});
