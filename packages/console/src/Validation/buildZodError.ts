import type { ZodIssueBase } from "zod";

function buildZodError(errors: ZodIssueBase[]) {
  const e: any = {};

  for (const data of errors) {
    if (data.path.length === 3) {
      // array path
      const arrayName = data.path[0];
      const index = data.path[1];
      const key = data.path[2];

      e[arrayName] = e[arrayName] || [];
      e[arrayName][index] = e[arrayName][index] || {};
      e[arrayName][index][key] = true;
    } else {
      // single property
      e[data.path[0]] = true;
    }
  }

  return e;
}

export default buildZodError;
