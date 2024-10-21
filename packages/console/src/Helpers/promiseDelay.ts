/**
 * Waits with a timeout in a promise.
 */
async function promiseDelay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export { promiseDelay };
