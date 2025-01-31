"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import PokemonModal from "@/components/PokemonModal";
import { fetchPokemonList } from "@/utils/api";
import { pokemonTypes, typeBadges, Pokemon } from "@/utils/types"; // ✅ Import des types et badges
import { useSession } from "next-auth/react"; // Pour vérifier la session de l'utilisateur
import { filterPokemon, handleFavoriteClick, changePage } from "@/utils/pokemonUtils"; // ✅ Impor

export default function HomePage() {
    const { data: session } = useSession(); // Vérification de la session de l'utilisateur
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Définir le type pour pokemonList
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]); // Définir le type pour filteredPokemon
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null); // Définir le type pour selectedPokemon
    const [favorites, setFavorites] = useState<Pokemon[]>([]); // Ajout des favoris avec le bon type
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
    const pokemonsPerPage = 12;

    useEffect(() => {
        async function loadPokemon() {
            try {
                const data = await fetchPokemonList();
                setPokemonList(data); // Typé correctement
                setFilteredPokemon(data); // Typé correctement
            } catch (error) {
                console.error(error);
            }
        }
        loadPokemon();
    }, []);

    // ✅ Gestion des types sélectionnés
    const handleTypeChange = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // ✅ Filtrage des Pokémon en fonction du nom et des types
    useEffect(() => {
        const filtered = filterPokemon(pokemonList, searchTerm, selectedTypes); // Utilisation de la fonction utilitaire
        setFilteredPokemon(filtered);
        setCurrentPage(1); // ✅ Réinitialiser la page après filtrage
    }, [searchTerm, selectedTypes, pokemonList]);

    // ✅ Toggle Dropdown (Filtrage par types)
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // ✅ Toggle Dropdown (Pagination)
    const togglePageDropdown = () => {
        setPageDropdownOpen(!pageDropdownOpen);
    };

    // ✅ Pagination
    const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);
    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    // ✅ Changer de page
    const changePageHandler = (pageNumber: number) => {
        changePage(pageNumber, setCurrentPage, totalPages); // Utilisation de la fonction utilitaire
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center title mb-4">Liste des Pokémon</h1>

            {/* ✅ Barre de recherche et Filtrage */}
            <div className="d-flex justify-content-center gap-3 mb-3">
                {/* Champ de recherche */}
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Rechercher un Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Dropdown pour filtrer par type avec checkboxes */}
                <div className="dropdown">
                    <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        onClick={toggleDropdown}
                    >
                        Filtrer par type
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu show p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {pokemonTypes.slice(1).map((type) => (
                                <div key={type} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`type-${type}`}
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                    />
                                    <label className={`form-check-label badge ${typeBadges[type] || "bg-secondary text-white"}`} htmlFor={`type-${type}`}>
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Affichage des Pokémon */}
            <div className="row">
                {currentPokemons.length > 0 ? (
                    currentPokemons.map((pokemon: Pokemon) => (
                        <div key={pokemon.id} className="col-md-3">
                            <PokemonCard
                                pokemon={pokemon}
                                onFavoriteClick={() => handleFavoriteClick(pokemon, favorites, setFavorites, session)}  // Pour ajouter/retirer des favoris
                                onCardClick={() => setSelectedPokemon(pokemon)}      // Pour afficher les détails
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center">Aucun Pokémon trouvé</p>
                )}
            </div>

            {/* ✅ Pagination avec Dropdown */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => changePageHandler(currentPage - 1)}>
                                Précédent
                            </button>
                        </li>
                        <li className="page-item dropup">
                            <button
                                className="page-link dropdown-toggle"
                                type="button"
                                onClick={togglePageDropdown}
                            >
                                Page {currentPage} / {totalPages}
                            </button>
                            {pageDropdownOpen && (
                                <ul className="dropdown-menu show" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i + 1}>
                                            <button
                                                className={`dropdown-item ${currentPage === i + 1 ? "active" : ""}`}
                                                onClick={() => changePageHandler(i + 1)}
                                            >
                                                Page {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => changePageHandler(currentPage + 1)}>
                                Suivant
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {/* ✅ Affichage du modal si un Pokémon est sélectionné */}
            {selectedPokemon && <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
        </div>
    );
}