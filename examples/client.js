// this is just for testing purposes
const { io } = require("socket.io-client");

const socket = io("http://localhost:8080"); 

socket.on("connect", () => {
  console.log("Connected!");
});

socket.on("osc", (data) => {
  console.log("Received OSC:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});