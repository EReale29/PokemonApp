// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Pour récupérer les infos de l'utilisateur

export default function ProfilePage() {
    const { data: session } = useSession(); // Récupère la session de l'utilisateur

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mon Profil</h2>

            {session ? (
                <div>
                    <p><strong>Nom:</strong> {session.user?.name}</p>
                    <p><strong>Email:</strong> {session.user?.email}</p>
                    {/* Vous pouvez ajouter d'autres informations ici */}
                </div>
            ) : (
                <p>Veuillez vous connecter pour voir votre profil.</p>
            )}
        </div>
    );
}