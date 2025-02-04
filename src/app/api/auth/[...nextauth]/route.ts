import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth"; // Import des types Session et User
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // Assurez-vous que vous avez bien configuré Firebase
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
    secret: process.env.NEXTAUTH_SECRET, // Assurez-vous de définir un secret unique
    callbacks: {
        async jwt({ token, account, user }: { token: JWT, account: any, user: any }) {
            if (user) {
                const providerId = account?.provider || "unknown";
                const userId = `${user.email}-${providerId}`; // Crée un ID unique basé sur l'email + le provider

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
                            uid: userId,  // Utilisez un ID unique généré
                        });
                    }

                    token.id = userId; // Assurez-vous que l'ID est ajouté au token

                } catch (error) {
                    console.error("Erreur lors de la gestion de l'utilisateur dans Firestore :", error);
                }
            }
            return token;
        },

        // Fonction de session avec typage explicite
        async session({ session, token }: { session: Session, token: JWT }) {
            // Vérifier si user existe et définir l'id de l'utilisateur
            if (token.id && typeof token.id === "string") {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

// Utilisation des bons types pour Next.js
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    return NextAuth(req, res, authOptions); // Utilisation de NextAuth pour gérer les requêtes
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    return NextAuth(req, res, authOptions); // Même chose pour la méthode POST
};