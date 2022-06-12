AFRAME.registerComponent("collider-check", {
  init: function () {
    this.playerElement = document.querySelector("a-entity[player]");

    this.playerElement.addEventListener("hitstart", () => {
      const entityClass =
        this.playerElement.components["aabb-collider"].objectEls[0]
          .classList[1];
      if (entityClass === "obstacle") {
        this.playerElement.components.player.shields--;
        console.log("hit");
      }

      if (entityClass === "bonus") console.log("bonus!");
    });
  },
});
