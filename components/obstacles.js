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

    // Defining min and max x-coordinates for obstacles and bonuses
    const max = 18;
    const min = -18;

    // Generating obstacles
    setInterval(() => {
      // Decide between obstacle or bonus, 0 = obstacle, 1 = bonus
      const randomType = Math.floor(Math.random() * 2);

      // Random x-coordinate
      const x = Math.floor(Math.random() * (max - min) + min);

      let element;
      if (randomType === 0) {
        const randomImgIndex = Math.floor(
          Math.random() * obstaclesImages.length
        );
        element = document.createElement("a-box");
        element.setAttribute("width", 10);
        element.setAttribute("height", 10);
        element.setAttribute("depth", 10);
        element.setAttribute("class", "collidable");
        element.setAttribute("src", obstaclesImages[randomImgIndex]);
        element.object3D.position.set(x, 5, -150);
      }

      if (randomType === 1) {
        element = document.createElement("a-octahedron");
        element.setAttribute("radius", 3);
        element.setAttribute("class", "collidable");
        element.setAttribute("color", "#fbff12");
        element.object3D.position.set(x, 3, -150);
      }

      this.elements.push({ element, initialTime: this.time });
      this.el.appendChild(element);
    }, 3000);

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
