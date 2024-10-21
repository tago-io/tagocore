const asterisks = /\*/g;
const underlines = /\_/g;
const percents = /\%/g;
const duplePercents = /\%\%/g;

/**
 * Replaces the filter wildcards into a format understood by SQLite.
 * -> `*` will become `%`
 * @param {number} value The value to be replaced.
 */
function replaceFilterWildCards(value?: string): string {
  let newValue = String(value || "");
  newValue = newValue.replace(percents, "\\%");
  newValue = newValue.replace(duplePercents, "\\%");
  newValue = newValue.replace(underlines, "\\_");
  newValue = newValue.replace(asterisks, "%");
  return newValue;
}

export default replaceFilterWildCards;
