const BUCKET_DATA_AMOUNT_PRECISION_THRESHOLD = 1_000;

/**
 * Format a bucket's data amount number into a shorter format when it's over 1,000.
 *
 * The shorter format should include K for thousands, M for millions, B for billions,
 * and T for trillions. See tests for more information if the implementation needs changes.
 *
 * @param amount Amount to format.
 *
 * @returns Amount formatted as a compact string.
 */
function formatDataAmount(amount: number): string {
  if (amount > BUCKET_DATA_AMOUNT_PRECISION_THRESHOLD) {
    const formatter = new Intl.NumberFormat("en-US", { notation: "compact" });
    return `~${formatter.format(amount)}`;
  }
  return String(amount);
}

export { formatDataAmount };
