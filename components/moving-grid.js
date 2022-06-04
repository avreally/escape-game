AFRAME.registerComponent("moving-grid", {
  schema: {
    width: { type: "number", default: 1 },
    height: { type: "number", default: 1 },
    depth: { type: "number", default: 1 },
    color: { type: "color", default: "#555" },
  },

  init: function () {
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
  },

  tick: function (time, timeDelta) {
    this.grid.material.uniforms.time.value = time;
    this.grid.material.uniforms.speed.value = time * 0.0000001 + 0.01;
  },
});
