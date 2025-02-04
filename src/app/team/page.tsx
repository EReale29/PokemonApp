"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchEquipe } from "@/utils/pokemonUtils";
import { Pokemon } from "@/utils/types";
import { deleteEquipe, updateEquipe } from "@/lib/firebaseEquipe";
import NotConnected from "@/components/NotConnected";

export default function Team() {
    const { data: session } = useSession();
    const [team, setTeam] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pokemonToRemove, setPokemonToRemove] = useState<Pokemon | null>(null);
    const [reloadTeam, setReloadTeam] = useState(false);

    // Charger l'équipe avec gestion d'erreurs
    useEffect(() => {
        async function loadEquipe() {
            if (session?.user?.id) {
                setLoading(true);
                setError(null); // Réinitialise l'erreur avant le chargement
                try {
                    const equipe = await fetchEquipe(session.user.id);
                    setTeam(equipe);
                } catch (err: any) {
                    console.error("Erreur lors du chargement de l'équipe:", err);
                    setError("Erreur lors du chargement de l'équipe. Veuillez réessayer.");
                } finally {
                    setLoading(false);
                }
            }
        }
        loadEquipe();
    }, [session, reloadTeam]);

    // Gestion de la suppression d'un Pokémon
    const handleRemovePokemon = async () => {
        if (pokemonToRemove && session?.user?.id) {
            try {
                await deleteEquipe(pokemonToRemove.id, session.user.id);
                // Optionnel : mettre à jour localement le state
                setTeam(team.filter(pokemon => pokemon.id !== pokemonToRemove.id));
                setShowConfirm(false);
                setReloadTeam(prev => !prev);
            } catch (err: any) {
                console.error("Erreur lors de la suppression de ce Pokémon:", err);
                alert("Erreur lors de la suppression. Veuillez réessayer.");
            }
        }
    };

    // Gestion de l'ajout d'un surnom
    const handleAddNickname = async (pokemon: Pokemon, nickname: string) => {
        if (nickname && session?.user?.id) {
            try {
                const updatedPokemon = { ...pokemon, nickname };
                await updateEquipe(updatedPokemon, session.user.id);
                setReloadTeam(prev => !prev);
            } catch (err: any) {
                console.error("Erreur lors de l'ajout du surnom:", err);
                alert("Erreur lors de l'ajout du surnom. Veuillez réessayer.");
            }
        }
    };

    if (!session) {
        return <NotConnected />;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mon Équipe</h2>

            {error && (
                <div className="alert alert-danger text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <p>Chargement de votre équipe...</p>
            ) : (
                <div className="row">
                    {team.length > 0 ? (
                        team.map((pokemon) => (
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
                                            <p className="card-text">
                                                Surnom: {pokemon.nickname || "Aucun"}
                                            </p>
                                            <button
                                                className="btn btn-warning mb-2"
                                                onClick={() => {
                                                    const newNickname = prompt(
                                                        "Entrez un surnom pour ce Pokémon:",
                                                        pokemon.nickname
                                                    );
                                                    if (newNickname) {
                                                        handleAddNickname(pokemon, newNickname);
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
                        <p className="text-center">Votre équipe est vide.</p>
                    )}
                </div>
            )}

            {/* Confirmation de la suppression */}
            {showConfirm && pokemonToRemove && (
                <div
                    className="modal show d-block"
                    tabIndex={-1}
                    role="dialog"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmer la suppression</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Êtes-vous sûr de vouloir retirer{" "}
                                    {pokemonToRemove.nickname || pokemonToRemove.name} de votre équipe ?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleRemovePokemon}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}