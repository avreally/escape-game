AFRAME.registerComponent("moving-grid", {
  init: function () {
    const division = 20;
    const limit = 100;
    this.grid = new THREE.GridHelper(
      limit * 2,
      division,
      "turquoise",
      "turquoise"
    );

    const moveable = [];
    for (let i = 0; i <= division; i++) {
      moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
    }
    this.grid.geometry.setAttribute(
      "moveable",
      new THREE.BufferAttribute(new Uint8Array(moveable), 1)
    );
    this.grid.material = new THREE.ShaderMaterial({
      uniforms: {
        offset: {
          value: 0,
        },
        limits: {
          value: new THREE.Vector2(-limit, limit),
        },
      },
      vertexShader: `
      uniform float offset;
      uniform vec2 limits;

      attribute float moveable;

      varying vec3 vColor;

      void main() {
        vColor = color;
        float limLen = limits.y - limits.x;
        vec3 pos = position;
        if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1
          float currPos = mod((pos.z + offset) - limits.x, limLen) + limits.x;
          pos.z = currPos;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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

    this.el.setObject3D("mesh", this.grid);

    document
      .querySelector("a-entity[core]")
      .addEventListener("updateTimeState", (event) => {
        const { timeDelta, speed } = event.detail;
        this.grid.material.uniforms.offset.value += timeDelta * speed;
      });
  },
});
