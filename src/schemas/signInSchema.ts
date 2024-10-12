import { z } from "zod";

export const signInSchema = z.object({
    email: z.string(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
});