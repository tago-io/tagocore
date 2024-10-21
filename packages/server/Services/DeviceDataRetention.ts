import { DateTime } from "luxon";
import { logError } from "../Helpers/log.ts";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import { editDevice, getDeviceList } from "./Device.ts";

/**
 * Interval to control the data removal interval.
 */
let interval: ReturnType<typeof setInterval>;

let checkingDataRemoval = false;

/**
 * Triggers the data removal check.
 * By the end of this function, all devices that need to have data removed will have its data removed.
 */
async function triggerDataRetentionCheck() {
  if (checkingDataRemoval) {
    // lock to prevent multiple executions
    return;
  }

  checkingDataRemoval = true;

  try {
    const devices = await getDeviceList({
      fields: ["id", "type", "chunk_period", "chunk_retention"],
      amount: 999999,
      filter: {
        type: "immutable",
        last_retention: DateTime.utc().minus({ day: 1 }).toJSDate(),
      },
    }).catch(() => null);

    if (!devices) {
      return;
    }

    for (const device of devices) {
      if (!device.chunk_period) {
        continue;
      }

      const dateToRemove = DateTime.utc()
        .minus({ [device.chunk_period]: device.chunk_retention })
        .endOf(device.chunk_period)
        .toJSDate();

      await invokeDatabaseFunction(
        "applyDeviceDataRetention",
        device.id,
        device.type,
        { date: dateToRemove },
      );

      await editDevice(device.id, { last_retention: new Date() }).catch(
        console.error,
      );
    }
  } catch (ex: any) {
    const err = ex?.message || ex?.toString?.() || ex;
    logError(err);
  } finally {
    checkingDataRemoval = false;
  }
}

/**
 * Starts the data removal trigger check.
 */
function startDataRetentionTimer() {
  stopDataRetentionTimer();
  interval = setInterval(triggerDataRetentionCheck, 1000 * 60 * 10);
}

/**
 * Stops the data removal trigger check.
 */
function stopDataRetentionTimer() {
  if (interval) {
    clearInterval(interval);
  }
}

export {
  stopDataRetentionTimer,
  startDataRetentionTimer,
  triggerDataRetentionCheck,
};
