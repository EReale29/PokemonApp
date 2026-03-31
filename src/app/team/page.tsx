"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Pokemon } from "@/utils/types";
import { deleteEquipe, updateEquipe } from "@/lib/firebaseEquipe";
import NotConnected from "@/components/NotConnected";
import { useUserData } from "@/context/UserDataContext";
import Image from "next/image";

            ) : (
                <div className="row">
                    {team.length > 0 ? (
                        team.map((pokemon) => (
                            <div key={pokemon.id} className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-body d-flex">
                                        <Image
                                            src={pokemon.image}
                                            alt={pokemon.name}
                                            width={150}
                                            height={300}
                                            style={{ width: "150px", height: "auto" }}
                                            className="img-fluid rounded me-3"
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
                                                Retirer de l&apos;équipe
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