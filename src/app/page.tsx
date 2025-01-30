"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import PokemonModal from "@/components/PokemonModal";
import { fetchPokemonList } from "@/utils/api";
import { pokemonTypes, typeBadges } from "@/utils/types"; // ✅ Import des types et badges

export default function HomePage() {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // 🔎 Recherche par nom
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // 🔥 Filtrage multi-types
    const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ Gère l'ouverture du menu de filtrage
    const [pageDropdownOpen, setPageDropdownOpen] = useState(false); // ✅ Gère l'ouverture du menu de pagination
    const pokemonsPerPage = 12; // ✅ Nombre de Pokémon par page

    useEffect(() => {
        async function loadPokemon() {
            try {
                const data = await fetchPokemonList();
                setPokemonList(data);
                setFilteredPokemon(data);
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
        let filtered = pokemonList;

        if (searchTerm) {
            filtered = filtered.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(pokemon =>
                pokemon.apiTypes.some(type => selectedTypes.includes(type.name))
            );
        }

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
    const changePage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageDropdownOpen(false); // ✅ Fermer le dropdown après sélection
        }
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
                    currentPokemons.map((pokemon: any) => (
                        <div key={pokemon.id} className="col-md-3">
                            <PokemonCard pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon)} />
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
                        {/* Bouton Précédent */}
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => changePage(currentPage - 1)}>
                                Précédent
                            </button>
                        </li>

                        {/* ✅ Dropdown de pagination qui s'ouvre vers le haut */}
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
                                                onClick={() => changePage(i + 1)}
                                            >
                                                Page {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {/* Bouton Suivant */}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => changePage(currentPage + 1)}>
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