"use client";

import React, { useEffect, useState } from "react";
import { getFavorites } from "@/lib/firebaseFavorites";
import { useSession } from "next-auth/react";
import PokemonCard from "@/components/PokemonCard";

export default function FavoritesPage() {
    const { data: session } = useSession();
    const userId = session?.user?.email || "";
    const [favorites, setFavorites] = useState<any[]>([]);

    // ✅ Charger les favoris au chargement
    useEffect(() => {
        if (userId) {
            getFavorites(userId).then(setFavorites);
        }
    }, [userId]);

    if (!userId) {
        return <h2 className="text-center mt-5">Veuillez vous connecter pour voir vos favoris</h2>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">⭐ Mes Pokémon Favoris</h2>
            <div className="row">
                {favorites.length > 0 ? (
                    favorites.map((fav) => (
                        <div key={fav.id} className="col-md-4">
                            <PokemonCard pokemon={fav.pokemon} onClick={() => {}} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">Aucun favori pour l'instant.</p>
                )}
            </div>
        </div>
    );
}