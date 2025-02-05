"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import PokemonModal from "@/components/PokemonModal";
import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import NotConnected from "@/components/NotConnected";
import { filterPokemon, handleFavoriteClick } from "@/utils/pokemonUtils";
import { useUserData } from "@/context/UserDataContext";
import { Pokemon } from "@/utils/types";

export default function FavoritesPage() {
    const { data: session } = useSession();
    const { favorites, reloadFavorites } = useUserData();
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const pokemonsPerPage = 12;

    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // Mise à jour du filtrage quand favorites, searchTerm ou selectedTypes changent
    useEffect(() => {
        setLoading(true);
        setFilteredPokemon(filterPokemon(favorites, searchTerm, selectedTypes));
        setCurrentPage(1);
        setLoading(false);
    }, [favorites, searchTerm, selectedTypes]);

    // Gérer la recherche
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        const filtered = filterPokemon(favorites, term, selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };

    // Gérer le filtrage par type
    const handleTypeChange = (types: string[]) => {
        setSelectedTypes(types);
        const filtered = filterPokemon(favorites, searchTerm, types);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };

    if (!session) {
        return <NotConnected />;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">⭐ Mes Pokémon Favoris</h2>

            {loading ? (
                <div className="text-center">
                    <div className="loader"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
            ) : (
                <>
                    <SearchBar onSearchChange={handleSearchChange} onTypeChange={handleTypeChange} />

                    <div className="row">
                        {currentPokemons.length > 0 ? (
                            currentPokemons.map((pokemon: Pokemon) => (
                                <div key={pokemon.id} className="col-md-3">
                                    <PokemonCard
                                        pokemon={pokemon}
                                        onFavoriteClick={() => handleFavoriteClick(pokemon, favorites, reloadFavorites, session)}
                                        onCardClick={() => setSelectedPokemon(pokemon)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Aucun Pokémon trouvé</p>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

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