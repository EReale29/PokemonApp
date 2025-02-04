"use client";

import React, { useEffect, useState } from "react";
import { Pokemon } from "@/utils/types";
import PokemonCard from "@/components/PokemonCard";
import { filterPokemon, handleFavoriteClick } from "@/utils/pokemonUtils";
import PokemonModal from "@/components/PokemonModal";
import {signIn, useSession} from "next-auth/react";
import { fetchFavorites } from "@/utils/pokemonUtils";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import NotConnected from "@/components/NotConnected";

export default function FavoritesPage() {
    const { data: session } = useSession();
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
    const [favorites, setFavorites] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // État de chargement
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Types sélectionnés pour filtrer
    const pokemonsPerPage = 12;

    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);


    useEffect(() => {
        async function loadFavorites() {
            if (session?.user?.id) {
                setLoading(true);
                const userFavorites = await fetchFavorites(session.user.id);

                // Trier les favoris par ID
                const sortedFavorites = userFavorites.sort((a, b) => a.id - b.id);

                setFavorites(sortedFavorites);
                setFilteredPokemon(sortedFavorites); // ✅ Met à jour les Pokémon filtrés
                setLoading(false);
            }
        }

        loadFavorites();
    }, [session]);

    useEffect(() => {
        setFilteredPokemon(filterPokemon(favorites, searchTerm, selectedTypes));
    }, [favorites, searchTerm, selectedTypes]);


    // Gérer la recherche
    const handleSearchChange = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        const filtered = filterPokemon(favorites, searchTerm, selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };

    // Gérer les types sélectionnés
    const handleTypeChange = (selectedTypes: string[]) => {
        const filtered = filterPokemon(favorites, searchTerm, selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1);
    };


    if (!session) {
        return <NotConnected />;
    }


    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">⭐ Mes Pokémon Favoris</h2>

            {/* Affichage du loader pendant le chargement */}
            {loading ? (
                <div className="text-center">
                    {/* Vous pouvez ajouter un spinner ici */}
                    <div className="loader"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
            ) : (
                <>

                    {/* Recherche et filtrage */}
                    <SearchBar onSearchChange={handleSearchChange} onTypeChange={handleTypeChange} />

                    {/* ✅ Affichage des Pokémon */}
                    <div className="row">
                        {currentPokemons.length > 0 ? (
                            currentPokemons.map((pokemon: Pokemon) => (
                                <div key={pokemon.id} className="col-md-3">
                                    <PokemonCard
                                        pokemon={pokemon}
                                        onFavoriteClick={() => handleFavoriteClick(pokemon, favorites, setFavorites, session)}
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
                        />)}
                </>
                )}
        </div>
    );
}