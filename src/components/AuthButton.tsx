"use client";

import { signIn, signOut, useSession } from "next-auth/react"; // Import de NextAuth
import React from "react";

export default function AuthButton() {
    const { data: session } = useSession(); // Utilisation de useSession pour obtenir les informations de la session

    // Fonction pour se connecter avec le provider sélectionné
    const handleSignIn = (provider: string) => {
        signIn(provider); // NextAuth s'occupe de la connexion
    };

    return (
        <div className="flex items-center space-x-4">
            {session ? (
                <div className="flex items-center space-x-3">
                    <p className="text-white">Bienvenue, {session.user?.name}!</p>
                    <button
                        onClick={() => signOut()}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Déconnexion
                    </button>
                </div>
            ) : (
                <div className="flex space-x-3">
                    <button
                        onClick={() => handleSignIn("google")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Connexion avec Google
                    </button>
                    <button
                        onClick={() => handleSignIn("github")}
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                    >
                        Connexion avec GitHub
                    </button>
                </div>
            )}
        </div>
    );
}