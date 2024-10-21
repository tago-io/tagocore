/**
 */
function splitColon(value: string) {
  const value1 = String(value).split(":")[0];
  const value2 = String(value).split(":")[1];
  return [value1, value2];
}

export default splitColon;
