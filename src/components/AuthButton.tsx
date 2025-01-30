"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Bienvenue, {session.user?.name}!</p>
                <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
                    Déconnexion
                </button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => signIn("google")} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Connexion avec Google
            </button>
            <button onClick={() => signIn("github")} className="bg-gray-800 text-white px-4 py-2 rounded">
                Connexion avec GitHub
            </button>
        </div>
    );
}