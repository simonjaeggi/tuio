const port = 3333;
const host = 'localhost';

const dgram = require("dgram");
const oscMsg = Buffer.from("/test\0\0\0,s\0\0hello\0\0\0\0", "ascii"); 
const client = dgram.createSocket("udp4");

client.send(oscMsg, 0, oscMsg.length, port, host, (err) => {
  if (err) console.error(err);
  else console.log("OSC message sent");
  client.close();
});
