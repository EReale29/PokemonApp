"use client";

import React, { useEffect, useState } from "react";
import { Pokemon } from "@/utils/types";
import PokemonCard from "@/components/PokemonCard";
import { filterPokemon, handleFavoriteClick, fetchFavorites } from "@/utils/pokemonUtils";
import PokemonModal from "@/components/PokemonModal";
import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import NotConnected from "@/components/NotConnected";

export default function FavoritesPage() {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState<Pokemon[]>([]);
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pokemonsPerPage = 12;

    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // Chargement des favoris depuis l'API avec gestion des erreurs
    useEffect(() => {
        async function loadFavorites() {
            if (session?.user?.id) {
                setLoading(true);
                setError(null); // Réinitialiser l'erreur avant de charger
                try {
                    const userFavorites = await fetchFavorites(session.user.id);
                    // Trier les favoris par ID
                    const sortedFavorites = userFavorites.sort((a, b) => a.id - b.id);
                    setFavorites(sortedFavorites);
                    setFilteredPokemon(sortedFavorites);
                } catch (err: any) {
                    console.error("Erreur lors du chargement des favoris :", err);
                    setError("Erreur lors du chargement des favoris. Veuillez réessayer.");
                } finally {
                    setLoading(false);
                }
            }
        }

        loadFavorites();
    }, [session]);

    // Mise à jour du filtrage quand favorites, searchTerm ou selectedTypes changent
    useEffect(() => {
        setFilteredPokemon(filterPokemon(favorites, searchTerm, selectedTypes));
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

    // Si l'utilisateur n'est pas connecté, afficher le composant NotConnected
    if (!session) {
        return <NotConnected />;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">⭐ Mes Pokémon Favoris</h2>

            {/* Affichage du loader ou d'une erreur si elle est présente */}
            {loading ? (
                <div className="text-center">
                    <div className="loader"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <>
                    {/* Recherche et filtrage */}
                    <SearchBar onSearchChange={handleSearchChange} onTypeChange={handleTypeChange} />

                    {/* Affichage des Pokémon */}
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
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                    {/* Modal d'affichage du Pokémon sélectionné */}
                    {selectedPokemon && (
                        <PokemonModal pokemon={selectedPokemon} onCloseAction={() => setSelectedPokemon(null)} />
                    )}
                </>
            )}
        </div>
    );
}