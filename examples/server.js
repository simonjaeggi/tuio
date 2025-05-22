const TuioServer = require("../lib/TuioServer");

TuioServer.init({
  oscPort: 3333,
  oscHost: "0.0.0.0",
  socketPort: 8080
});