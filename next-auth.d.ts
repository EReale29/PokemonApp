import { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

// Déclarez l'extension du type de session pour inclure 'id'
declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Ajoute l'id de l'utilisateur
            name?: string | null;
            email?: string | null;
            image?: string | null;
        } & DefaultSession["user"];
    }

    interface JWT {
        id?: string;
    }
}