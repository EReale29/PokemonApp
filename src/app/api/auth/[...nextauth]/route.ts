import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { JWT } from "next-auth/jwt";

const db = getFirestore(firebaseApp);

export const authOptions = {
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
        async jwt({ token, account, user }: { token: JWT; account: any; user: any }) {
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
                    console.error("Erreur lors de la gestion de l'utilisateur dans Firestore :", error);
                    // Selon vos besoins, vous pouvez décider de renvoyer une valeur par défaut ou laisser token sans id
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

// Endpoint GET
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // NextAuth gère la requête et la réponse selon authOptions
        return await NextAuth(req, res, authOptions);
    } catch (error) {
        console.error("Erreur dans l'endpoint GET /auth :", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Endpoint POST
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        return await NextAuth(req, res, authOptions);
    } catch (error) {
        console.error("Erreur dans l'endpoint POST /auth :", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};