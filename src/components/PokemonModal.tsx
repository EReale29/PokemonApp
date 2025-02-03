"use client";

import React, { useState, useEffect } from "react";
import { Pokemon } from "@/utils/types"; // Assurez-vous que le chemin est correct
import { typeBadges } from "@/utils/types";
import { handleEquipeClick, fetchEquipe } from "@/utils/pokemonUtils";
import { useSession } from "next-auth/react";

interface PokemonModalProps {
    pokemon: Pokemon | null;      // Le Pokémon à afficher
    onCloseAction: () => void;     // Fonction de fermeture, renommée pour indiquer qu'il s'agit d'une Server Action
}

export default function PokemonModal({ pokemon, onCloseAction }: PokemonModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [equipped, setEquipped] = useState(false); // Indicateur si le Pokémon est dans l'équipe
    const { data: session } = useSession(); // Utilisation de NextAuth pour récupérer la session
    const [loading, setLoading] = useState(true); // État de chargement des données d'équipe
    const [equipe, setEquipe] = useState<Pokemon[]>([]); // État pour l'équipe

    useEffect(() => {
        if (session?.user?.id && pokemon) {
            // Charger l'équipe du joueur et vérifier si le Pokémon y est
            const loadEquipe = async () => {
                const equipe = await fetchEquipe(session.user.id); // Récupérer l'équipe de l'utilisateur
                const isInEquipe = equipe.some((poke) => poke.id === pokemon.id); // Vérifier si le Pokémon est dans l'équipe
                setEquipped(isInEquipe); // Mettre à jour l'état
                setEquipe(equipe); // Mettre à jour l'équipe
                setLoading(false); // Fin du chargement
            };

            loadEquipe();
        }
    }, [session, pokemon]);

    const handleAddToEquipe = async () => {
        if (session?.user?.id && pokemon) {
            // Appel de la fonction pour ajouter ou retirer le Pokémon de l'équipe
            await handleEquipeClick(pokemon, equipe, setEquipe, session);
            setEquipped(!equipped); // Mettre à jour l'état de la Pokéball
        }
    };

    // Si aucun Pokémon n'est passé, on ne montre pas le modal
    if (!pokemon) return null;

    // Fonction pour déclencher l'animation de fermeture
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onCloseAction(); // Utilisation de la prop renommée
            setIsClosing(false); // Réinitialisation pour la prochaine ouverture
        }, 300); // Durée de l'animation de fermeture
    };

    return (
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className={`modal-content ${isClosing ? "closing" : ""}`}>
                    <div className="modal-header">
                        <h5 className="modal-title">{pokemon.name}</h5>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            {/* Image du Pokémon à gauche */}
                            <div className="col-md-4 text-center">
                                <img src={pokemon.image} alt={pokemon.name} className="img-fluid rounded" />
                            </div>

                            {/* Informations du Pokémon à droite */}
                            <div className="col-md-8">
                                <h3 className="text-primary">{pokemon.name}</h3>

                                {/* Affichage des types avec des badges colorés */}
                                <div className="mb-3">
                                    {pokemon.apiTypes.map((type) => (
                                        <span key={type.name} className={`badge ${typeBadges[type.name] || "bg-secondary"} mx-1`}>
                                            {type.name}
                                        </span>
                                    ))}
                                </div>

                                <h4>Statistiques</h4>
                                <ul className="list-group">
                                    <li className="list-group-item"><strong>HP:</strong> {pokemon.stats.HP}</li>
                                    <li className="list-group-item"><strong>Attaque:</strong> {pokemon.stats.attack}</li>
                                    <li className="list-group-item"><strong>Défense:</strong> {pokemon.stats.defense}</li>
                                    <li className="list-group-item"><strong>Vitesse:</strong> {pokemon.stats.speed}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {/* Bouton pour ajouter ou retirer le Pokémon de l'équipe */}
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={handleAddToEquipe}
                        >
                            <img
                                src={equipped ? "/images/pokeball_pleine.png" : "/images/pokeball_vide.png"}
                                alt="Pokéball"
                                width="40"
                                height="40"
                            />
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}