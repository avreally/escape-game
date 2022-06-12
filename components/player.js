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

    if (this.shields < 0) {
      this.el.remove();
    }
  },
});
