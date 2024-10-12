import { z } from "zod";

export const acceptMessageSchema = z.object({
    content: z.string().min(10, "Content must have 10 characters").max(300, "Content have maximum 300 characters"),
});