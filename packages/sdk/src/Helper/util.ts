function csvNameGenerator(baseName: string) {
  const date = new Date();
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  const hour = date.getHours().toString();
  const minute = date.getMinutes().toString();
  const second = date.getSeconds().toString();
  const name = `${year}-${month}-${day}_${hour}-${minute}-${second}`;
  return `${baseName}_${name}.csv`;
}

export { csvNameGenerator };
