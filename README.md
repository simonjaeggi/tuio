# tuio

A modernized version of the original Tuio.js server for Node.js. Receives OSC messages over UDP and forwards them to WebSocket clients using Socket.IO v4.

## Installation
`npm install tuio`

## Usage

```js
const TuioServer = require("tuio");

TuioServer.init({
  oscPort: 3333,
  oscHost: "0.0.0.0",
  socketPort: 8080
});
```

## Client example
See examples.

## Credits
Based on the original Tuio.js server by Felix Raab
https://github.com/fe9lix/Tuio.js

## License
Licensed under the GPL license.

