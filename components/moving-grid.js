AFRAME.registerComponent("moving-grid", {
  init: function () {
    this.magnitude = 0;
    this.averageVolumeReached = false;
    this.maxVolumeReached = false;
    this.nitro = 0;

    this.louderShown = false;
    this.yeahShown = false;

    var el = this.el;

    var division = 20;
    var limit = 100;
    this.grid = new THREE.GridHelper(
      limit * 2,
      division,
      "turquoise",
      "turquoise"
    );

    var moveable = [];
    for (let i = 0; i <= division; i++) {
      moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
    }
    this.grid.geometry.setAttribute(
      "moveable",
      new THREE.BufferAttribute(new Uint8Array(moveable), 1)
    );
    this.grid.material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0,
        },
        limits: {
          value: new THREE.Vector2(-limit, limit),
        },
        speed: {
          value: 0.01,
        },
      },
      vertexShader: `
      uniform float time;
      uniform vec2 limits;
      uniform float speed;

      attribute float moveable;

      varying vec3 vColor;

      void main() {
        vColor = color;
        float limLen = limits.y - limits.x;
        vec3 pos = position;
        if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1
          float dist = speed * time;
          float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
          pos.z = currPos;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
      }
    `,
      fragmentShader: `
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1.);
      }
    `,
      vertexColors: THREE.VertexColors,
    });

    el.setObject3D("mesh", this.grid);

    document
      .querySelector(".button-connect")
      .addEventListener("click", async () => {
        const usbVendorId = 0x239a;
        navigator.serial
          .requestPort({ filters: [{ usbVendorId }] })
          .then(async (port) => {
            await port.open({ baudRate: 9600 });
            console.log(port, port.readable);

            while (port.readable) {
              const reader = port.readable.getReader();
              try {
                while (true) {
                  const { value, done } = await reader.read();
                  if (done) {
                    console.error("Reader has been canceled");
                    break;
                  }
                  if (value.length === 5) {
                    const view = new DataView(value.buffer, 0);
                    const magnitude = view.getFloat32(0, true);

                    console.log(magnitude);
                    this.magnitude = magnitude;
                  }
                }
              } catch (error) {
                console.error(error);
              } finally {
                reader.releaseLock();
              }
            }
          })
          .catch((err) => {
            console.error("Port is not selected", err);
          });
      });

    this.louderTextEl = document.getElementById("louderText");
    this.yeahTextEl = document.getElementById("yeahText");

    this.louderTextEl.setAttribute("animation__louder__fadein", {
      property: "text.opacity",
      from: 0,
      to: 1,
      startEvents: "showLouderText",
    });

    this.louderTextEl.setAttribute("animation__louder__fadeout", {
      property: "text.opacity",
      from: 1,
      to: 0,
      startEvents: "showLouderText",
      delay: 3000,
    });

    this.yeahTextEl.setAttribute("animation__yeah__fadein", {
      property: "text.opacity",
      from: 0,
      to: 1,
      startEvents: "showYeahText",
    });

    this.yeahTextEl.setAttribute("animation__yeah__fadeout", {
      property: "text.opacity",
      from: 1,
      to: 0,
      startEvents: "showYeahText",
      delay: 3000,
    });

    this.duckObj = document.getElementById("duckObj");

    this.keys = [];

    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      console.log(this.keys);
      console.log("check", this.keys["ArrowLeft"]);
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      console.log(this.keys);
    });
  },

  tick: function (time, timeDelta) {
    this.grid.material.uniforms.time.value = time;
    this.grid.material.uniforms.speed.value =
      time * 0.0000001 + 0.01 + this.nitro;

    const displayedSpeed = Math.round(
      this.grid.material.uniforms.speed.value * 10000 - 100
    );

    document.getElementById("speed").innerHTML = "speed: " + displayedSpeed;

    const averageVolume = 1000;
    const maxVolume = 2000;

    if (this.magnitude > averageVolume) {
      this.averageVolumeReached = true;
    }

    if (this.magnitude > maxVolume) {
      this.maxVolumeReached = true;
    }

    if (this.averageVolumeReached && !this.louderShown) {
      console.log("louder");
      this.louderShown = true;
      this.louderTextEl.emit("showLouderText", null, false);
    }

    if (this.maxVolumeReached && !this.yeahShown) {
      this.yeahShown = true;
      console.log("yeah!");
      this.nitro = 0.05;
      this.yeahTextEl.emit("showYeahText", null, false);
    }

    const duckObj = this.duckObj;
    const pos = this.duckObj.object3D.position;

    //  Checking pressed keys
    if (this.keys["ArrowLeft"]) {
      console.log("inside if");
      if (pos.x > -18) {
        duckObj.object3D.position.set(pos.x - 0.7, pos.y, pos.z);
      }
    }

    if (this.keys["ArrowRight"]) {
      if (pos.x < 18) {
        duckObj.object3D.position.set(pos.x + 0.7, pos.y, pos.z);
      }
    }
  },
});
