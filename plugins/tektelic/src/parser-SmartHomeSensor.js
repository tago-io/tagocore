/* This is an generic payload parser example.
 ** The code find the payload variable and parse it if exists.
 **
 ** IMPORTANT: In most case, you will only need to edit the parsePayload function.
 **
 ** Testing:
 ** You can do manual tests to this parse by using the Device Emulator. Copy and Paste the following code:
 ** [{ "variable": "payload", "value": "0109611395" }]
 **
 ** The ignore_vars variable in this code should be used to ignore variables
 ** from the device that you don't want.
 */
// Add ignorable variables in this array.
const ignore_vars = [];

/**
 * Convert an object to TagoIO object format.
 * Can be used in two ways:
 * toTagoFormat({ myvariable: myvalue , anothervariable: anothervalue... })
 * toTagoFormat({ myvariable: { value: myvalue, unit: 'C', metadata: { color: 'green' }} , anothervariable: anothervalue... })
 *
 * @param {Object} object_item Object containing key and value.
 * @param {String} serie Serie for the variables
 * @param {String} prefix Add a prefix to the variables name
 */
function toTagoFormat(object_item, serie, prefix = "") {
  const result = [];
  for (const key in object_item) {
    if (ignore_vars.includes(key)) continue;

    if (typeof object_item[key] === "object") {
      result.push({
        variable: object_item[key].variable || `${prefix}${key}`,
        value: object_item[key].value,
        serie: object_item[key].serie || serie,
        metadata: object_item[key].metadata,
        location: object_item[key].location,
        unit: object_item[key].unit,
      });
    } else {
      result.push({
        variable: `${prefix}${key}`,
        value: object_item[key],
        serie,
      });
    }
  }

  return result;
}

