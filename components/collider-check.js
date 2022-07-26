AFRAME.registerComponent("collider-check", {
  init: function () {
    this.playerElement = document.querySelector("a-entity[player]");
    this.coreElement = document.querySelector("a-entity[core]");
    this.impactSound = document.querySelector("#impactSound");
    this.collectSound = document.querySelector("#collectSound");
    this.bonusSound = document.querySelector("#bonusSound");

    const collectedHyper = {
      h: false,
      y: false,
      p: false,
      e: false,
      r: false,
    };

    this.playerElement.addEventListener("hitstart", () => {
      const entityClass =
        this.playerElement.components["aabb-collider"].objectEls[0]
          .classList[1];

      if (entityClass === "obstacle") {
        this.playerElement.components.player.shields--;
        this.impactSound.components.sound.playSound();
      }

      if (entityClass === "bonus") {
        this.playerElement.emit("addBonusNitro");
        this.bonusSound.components.sound.playSound();
      }

      if (entityClass === "letter") {
        const collectedLetter =
          this.playerElement.components["aabb-collider"].objectEls[0]
            .classList[2];
        if (!collectedHyper[collectedLetter]) {
          collectedHyper[collectedLetter] = true;
          this.coreElement.components.core.letterCounter++;
          this.letter = document.querySelector(`#${collectedLetter}`);
          this.letter.style.color = "turquoise";
        }
        this.collectSound.components.sound.playSound();
      }
    });
  },
});
