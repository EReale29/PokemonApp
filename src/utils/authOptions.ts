import GoogleProvider from "next-auth/providers/google";
import {Account, NextAuthOptions, User} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import { Session } from "next-auth";
import { firebaseApp } from "@/lib/firebase";
const db = getFirestore(firebaseApp);


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET, // Secret unique
    callbacks: {
        async jwt({ token, account, user }: { token: JWT; account: Account | null ; user: User }) {
            if (user) {
                const providerId = account?.provider || "unknown";
                const userId = `${user.email}-${providerId}`;
                const userRef = doc(db, "users", userId);
                try {
                    const userDoc = await getDoc(userRef);
                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            providerId: providerId,
                            createdAt: new Date(),
                            uid: userId,
                        });
                    }
                    token.id = userId;
                } catch (error) {
                    if  (error instanceof Error) {
                        console.error("Erreur lors de la gestion de l'utilisateur dans Firestore :", error);
                    }
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.id && typeof token.id === "string") {
                session.user.id = token.id;
            }
            return session;
        },
    },
};