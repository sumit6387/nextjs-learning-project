import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long");


export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
});  