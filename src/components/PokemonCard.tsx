"use client";

import React, { useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/firebaseFavorites";
import { useSession } from "next-auth/react";

export default function PokemonCard({ pokemon, onClick }: { pokemon: any; onClick: () => void }) {
    const { data: session } = useSession();
    const userId = session?.user?.email || ""; // 🔥 Utilise l'email comme ID utilisateur
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    // ✅ Charger les favoris depuis Firebase au chargement
    useEffect(() => {
        if (userId) {
            getFavorites(userId).then(setFavorites);
        }
    }, [userId]);

    // ✅ Vérifier si le Pokémon est dans les favoris
    useEffect(() => {
        setIsFavorite(favorites.some((fav) => fav.pokemon.id === pokemon.id));
    }, [favorites, pokemon]);

    // ✅ Ajouter ou supprimer un favori
    const toggleFavorite = async () => {
        if (!userId) {
            alert("Veuillez vous connecter pour ajouter un favori !");
            return;
        }

        if (isFavorite) {
            const favoriteToRemove = favorites.find((fav) => fav.pokemon.id === pokemon.id);
            if (favoriteToRemove) {
                await removeFavorite(favoriteToRemove.id);
            }
        } else {
            await addFavorite(userId, pokemon);
        }

        const updatedFavorites = await getFavorites(userId);
        setFavorites(updatedFavorites);
    };

    return (
        <div className="card mb-3 position-relative shadow-sm border-0" style={{ maxWidth: "18rem", cursor: "pointer" }} onClick={onClick}>
            {/* ✅ Bouton étoile pour gérer les favoris */}
            <button
                className={`btn position-absolute top-0 end-0 m-2 ${isFavorite ? "text-warning" : "text-secondary"}`}
                onClick={(e) => {
                    e.stopPropagation(); // Empêche l'ouverture du modal
                    toggleFavorite();
                }}
            >
                {isFavorite ? "⭐" : "☆"}
            </button>

            <div className="card-header text-center fw-bold">{pokemon.name}</div>
            <div className="card-body text-center">
                <img src={pokemon.image} alt={pokemon.name} className="img-fluid" />
            </div>
        </div>
    );
}