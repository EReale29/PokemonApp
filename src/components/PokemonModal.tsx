"use client";

import React, { useState } from "react";
import { typeBadges } from "@/utils/types";

export default function PokemonModal({ pokemon, onClose }: { pokemon: any; onClose: () => void }) {
    const [isClosing, setIsClosing] = useState(false);

    if (!pokemon) return null;

    // ✅ Fonction pour déclencher l'animation de fermeture
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
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
                                    {pokemon.apiTypes.map((type: any) => (
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
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}