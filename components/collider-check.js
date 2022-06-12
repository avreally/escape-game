AFRAME.registerComponent("collider-check", {
  init: function () {
    this.playerElement = document.querySelector("a-entity[player]");

    this.playerElement.addEventListener("hitstart", () => {
      console.log("hit");
      this.playerElement.components.player.shields--;
    });
  },
});
