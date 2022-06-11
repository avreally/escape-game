AFRAME.registerComponent("obstacles", {
  init: function () {
    this.time = 0;
    this.speed = 0;
    this.elements = [];

    // Defining min and max x-coordinates for obstacles
    const max = 17;
    const min = -17;

    setInterval(() => {
      const x = Math.floor(Math.random() * (max - min) + min);
      const element = document.createElement("a-box");
      element.object3D.position.set(x, 2.5, -100);
      element.setAttribute("width", 5);
      element.setAttribute("height", 5);
      element.setAttribute("depth", 5);
      element.setAttribute("color", "magenta");
      this.elements.push({ element, initialTime: this.time });
      this.el.appendChild(element);
    }, 2000);

    document
      .querySelector("a-entity[core]")
      .addEventListener("updateTimeState", (event) => {
        const { time, speed } = event.detail;
        this.time = time;
        this.speed = speed;
      });
  },

  tick() {
    this.elements.forEach(({ element, initialTime }) => {
      const position = element.object3D.position;
      position.set(
        position.x,
        position.y,
        (this.time - initialTime) * this.speed - 100
      );
    });
  },
});
