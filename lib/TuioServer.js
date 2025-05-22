const http = require("http");
const dgram = require("dgram");
const { Server } = require("socket.io");
const oscParser = require("./OscParser");

let udpSocket = null;
let io = null;

module.exports = (function () {
  const init = function (params) {
    udpSocket = dgram.createSocket("udp4");
    udpSocket.on("listening", onSocketListening);
    udpSocket.bind(params.oscPort, params.oscHost);

    const httpServer = http.createServer();
    io = new Server(httpServer, {
      cors: {
        origin: "*", 
      },
      transports: ["websocket", "polling"], 
    });

    io.on("connection", onSocketConnection);

    httpServer.listen(params.socketPort, () => {
      console.log(`Socket.IO server listening on port ${params.socketPort}`);
    });
  };

  const onSocketListening = function () {
    const address = udpSocket.address();
    console.log("TuioServer listening on: " + address.address + ":" + address.port);
  };

  const onSocketConnection = function (socket) {
    console.log("Client connected:", socket.id);

    udpSocket.on("message", function (msg) {
      const decoded = oscParser.decode(msg);
      socket.emit("osc", decoded);
    });
  };

  return {
    init: init,
  };
})();
