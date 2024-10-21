function preprocessNumber(value: any): any {
  if (value === true || value === false) {
    return "";
  }
  if (typeof value === "string" && !value) {
    return "";
  }
  return Number(value);
}

export default preprocessNumber;
