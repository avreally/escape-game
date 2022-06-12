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
        this.bonusNitro += 0.01;
      });

    this.louderShown = false;
    this.yeahShown = false;
    this.winShown = false;

    this.speedElement = document.getElementById("speed");
    this.shieldsElement = document.getElementById("shields");
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

    this.winTextEl.setAttribute("animation__win__fadeout", {
      property: "text.opacity",
      from: 1,
      to: 0,
      startEvents: "showWinText",
      delay: 3000,
    });
  },

  tick: function (time) {
    const displayedShields = this.playerElement.components.player.shields;

    // const speed = time * 0.0000001 + 0.01 + this.nitro;
    const speed = time * 0.0000002 + 0.04 + this.nitro + this.bonusNitro;
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

    const counter = this.letterCounter;

    if (counter === 5 && !this.winShown) {
      this.winShown = true;
      console.log("win", counter);
      this.winTextEl.emit("showWinText", null, false);
    }
  },
});
