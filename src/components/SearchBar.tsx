import React, { useState } from "react";
import { pokemonTypes, typeBadges } from "@/utils/types"; // Import des types

interface SearchBarProps {
    onSearchChange: (searchTerm: string) => void;
    onTypeChange: (selectedTypes: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, onTypeChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Gérer la recherche
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        onSearchChange(newSearchTerm); // Passer la valeur au parent
    };

    // Gérer le changement de type
    const handleTypeChange = (type: string) => {
        const newSelectedTypes = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(newSelectedTypes);
        onTypeChange(newSelectedTypes); // Passer la sélection au parent
    };

    return (
        <div className="d-flex justify-content-center gap-3 mb-3">
            {/* Champ de recherche */}
            <input
                type="text"
                className="form-control w-50"
                placeholder="Rechercher un Pokémon..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {/* Dropdown pour filtrer par type avec checkboxes */}
            <div className="dropdown">
                <button
                    className="btn btn-light dropdown-toggle"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen ? "true" : "false"}
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
                                <label
                                    className={`form-check-label badge ${
                                        typeBadges[type] || "bg-secondary text-white"
                                    }`}
                                    htmlFor={`type-${type}`}
                                >
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;