AFRAME.registerComponent("core", {
  init: function () {
    this.magnitude = 0;
    this.speed = 0;
    this.letterCounter = 0;

    this.nitros = {
      screamNitro: 0,
      bonusNitro: 0,
    };

    this.playerElement = document.querySelector("a-entity[player]");

    document
      .querySelector("a-entity[collider-check]")
      .addEventListener("addBonusNitro", () => {
        AFRAME.ANIME({
          targets: this.nitros,
          bonusNitro: this.nitros.bonusNitro + 0.01,
          easing: "cubicBezier(0.180, 0.070, 0.000, 1.000)",
        });
      });

    this.louderShown = false;
    this.yeahShown = false;
    this.winShown = false;

    this.speedElement = document.getElementById("speed");
    this.shieldsElement = document.getElementById("shields");

    const lightUpIndicator = (micVolume) => {
      const allIndicators = [...document.querySelectorAll(".soundIndicator")];
      const numberOfIndicatorsToLight = Math.round(micVolume / 15);
      const indicatorsToLight = allIndicators.slice(
        0,
        numberOfIndicatorsToLight
      );

      for (const indicator of allIndicators) {
        indicator.classList.remove("lightedUp");
      }

      for (const indicator of indicatorsToLight) {
        indicator.classList.add("lightedUp");
      }
    };

    (async () => {
      let volumeCallback = null;
      let volumeInterval = null;

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
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
          // max measured averageMicVolume so far is 160
          this.magnitude = averageMicVolume;
          lightUpIndicator(averageMicVolume);
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
      delay: 1000,
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

  tick: function (time, timeDelta) {
    const displayedShields = this.playerElement.components.player.shields;

    const speed =
      0.04 +
      time * 0.0000002 +
      this.nitros.screamNitro +
      this.nitros.bonusNitro;

    this.el.emit("updateTimeState", {
      timeDelta,
      speed,
    });

    const displayedSpeed = Math.round(speed * 10000 - 100);

    this.speedElement.innerHTML = "speed: " + displayedSpeed;

    if (displayedShields > 0) {
      this.shieldsElement.innerHTML = "shields: " + displayedShields;
    } else {
      this.shieldsElement.innerHTML = "shields gone";
    }

    const averageVolume = 100;
    const maxVolume = 120;

    // showing louderText and yeahText, and increasing speed only after the screamText is shown
    setTimeout(() => {
      if (this.magnitude > averageVolume && !this.louderShown) {
        this.louderShown = true;
        setTimeout(() => {
          if (!this.yeahShown) {
            this.louderTextEl.emit("showLouderText", null, false);
          }
        }, 500);
      }

      if (this.magnitude > maxVolume && !this.yeahShown) {
        this.yeahShown = true;
        AFRAME.ANIME({
          targets: this.nitros,
          bonusNitro: this.nitros.screamNitro + 0.05,
          easing: "cubicBezier(0.180, 0.070, 0.000, 2.000)",
        });
        this.yeahTextEl.emit("showYeahText", null, false);
      }
    }, 25000);

    const counter = this.letterCounter;

    if (counter === 5 && !this.winShown) {
      this.winShown = true;
      this.el.emit("playerWon");
      this.winTextEl.emit("showWinText", null, false);
    }

    // Sending the player to the horizon in win case, player can't accelerate after that
    if (this.winShown === true) {
      this.louderShown = true;
      this.yeahShown = true;
      this.playerElement.object3D.position.setZ(
        this.playerElement.object3D.position.z - 0.5
      );
    }

    // The player can't accelerate after death
    if (this.playerElement.components.player.shields < 0) {
      this.louderShown = true;
      this.yeahShown = true;
    }
  },
});
