"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard"; // Import de votre composant PokemonCard
import { handleFavoriteClick } from "@/utils/pokemonUtils";
import PokemonModal from "@/components/PokemonModal";
import { useSession } from "next-auth/react"; // Import des fonctions utilitaires
import { fetchFavorites } from "@/utils/pokemonUtils"; // Import de la fonction pour récupérer les favoris

export default function FavoritesPage() {
    const { data: session } = useSession(); // Vérification de la session de l'utilisateur
    console.log(session);
    const [favorites, setFavorites] = useState<any[]>([]); // Liste des favoris
    const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null); // Pokémon sélectionné pour afficher ses détails

    // Charger les favoris depuis Firestore dès que la session change
    useEffect(() => {
        if (session?.user?.id) {
            const loadFavorites = async () => {
                const userFavorites = await fetchFavorites(session.user.id); // Utilise l'ID utilisateur pour récupérer les favoris
                setFavorites(userFavorites);
            };
            loadFavorites();
        }
    }, [session]);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">⭐ Mes Pokémon Favoris</h2>

            {/* Liste des Pokémon favoris */}
            <div className="row">
                {favorites.length > 0 ? (
                    favorites.map((fav) => (
                        <div key={fav.id} className="col-md-4">
                            <PokemonCard
                                pokemon={fav} // Passe les données du Pokémon à afficher
                                onFavoriteClick={() => handleFavoriteClick(fav, favorites, setFavorites, session)} // Ajoute ou retire du favori
                                onCardClick={() => setSelectedPokemon(fav)} // Ouvre le modal pour afficher les détails
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center">Aucun favori pour l'instant.</p> // Affiche un message si aucun favori
                )}
            </div>

            {/* ✅ Affichage du modal si un Pokémon est sélectionné */}
            {selectedPokemon && <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
        </div>
    );
}