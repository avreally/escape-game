AFRAME.registerComponent("core", {
  init: function () {
    this.magnitude = 0;
    this.averageVolumeReached = false;
    this.maxVolumeReached = false;
    this.time = 0;
    this.speed = 0;
    this.nitro = 0;
    this.bonusNitro = 0;
    this.letterCounter = 0;

    this.playerElement = document.querySelector("a-entity[player]");

    document
      .querySelector("a-entity[collider-check]")
      .addEventListener("addBonusNitro", () => {
        this.bonusNitro += 0.008;
        // faster
        // this.bonusNitro += 0.01;
      });

    this.louderShown = false;
    this.yeahShown = false;
    this.winShown = false;

    this.speedElement = document.getElementById("speed");
    this.shieldsElement = document.getElementById("shields");

    (async () => {
      let volumeCallback = null;
      let volumeInterval = null;

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
          },
        });
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.minDecibels = -127;
        analyser.maxDecibels = 0;
        analyser.smoothingTimeConstant = 0.4;
        audioSource.connect(analyser);
        const volumes = new Uint8Array(analyser.frequencyBinCount);
        volumeCallback = () => {
          analyser.getByteFrequencyData(volumes);
          let volumeSum = 0;
          for (const volume of volumes) {
            volumeSum += volume;
          }
          const averageMicVolume = volumeSum / volumes.length;
          // console.log(averageMicVolume);
          this.magnitude = averageMicVolume;
        };
      } catch (error) {
        console.log(error);
      }
      if (volumeCallback !== null && volumeInterval === null) {
        volumeInterval = setInterval(volumeCallback, 100);
      }
    })();

    this.louderTextEl = document.getElementById("louderText");
    this.yeahTextEl = document.getElementById("yeahText");
    this.winTextEl = document.getElementById("winText");

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

    this.winTextEl.setAttribute("animation__win__fadein", {
      property: "text.opacity",
      from: 0,
      to: 1,
      startEvents: "showWinText",
    });
  },

  tick: function (time) {
    const displayedShields = this.playerElement.components.player.shields;

    // original speed
    // const speed = time * 0.0000001 + 0.01 + this.nitro + this.bonusNitro;

    // faster from the start
    // const speed = time * 0.0000002 + 0.04 + this.nitro + this.bonusNitro;

    // average speed
    const speed = time * 0.0000001 + 0.03 + this.nitro + this.bonusNitro;

    this.el.emit("updateTimeState", {
      time,
      speed,
      nitro: this.nitro,
    });

    const displayedSpeed = Math.round(speed * 10000 - 100);

    this.speedElement.innerHTML = "speed: " + displayedSpeed;

    if (displayedShields > 0) {
      this.shieldsElement.innerHTML = "shields: " + displayedShields;
    } else {
      this.shieldsElement.innerHTML = "shields gone";
    }

    const averageVolume = 70;
    const maxVolume = 100;

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

    const counter = this.letterCounter;

    if (counter === 5 && !this.winShown) {
      this.winShown = true;

      this.el.emit("playerWon");

      console.log("win", counter);
      this.winTextEl.emit("showWinText", null, false);
    }

    if (this.winShown === true) {
      this.playerElement.object3D.position.setZ(
        this.playerElement.object3D.position.z - 0.5
      );
      console.log("pos Z", this.playerElement.object3D.position.z);
    }
  },
});
