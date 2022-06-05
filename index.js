// document
//   .querySelector(".button-connect")
//   .addEventListener("click", async () => {
//     const usbVendorId = 0x239a;
//     navigator.serial
//       .requestPort({ filters: [{ usbVendorId }] })
//       .then(async (port) => {
//         await port.open({ baudRate: 9600 });
//         console.log(port, port.readable);
//
//         while (port.readable) {
//           const reader = port.readable.getReader();
//           try {
//             while (true) {
//               const { value, done } = await reader.read();
//               if (done) {
//                 console.error("Reader has been canceled");
//                 break;
//               }
//               const view = new DataView(value.buffer, 0);
//               const magnitude = view.getFloat32(0, true);
//               if (value.length === 5) {
//                 console.log(value.length, magnitude);
//               }
//             }
//           } catch (error) {
//             console.error(error);
//           } finally {
//             reader.releaseLock();
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("Port is not selected", err);
//       });
//   });
