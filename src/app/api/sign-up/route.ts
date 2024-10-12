import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already exist!!"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
        });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already verified. Please login!!"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                messages: []
            });
            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json(emailResponse, { status: 201 });
    } catch (error) {
        console.error("Error: Something went wrong!!", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }

}