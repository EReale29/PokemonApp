"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard"; // Import de votre composant PokemonCard
import PokemonModal from "@/components/PokemonModal"; // Import du modal
import { fetchPokemonList } from "@/utils/api";
import { Pokemon } from "@/utils/types"; // ✅ Import des types et badges
import { useSession } from "next-auth/react"; // Pour vérifier la session de l'utilisateur
import { filterPokemon, handleFavoriteClick, changePage } from "@/utils/pokemonUtils"; // ✅
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export default function HomePage() {
    const { data: session } = useSession(); // Vérification de la session de l'utilisateur
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Liste des Pokémon
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]); // Pokémon filtrés
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null); // Pokémon sélectionné pour afficher ses détails
    const [favorites, setFavorites] = useState<Pokemon[]>([]); // Liste des favoris
    const [currentPage, setCurrentPage] = useState(1); // Page courante pour la pagination
    const [searchTerm] = useState(""); // Terme de recherche
    const [selectedTypes] = useState<string[]>([]); // Types sélectionnés pour filtrer
    const [loading, setLoading] = useState(true); // État de chargement
    const pokemonsPerPage = 12; // Nombre de pokémons par page
    // Calcul des pages pour la pagination
    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // Gérer la recherche
    const handleSearchChange = (searchTerm: string) => {
        const filtered = filterPokemon(pokemonList, searchTerm, []);
        setFilteredPokemon(filtered);
        setCurrentPage(1); // Réinitialiser la page après une recherche
    };

    // Gérer le changement de types
    const handleTypeChange = (selectedTypes: string[]) => {
        const filtered = filterPokemon(pokemonList, "", selectedTypes);
        setFilteredPokemon(filtered);
        setCurrentPage(1); // Réinitialiser la page après un changement de type
    };

    // Fonction pour charger les Pokémon
    useEffect(() => {
        async function loadPokemon() {
            try {
                setLoading(true); // Lancer le chargement
                const data = await fetchPokemonList(); // Charger les données des Pokémon
                setPokemonList(data); // Mettre à jour la liste des Pokémon
                setFilteredPokemon(data); // Mettre à jour les Pokémon filtrés
            } catch (error) {
                console.error("Erreur lors du chargement des Pokémon:", error);
            } finally {
                setLoading(false); // Fin du chargement
            }
        }

        loadPokemon(); // Appel de la fonction pour charger les Pokémon
    }, []);



    // Filtrage des Pokémon en fonction du nom et des types
    useEffect(() => {
        const filtered = filterPokemon(pokemonList, searchTerm, selectedTypes); // Utilisation de la fonction utilitaire
        setFilteredPokemon(filtered); // Mettre à jour les Pokémon filtrés
        setCurrentPage(1); // Réinitialiser la page après filtrage
    }, [searchTerm, selectedTypes, pokemonList]);



    return (
        <div className="container mt-4">
            <h1 className="text-center title mb-4">Liste des Pokémon</h1>

            {/* Affichage du loader pendant le chargement */}
            {loading ? (
                <div className="text-center">
                    {/* Vous pouvez ajouter un spinner ici */}
                    <div className="loader"></div>
                    <p>Chargement des Pokémon...</p>
                </div>
            ) : (
                <>
                    {/* Barre de recherche et filtrage */}
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

                    {/* ✅ Pagination avec Dropdown */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>

                    {/* ✅ Affichage du modal si un Pokémon est sélectionné */}
                    {selectedPokemon && <PokemonModal pokemon={selectedPokemon} onCloseAction={() => setSelectedPokemon(null)} />}
                </>
            )}
        </div>
    );
}