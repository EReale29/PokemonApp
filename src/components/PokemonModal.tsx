import React, { useEffect, useState } from "react";
import { Pokemon } from "@/utils/types"; // Assurez-vous que le chemin est correct
import { typeBadges } from "@/utils/types";
import { handleEquipeClick, fetchEquipe } from "@/utils/pokemonUtils";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface PokemonModalProps {
    pokemon: Pokemon | null;
    onCloseAction: () => void;
}

export default function PokemonModal({ pokemon, onCloseAction }: PokemonModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [equipped, setEquipped] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [equipe, setEquipe] = useState<Pokemon[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id && pokemon) {
            const loadEquipe = async () => {
                setLoading(true);
                setError(null);
                try {
                    const fetchedEquipe = await fetchEquipe(session.user.id);
                    const isInEquipe = fetchedEquipe.some((poke) => poke.id === pokemon.id);
                    setEquipped(isInEquipe);
                    setEquipe(fetchedEquipe);
                } catch (err) {
                    console.error("Erreur lors du chargement de l'équipe :", err);
                    setError("Erreur lors du chargement de l'équipe.");
                } finally {
                    setLoading(false);
                }
            };

            loadEquipe();
        }
    }, [session, pokemon]);

    const handleAddToEquipe = async () => {
        if (session?.user?.id && pokemon) {
            try {
                await handleEquipeClick(pokemon, equipe, setEquipe, session);
                setEquipped((prev) => !prev);
            } catch (err) {
                console.error("Erreur lors de l'ajout/retrait du Pokémon :", err);
                setError("Erreur lors de l'ajout/retrait du Pokémon.");
            }
        } else {
            alert("Veuillez vous connecter pour ajouter un pokemon a l'equipe !");
            return;
        }
    };

    // Fonction pour déclencher l'animation de fermeture
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onCloseAction();
            setIsClosing(false);
        }, 300);
    };

    // Si aucun Pokémon n'est passé, ne rien afficher
    if (!pokemon) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className={`modal-content ${isClosing ? "closing" : ""}`}>
                    <div className="modal-header">
                        <h5 className="modal-title">{pokemon.name}</h5>
                    </div>
                    <div className="modal-body">
                        {/* Affichage d'un message d'erreur, s'il y en a */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {loading ? (
                            <div>Chargement...</div>
                        ) : (
                            <div className="row">
                                {/* Image du Pokémon à gauche */}
                                <div className="col-md-4 text-center">
                                    <Image
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        width={300}       // Définissez la largeur souhaitée (en pixels)
                                        height={300}      // Définissez la hauteur souhaitée (en pixels)
                                        className="img-fluid rounded"
                                    />
                                </div>
                                {/* Informations du Pokémon à droite */}
                                <div className="col-md-8">
                                    <h3 className="text-primary">{pokemon.name}</h3>
                                    {/* Affichage des types avec des badges colorés */}
                                    <div className="mb-3">
                                        {pokemon.apiTypes.map((type) => (
                                            <span
                                                key={type.name}
                                                className={`badge ${typeBadges[type.name] || "bg-secondary"} mx-1`}
                                            >
                        {type.name}
                      </span>
                                        ))}
                                    </div>
                                    <h4>Statistiques</h4>
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            <strong>HP:</strong> {pokemon.stats.HP}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Attaque:</strong> {pokemon.stats.attack}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Défense:</strong> {pokemon.stats.defense}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Vitesse:</strong> {pokemon.stats.speed}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {/* Bouton pour ajouter ou retirer le Pokémon de l'équipe */}
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={handleAddToEquipe}
                        >
                            <img
                                src={
                                    equipped ? "/images/pokeball_pleine.png" : "/images/pokeball_vide.png"
                                }
                                alt="Pokéball"
                                width="40"
                                height="40"
                            />
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}