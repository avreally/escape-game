AFRAME.registerComponent("player", {
  init: function () {
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

    //  Checking pressed keys
    if (this.keys["ArrowLeft"]) {
      if (pos.x > -18) {
        player.object3D.position.set(pos.x - 0.5, pos.y, pos.z);
      }
    }

    if (this.keys["ArrowRight"]) {
      if (pos.x < 18) {
        player.object3D.position.set(pos.x + 0.5, pos.y, pos.z);
      }
    }
  },
});
