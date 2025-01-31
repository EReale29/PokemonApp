// src/components/PokemonCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { PokemonCardProps } from "@/utils/types";
import { useSession } from "next-auth/react";
import {fetchFavorites} from "@/utils/pokemonUtils"; // Importation de next-auth pour vérifier la connexion

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onFavoriteClick, onCardClick }) => {
    const { data: session } = useSession(); // Vérification de la session (connexion de l'utilisateur)
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (session && session.user?.id) {
                const favorites = await fetchFavorites(session.user.id);  // Récupérer les favoris de l'utilisateur
                const isPokemonFavorite = favorites.some(fav => fav.id === pokemon.id);  // Vérifie si ce Pokémon est dans les favoris
                setIsFavorite(isPokemonFavorite); // Mettre à jour `isFavorite`
            }
        };

        checkIfFavorite();
    }, [session, pokemon.id]);

    // Gérer l'ajout ou le retrait des favoris
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche le clic d'être propagé à la carte

        if (!session) {
            console.log('test')
            return;
        }

        onFavoriteClick(); // Appelle la fonction de gestion des favoris
        setIsFavorite(!isFavorite); // Change l'état du favori
    };

    // Gérer le clic sur la carte pour afficher les détails du Pokémon
    const handleCardClick = () => {
        onCardClick();  // Appelle la fonction de gestion de la carte
    };

    return (
        <div className="card mb-3" style={{ maxWidth: "18rem", cursor: "pointer" }} onClick={handleCardClick}>
            <button
                className={`btn position-absolute top-0 end-0 m-2 ${isFavorite ? "text-warning" : "text-secondary"}`}
                onClick={handleFavoriteClick}
            >
                {isFavorite ? "⭐" : "☆"}
            </button>
            <div className="card-header text-center">{pokemon.name}</div>
            <div className="card-body text-center">
                <img src={pokemon.image} alt={pokemon.name} className="img-fluid" />
            </div>
        </div>
    );
};

export default PokemonCard;