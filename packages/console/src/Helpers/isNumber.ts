/**
 */
function isNumber(s: any) {
  const str = `${s}`.trim();
  if (str.length === 0) {
    return false;
  }
  return !Number.isNaN(+str);
}

export default isNumber;
