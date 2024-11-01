import { z } from "zod";

const zTags = z.array(
  z.object({ key: z.string().nonempty(), value: z.string().nonempty() }),
);

export { zTags };