function parsePayload(payload_raw) {
  // If your device is sending something different than hex, like base64, just specify it bellow.
  const bytes = Buffer.from(payload_raw, "hex");
  const params = {
    // battery_voltage: null,
    // reed_state: null,
    // light_detected: null,
    // temperature: null,
    // humidity: null,
    // impact_magnitude: null,
    // break_in: null,
    // acceleration_x: null,
    // acceleration_y: null,
    // acceleration_z: null,
    // reed_count: null,
    // moisture: null,
    // activity: null,
    // mcu_temperature: null,
    // impact_alarm: null,
    // activity_count: null,
    // external_input: null,
    // external_input_count: null,
  };

  for (let i = 0; i < bytes.length; i++) {
    // Handle battery voltage
    if (bytes[i] === 0x00 && bytes[i + 1] === 0xff) {
      params.battery_voltage = 0.01 * ((bytes[i + 2] << 8) | bytes[i + 3]);
      i += 3;
    }

    // Handle reed switch state
    if (bytes[i] === 0x01 && bytes[i + 1] === 0x00) {
      if (bytes[i + 2] === 0x00) {
        params.input = -1;
      } else if (bytes[i + 2] === 0xff) {
        params.input = 0;
      }
      i += 2;
    }

    // Handle light detection
    if (bytes[i] === 0x02 && bytes[i + 1] === 0x00) {
      if (bytes[i + 2] === 0x00) {
        params.light_detected = 0;
      } else if (bytes[i + 2] === 0xff) {
        params.light_detected = 1;
      }
      i += 2;
    }

    // Handle temperature
    if (bytes[i] === 0x03 && bytes[i + 1] === 0x67) {
      // Sign-extend to 32 bits to support negative values, by shifting 24 bits
      // (16 too far) to the left, followed by a sign-propagating right shift:
      params.temperature = (((bytes[i + 2] << 24) >> 16) | bytes[i + 3]) / 10;
      i += 3;
    }

    // Handle humidity
    if (bytes[i] === 0x04 && bytes[i + 1] === 0x68) {
      params.humidity = 0.5 * bytes[i + 2];
      i += 2;
    }

    // Handle impact magnitude
    if (bytes[i] === 0x05 && bytes[i + 1] === 0x02) {
      // Sign-extend to 32 bits to support negative values, by shifting 24 bits
      // (16 too far) to the left, followed by a sign-propagating right shift:
      params.impact_magnitude =
        (((bytes[i + 2] << 24) >> 16) | bytes[i + 3]) / 1000;
      i += 3;
    }

    // Handle break-in
    if (bytes[i] === 0x06 && bytes[i + 1] === 0x00) {
      if (bytes[i + 2] === 0x00) {
        params.break_in = false;
      } else if (bytes[i + 2] === 0xff) {
        params.break_in = true;
      }
      i += 2;
    }

    // Handle accelerometer data
    if (bytes[i] === 0x07 && bytes[i + 1] === 0x71) {
      // Sign-extend to 32 bits to support negative values, by shifting 24 bits
      // (16 too far) to the left, followed by a sign-propagating right shift:
      params.acceleration_x =
        (((bytes[i + 2] << 24) >> 16) | bytes[i + 3]) / 1000;
      params.acceleration_y =
        (((bytes[i + 4] << 24) >> 16) | bytes[i + 5]) / 1000;
      params.acceleration_z =
        (((bytes[i + 6] << 24) >> 16) | bytes[i + 7]) / 1000;
      i += 7;
    }

    // Handle reed switch count
    if (bytes[i] === 0x08 && bytes[i + 1] === 0x04) {
      params.input_count = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 3;
    }

    // Handle moisture
    if (bytes[i] === 0x09 && bytes[i + 1] === 0x00) {
      i += 1;
      // check data
      if (bytes[i + 1] === 0x00) {
        params.moisture = false;
        i += 1;
      } else if (bytes[i + 1] === 0xff) {
        params.moisture = true;
        i += 1;
      }
    }

    // Handle PIR activity
    // check the channel and type
    if (bytes[i] === 0x0a && bytes[i + 1] === 0x00) {
      i += 1;
      // check data
      if (bytes[i + 1] === 0x00) {
        params.motion_detected = 0;
        i += 1;
      } else if (bytes[i + 1] === 0xff) {
        params.motion_detected = -1;
        i += 1;
      }
    }

    // Handle temperature
    if (bytes[i] === 0x0b && bytes[i + 1] === 0x67) {
      // Sign-extend to 32 bits to support negative values, by shifting 24 bits
      // (16 too far) to the left, followed by a sign-propagating right shift:
      params.mcu_temperature =
        (((bytes[i + 2] << 24) >> 16) | bytes[i + 3]) / 10;
      i += 3;
    }

    // Handle impact alarm
    if (bytes[i] === 0x0c && bytes[i + 1] === 0x00) {
      if (bytes[i + 2] === 0x00) {
        params.impact_alarm = false;
      } else if (bytes[i + 2] === 0xff) {
        params.impact_alarm = true;
      }
      i += 2;
    }

    // Handle motion (PIR activity) event count
    if (bytes[i] === 0x0d && bytes[i + 1] === 0x04) {
      params.motion_count = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 3;
    }

    // Handle external input state
    if (bytes[i] === 0x0e && bytes[i + 1] === 0x00) {
      if (bytes[i + 2] === 0x00) {
        params.external_input = true;
      } else if (bytes[i + 2] === 0xff) {
        params.external_input = false;
      }
      i += 2;
    }

    // Handle external input count
    if (bytes[i] === 0x0f && bytes[i + 1] === 0x04) {
      params.external_input_count = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 3;
    }
  }

  return params;
}

// let payload = [{ variable: 'payload', value: '036700f204686000ff0129', serie: 122 }];
// Remove unwanted variables.

export default async function parserSmartHomeSensor(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  payload = payload.filter((x) => !ignore_vars.includes(x.variable));

  // Payload is an environment variable. Is where what is being inserted to your device comes in.
  // Payload always is an array of objects. [ { variable, value...}, {variable, value...} ...]
  const data = payload.find(
    (x) =>
      x.variable === "payload_raw" ||
      x.variable === "payload" ||
      x.variable === "data",
  );
  if (data) {
    // Get a unique serie for the incoming data.
    const { value, serie } = data;

    // Parse the payload_raw to JSON format (it comes in a String format)
    if (value) {
      payload = payload.concat(toTagoFormat(parsePayload(value), serie));
    }
  }

  return payload;
}

// console.log(payload);
