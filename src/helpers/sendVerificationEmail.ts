import { resend } from "@/lib/resend";
import { VerificationEmail } from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Honest Review verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { message: "Verification email sent successfully", success: true };
    } catch (error) {
        console.log("Error ==> sending verification email: ", error);
        return { success: false, message: "Error sending verification email" };
    }
}

