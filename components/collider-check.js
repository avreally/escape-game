AFRAME.registerComponent("collider-check", {
  init: function () {
    this.playerElement = document.querySelector("a-entity[player]");

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
        console.log(
          "letter collected",
          this.playerElement.components[
            "aabb-collider"
          ].objectEls[0].getAttribute("value")
        );
      }
    });
  },
});
