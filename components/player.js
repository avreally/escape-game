AFRAME.registerComponent("player", {
  init: function () {
    this.shields = 3;
    this.keys = [];
    this.gameOverSound = document.querySelector("#gameOverSound");

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

    document
      .querySelector("a-entity[core]")
      .addEventListener("updateTimeState", (event) => {
        const { speed } = event.detail;
        this.speed = speed;
      });
  },

  tick: function (time, timeDelta) {
    const player = this.el;
    const pos = this.el.object3D.position;
    const minmax = 21;

    //  Checking pressed keys
    if (this.keys["ArrowLeft"]) {
      if (pos.x > -minmax) {
        player.object3D.position.x -= 0.5;
      }
    }

    if (this.keys["ArrowRight"]) {
      if (pos.x < minmax) {
        player.object3D.position.x += 0.5;
      }
    }

    // game over
    if (this.shields < 0 && !this.loseShown) {
      this.el.remove();
      this.gameOverSound.components.sound.playSound();
      this.loseTextEl.emit("showLoseText", null, false);
    }

    // increasing player rotation speed
    player.object3D.rotation.y += (timeDelta * this.speed) / 7;
  },
});
