AFRAME.registerComponent("collider-check", {
  init: function () {
    this.playerElement = document.querySelector("a-entity[player]");
    this.coreElement = document.querySelector("a-entity[core]");
    this.hyperElement = document.querySelector("#hyper");

    const collectedHyper = {
      H: false,
      Y: false,
      P: false,
      E: false,
      R: false,
    };

    this.playerElement.addEventListener("hitstart", () => {
      const entityClass =
        this.playerElement.components["aabb-collider"].objectEls[0]
          .classList[1];

      if (entityClass === "obstacle") {
        console.log("hit");
        this.playerElement.components.player.shields--;
      }

      if (entityClass === "bonus") {
        console.log("bonus!");
        this.playerElement.emit("addBonusNitro");
      }

      if (entityClass === "letter") {
        const collectedLetter =
          this.playerElement.components[
            "aabb-collider"
          ].objectEls[0].getAttribute("value");
        // console.log("letter collected", collectedLetter);
        if (!collectedHyper[collectedLetter]) {
          collectedHyper[collectedLetter] = true;
          this.coreElement.components.core.letterCounter++;
          this.hyperElement.innerText += ` ${collectedLetter}`;
          // console.log(this.coreElement.components.core.letterCounter);
        }
        // console.log(collectedHyper);
      }
    });
  },
});
