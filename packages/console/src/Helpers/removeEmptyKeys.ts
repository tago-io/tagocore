function removeEmptyKeys(obj: any): any {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmptyKeys(v) : v]),
  );
}

export default removeEmptyKeys;
