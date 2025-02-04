import React, { useState, useEffect } from "react";
import { PokemonCardProps } from "@/utils/types";
import { useSession } from "next-auth/react";
import { fetchFavorites } from "@/utils/pokemonUtils";
import Image from "next/image";

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onFavoriteClick, onCardClick }) => {
    const { data: session } = useSession(); // Vérification de la session (connexion de l'utilisateur)
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkIfFavorite = async () => {
            try {
                if (session && session.user?.id) {
                    const favorites = await fetchFavorites(session.user.id);
                    const isPokemonFavorite = favorites.some(fav => fav.id === pokemon.id);
                    setIsFavorite(isPokemonFavorite);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des favoris :", error);
            }
        };

        checkIfFavorite();
    }, [session, pokemon.id]);

    // Gérer l'ajout ou le retrait des favoris
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche le clic d'être propagé à la carte

        if (!session) {
            console.warn("Utilisateur non connecté, impossible d'ajouter aux favoris.");
            return;
        }

        try {
            onFavoriteClick();
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Erreur lors de la gestion du clic favori :", error);
        }
    };

    // Gérer le clic sur la carte pour afficher les détails du Pokémon
    const handleCardClick = () => {
        try {
            onCardClick();
        } catch (error) {
            console.error("Erreur lors du clic sur la carte :", error);
        }
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
                <div className="image-container">
                    <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        width={300}       // Dimensions de référence
                        height={300}
                        className="img-fluid"
                    />
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;