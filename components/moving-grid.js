AFRAME.registerComponent("moving-grid", {
  schema: {
    width: { type: "number", default: 1 },
    height: { type: "number", default: 1 },
    depth: { type: "number", default: 1 },
    color: { type: "color", default: "#555" },
  },

  init: function () {
    // var scene = this.el.sceneEl.object3D;
    // var camera = new THREE.PerspectiveCamera(
    //   60,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   1000
    // );
    // camera.position.set(0, 10, 50);
    // camera.lookAt(scene.position);
    // var renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.querySelector("body").appendChild(renderer.domElement);
    //
    var el = this.el;

    var division = 20;
    var limit = 100;
    this.grid = new THREE.GridHelper(limit * 2, division, "blue", "blue");

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

    // var data = this.data;

    // // Create geometry.
    // this.geometry = new THREE.BoxBufferGeometry(
    //   data.width,
    //   data.height,
    //   data.depth
    // );
    //
    // // Create material.
    // this.material = new THREE.MeshStandardMaterial({ color: data.color });
    //
    // // Create mesh.
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    //
    // // Set mesh on entity.
    // el.setObject3D("mesh", this.mesh);

    // scene.add(grid);

    // var clock = new THREE.Clock();
    // var time = 0;
    //
    // function render() {
    //   requestAnimationFrame(render);
    //   time += clock.getDelta();
    //   grid.material.uniforms.time.value = time;
    //   renderer.render(scene);
    //   // renderer.render(scene, camera);
    // }
    // render();
  },

  tick: function (time, timeDelta) {
    this.grid.material.uniforms.time.value = time;
    this.grid.material.uniforms.speed.value = time * 0.0000001 + 0.01;
  },
});
