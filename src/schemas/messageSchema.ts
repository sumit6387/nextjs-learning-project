import { z } from "zod";

export const messageSchema = z.object({
    acceptMessage: z.boolean(),
});