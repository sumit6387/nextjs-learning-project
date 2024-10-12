import UserModel from "../../../../model/User";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "../../../../lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "crednetials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    let user = await UserModel.findOne({
                        $or: [
                            {
                                email: credentials.identifier
                            },
                            {
                                username: credentials.identifier
                            }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Invalid credentials")
                    }
                    return user;
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        }
    }
}