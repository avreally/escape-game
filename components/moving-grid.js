AFRAME.registerComponent("moving-grid", {
  schema: {
    width: { type: "number", default: 1 },
    height: { type: "number", default: 1 },
    depth: { type: "number", default: 1 },
    color: { type: "color", default: "#555" },
  },

  init: function () {
    this.magnitude = 0;

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
    this.grid.geometry.addAttribute(
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
                  const view = new DataView(value.buffer, 0);
                  const magnitude = view.getFloat32(0, true);

                  if (value.length === 5) {
                    // console.log(value.length, magnitude);
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
  },

  tick: function (time, timeDelta) {
    this.grid.material.uniforms.time.value = time;
    this.grid.material.uniforms.speed.value = time * 0.0000001 + 0.01;
    // this.grid.material.uniforms.speed.value = this.magnitude * 0.0001;
    // console.log(this.grid.material.uniforms.speed.value);
  },
});
