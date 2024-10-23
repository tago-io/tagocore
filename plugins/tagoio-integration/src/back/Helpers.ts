import os from "node:os";
import md5 from "md5";

/**
 */
function getMachineID() {
  const interfaces = os.networkInterfaces();
  const hostname = os.hostname();

  for (const name of Object.keys(interfaces)) {
    for (const tmp of interfaces[name] || []) {
      const { mac, family, internal } = tmp;
      if (family === "IPv4" && !internal) {
        const extra = process.env.TCORE_CLUSTER_TOKEN
          ? "cluster"
          : "standalone";
        return `${md5(mac)}:${hostname}:${extra}`;
      }
    }
  }

  throw new Error("Could not generate a unique ID for this machine");
}

/**
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const tmp of interfaces[name] || []) {
      const { address, family, internal } = tmp;
      if (family === "IPv4" && !internal) {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

export { getMachineID, getLocalIPs };
