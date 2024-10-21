import { z } from "zod";

const zName = z.string().min(3).max(100);

export { zName };
