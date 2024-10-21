import { z } from "zod";

/**
 * Allows the following configurations:
 *
 * - tuples such as ["name", "asc"]
 * - strings with field and order such as "name,asc"
 */
function createQueryOrderBy<T extends z.ZodTypeAny>(value: T) {
  const errorMsg = "Invalid orderBy parameter";
  return z
    .tuple([value, z.enum(["asc", "desc"])])
    .or(
      z
        .string()
        .transform((x) => x.split(","))
        .refine((x) => x[0] && (x[1] === "asc" || x[1] === "desc"), errorMsg)
    )
    .nullish()
    .transform((x) => x ?? ["name", "asc"]);
}

export default createQueryOrderBy;
