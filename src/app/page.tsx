"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import PokemonModal from "@/components/PokemonModal";
import { fetchPokemonList } from "@/utils/api";
import { Pokemon } from "@/utils/types";
import { useSession } from "next-auth/react";
import { filterPokemon, handleFavoriteClick } from "@/utils/pokemonUtils";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export default function HomePage() {
    const { data: session } = useSession();
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [favorites, setFavorites] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pokemonsPerPage = 12;

    // Calcul des pages pour la pagination
    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // Gestion de la recherche
    const handleSearchChange = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        const filtered = filterPokemon(pokemonList, searchTerm, []);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };

    // Gestion du changement de types
    const handleTypeChange = (selectedTypes: string[]) => {
        setSelectedTypes(selectedTypes);
        const filtered = filterPokemon(pokemonList, "", selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };

    // Chargement des Pokémon avec gestion des erreurs
    useEffect(() => {
        async function loadPokemon() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPokemonList();
                setPokemonList(data);
                setFilteredPokemon(data);
            } catch (err) {
                if  (err instanceof Error) {
                    console.error("Erreur lors du chargement des Pokémon:", err);
                    setError("Erreur lors du chargement des Pokémon. Veuillez réessayer plus tard.");
                }
            } finally {
                setLoading(false);
            }
        }
        loadPokemon();
    }, []);

    // Mettre à jour le filtrage quand searchTerm, selectedTypes ou pokemonList changent
    useEffect(() => {
        const filtered = filterPokemon(pokemonList, searchTerm, selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedTypes, pokemonList]);

    return (
        <div className="container mt-4">
            <h1 className="text-center title mb-4">Liste des Pokémon</h1>

            {/* Affichage du message d'erreur en cas de problème */}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {loading ? (
                <div className="text-center">
                    <div className="loader"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
            ) : (
                <>
                    {/* Barre de recherche et filtrage */}
                    <SearchBar onSearchChange={handleSearchChange} onTypeChange={handleTypeChange} />

                    {/* Affichage des Pokémon */}
                    <div className="row">
                        {currentPokemons.length > 0 ? (
                            currentPokemons.map((pokemon: Pokemon) => (
                                <div key={pokemon.id} className="col-md-3">
                                    <PokemonCard
                                        pokemon={pokemon}
                                        onFavoriteClick={() =>
                                            handleFavoriteClick(pokemon, favorites, setFavorites, session)
                                        }
                                        onCardClick={() => setSelectedPokemon(pokemon)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Aucun Pokémon trouvé</p>
                        )}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

                    {/* Affichage du modal si un Pokémon est sélectionné */}
                    {selectedPokemon && (
                        <PokemonModal
                            pokemon={selectedPokemon}
                            onCloseAction={() => setSelectedPokemon(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}