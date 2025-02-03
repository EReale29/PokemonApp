"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchEquipe, handleEquipeClick } from "@/utils/pokemonUtils"; // Utiliser votre fonction pour récupérer l'équipe et ajouter aux équipes
import { Pokemon } from "@/utils/types"; // Assurez-vous d'avoir le type Pokemon
import {addEquipe, removeEquipe, updateEquipe} from "@/lib/firebaseEquipe"; // Pour l'ajout et la suppression d'équipe

export default function Team() {
    const { data: session } = useSession();
    const [team, setTeam] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pokemonToRemove, setPokemonToRemove] = useState<Pokemon | null>(null);
    const [newNickname, setNewNickname] = useState("");

    useEffect(() => {
        if (session?.user?.id) {
            const loadEquipe = async () => {
                const equipe = await fetchEquipe(session.user.id); // Récupérer l'équipe depuis Firebase ou autre source
                setTeam(equipe);
                setLoading(false);
            };
            loadEquipe();
        }
    }, [session, newNickname]);

    const handleRemovePokemon = async () => {
        if (pokemonToRemove && session?.user?.id) {
            await removeEquipe(pokemonToRemove.id, session.user?.id); // Supprimer du Firebase
            setTeam(team.filter(pokemon => pokemon.id !== pokemonToRemove.id)); // Mettre à jour l'équipe localement
            setShowConfirm(false); // Fermer la confirmation
        }
    };

    const handleAddNickname = async (pokemon: Pokemon) => {
        if (newNickname && session?.user?.id) {
            console.log(newNickname);
            const updatedPokemon = { ...pokemon, nickname: newNickname };
            // Enregistrer le surnom dans la base de données ou mettre à jour localement
            await updateEquipe(updatedPokemon, session.user?.id); // Ajoute avec le surnom
            setNewNickname(""); // Réinitialiser le champ du surnom
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mon Équipe</h2>

            {session ? (
                <>
                    {loading ? (
                        <p>Chargement de votre équipe...</p>
                    ) : (
                        <div className="row">
                            {team.length > 0 ? (
                                team.map((pokemon, index) => (
                                    <div key={pokemon.id} className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-body d-flex">
                                                <img
                                                    src={pokemon.image}
                                                    className="img-fluid rounded me-3"
                                                    alt={pokemon.name}
                                                    style={{ width: "150px", height: "auto" }}
                                                />
                                                <div className="d-flex flex-column">
                                                    <h5 className="card-title">{pokemon.name}</h5>
                                                    <p className="card-text">Surnom: {pokemon.nickname || "Aucun"}</p>

                                                    <button
                                                        className="btn btn-warning mb-2"
                                                        onClick={() => {
                                                            const newNickname = prompt("Entrez un surnom pour ce Pokémon:", pokemon.nickname);
                                                            if (newNickname) {
                                                                setNewNickname(newNickname);
                                                                handleAddNickname(pokemon);
                                                            }
                                                        }}
                                                    >
                                                        Donner un surnom
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            setPokemonToRemove(pokemon);
                                                            setShowConfirm(true);
                                                        }}
                                                    >
                                                        Retirer de l'équipe
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Votre équipe est vide.</p>
                            )}
                        </div>
                    )}
                    {/* Confirmation de la suppression */}
                    {showConfirm && pokemonToRemove && (
                        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirmer la suppression</h5>
                                    </div>
                                    <div className="modal-body">
                                        <p>Êtes-vous sûr de vouloir retirer {pokemonToRemove.nickname} de votre équipe ?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                                            Annuler
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={handleRemovePokemon}>
                                            Confirmer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Veuillez vous connecter pour voir votre équipe.</p>
            )}
        </div>
    );
}