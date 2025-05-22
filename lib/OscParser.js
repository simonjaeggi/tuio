const { jspack } = require("jspack");

function decode(data) {
  const message = [];
  const address = decodeString(data);
  data = address.data;

  if (address.value === "#bundle") {
    data = decodeBundle(data, message);
  } else if (data.length > 0) {
    data = decodeMessage(address, data, message);
  }

  return message;
}

function decodeBundle(data, message) {
  const time = decodeTime(data);
  data = time.data;

  message.push("#bundle", time.value);

  while (data.length > 0) {
    const bundleSize = decodeInt(data);
    data = bundleSize.data;

    const content = data.slice(0, bundleSize.value);
    message.push(decode(content));

    data = data.slice(bundleSize.value);
  }

  return data;
}

function decodeMessage(address, data, message) {
  message.push(address.value);

  let typeTags = decodeString(data);
  data = typeTags.data;
  typeTags = typeTags.value;

  if (typeTags[0] === ",") {
    for (let i = 1; i < typeTags.length; i++) {
      const arg = decodeByTypeTag(typeTags[i], data);
      data = arg.data;
      message.push(arg.value);
    }
  }

  return data;
}

function decodeByTypeTag(typeTag, data) {
  switch (typeTag) {
    case "i":
      return decodeInt(data);
    case "f":
      return decodeFloat(data);
    case "s":
      return decodeString(data);
    default:
      return { value: null, data }; // Skip unknown types gracefully
  }
}

function decodeInt(data) {
  if (data.length < 4) return { value: null, data };
  return {
    value: jspack.Unpack(">i", data.slice(0, 4))[0],
    data: data.slice(4)
  };
}

function decodeFloat(data) {
  if (data.length < 4) return { value: null, data };
  return {
    value: jspack.Unpack(">f", data.slice(0, 4))[0],
    data: data.slice(4)
  };
}

function decodeString(data) {
  let end = 0;
  while (data[end] && end < data.length) {
    end++;
  }

  const str = data.toString("utf8", 0, end);
  const paddedLength = Math.ceil((end + 1) / 4) * 4;
  return {
    value: str,
    data: data.slice(paddedLength)
  };
}

function decodeTime(data) {
  if (data.length < 8) return { value: null, data };
  const time = jspack.Unpack(">LL", data.slice(0, 8));
  const seconds = time[0];
  const fraction = time[1];

  return {
    value: seconds + fraction / 4294967296,
    data: data.slice(8)
  };
}

module.exports = {
  decode
};
