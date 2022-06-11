AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],

  init: function () {
    this.el.addEventListener("raycaster-intersection", (event) => {
      if (event.detail.intersections[0].distance < 5) {
        console.log(
          "Player hit something! Distance",
          event.detail.intersections[0]
        );
      }
    });
  },
});
