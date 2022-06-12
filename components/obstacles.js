AFRAME.registerComponent("obstacles", {
  init: function () {
    this.time = 0;
    this.speed = 0;
    this.elements = [];

    const obstaclesImages = [
      "#team-img",
      "#trust-img",
      "#assessment-img",
      "#project-img",
    ];

    // Defining min and max x-coordinates for obstacles
    const max = 17;
    const min = -17;

    // Generating obstacles
    setInterval(() => {
      const x = Math.floor(Math.random() * (max - min) + min);
      const randomImgIndex = Math.floor(Math.random() * obstaclesImages.length);
      const element = document.createElement("a-box");
      element.object3D.position.set(x, 5, -150);
      element.setAttribute("width", 10);
      element.setAttribute("height", 10);
      element.setAttribute("depth", 10);
      element.setAttribute("class", "collidable");
      element.setAttribute("src", obstaclesImages[randomImgIndex]);
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
    this.elements.forEach(({ element, initialTime }, index) => {
      const position = element.object3D.position;
      position.setZ((this.time - initialTime) * this.speed - 150);
      if (position.z > 50) {
        this.elements.splice(index, 1);
        this.el.removeChild(element);
      }
    });
  },
});
