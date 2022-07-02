AFRAME.registerComponent("obstacles", {
  init: function () {
    this.time = 0;
    this.speed = 0;
    this.elements = [];

    this.playerElement = document.querySelector("a-entity[player]");

    const obstaclesImages = [
      "#teamImg",
      "#trustImg",
      "#assessmentImg",
      "#projectImg",
    ];

    const lettersClass = ["h", "y", "p", "e", "r"];
    const lettersImages = [
      "#letterH",
      "#letterY",
      "#letterP",
      "#letterE",
      "#letterR",
    ];

    // Defining min and max x-coordinates for obstacles and bonuses
    const max = 18;
    const min = -18;

    this.hasPlayerWon = false;

    let intervalID;
    if (this.hasPlayerWon === false) {
      // Generating obstacles and bonuses
      intervalID = setInterval(() => {
        // Decide between obstacle or bonus, 0 - 3 = obstacle, 4 - 5 = bonus, 6 - 7 - letter
        const randomType = Math.floor(Math.random() * 8);

        // Random x-coordinate
        const x = Math.floor(Math.random() * (max - min) + min);

        let element;
        if (randomType < 4) {
          const randomImgIndex = Math.floor(
            Math.random() * obstaclesImages.length
          );
          element = document.createElement("a-box");
          element.setAttribute("width", 10);
          element.setAttribute("height", 10);
          element.setAttribute("depth", 10);
          element.setAttribute("src", obstaclesImages[randomImgIndex]);
          element.setAttribute("class", "collidable obstacle");
          element.object3D.position.set(x, 5, -150);
        }

        if (randomType > 3 && randomType < 6) {
          element = document.createElement("a-octahedron");
          element.setAttribute("radius", 3);
          element.setAttribute("color", "#fbff12");
          element.setAttribute("class", "collidable bonus");
          element.object3D.position.set(x, 3, -150);
        }

        if (randomType > 5) {
          const letterIndex = Math.floor(Math.random() * lettersImages.length);
          element = document.createElement("a-sphere");
          element.setAttribute("src", lettersImages[letterIndex]);
          element.setAttribute("radius", 5);
          element.setAttribute("segments-height", 53);

          element.setAttribute(
            "class",
            `collidable letter ${lettersClass[letterIndex]}`
          );
          element.object3D.position.set(x, 5, -150);
        }

        element.setAttribute("data-aabb-collider-dynamic", true);

        this.elements.push({ element, initialTime: this.time });
        this.el.appendChild(element);
      }, 2000);
    }

    // Removing obstacles after collision with player
    this.playerElement.addEventListener("hitstart", () => {
      // console.log(this.elements);
      const collidedElement =
        this.playerElement.components["aabb-collider"].objectEls[0];

      const index = this.elements.findIndex(({ element }) => {
        return collidedElement === element;
      });
      this.elements.splice(index, 1);
      collidedElement.remove();
    });

    document
      .querySelector("a-entity[core]")
      .addEventListener("updateTimeState", (event) => {
        const { time, speed } = event.detail;
        this.time = time;
        this.speed = speed;
      });

    document
      .querySelector("a-entity[core]")
      .addEventListener("playerWon", () => {
        this.hasPlayerWon = true;
        // console.log("player won, removing obstacles");
        clearInterval(intervalID);
        // console.log("elements", this.elements);
        this.elements.forEach((element) => {
          element.element.remove();
        });
        this.elements = [];
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
