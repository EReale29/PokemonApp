import React, { useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false); // Gestion de l'état du dropdown

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
            setDropdownOpen(false); // Ferme le dropdown après une sélection
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState); // Basculer l'état du dropdown
    };

    return (
        totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="Précédent"
                        >
                            Précédent
                        </button>
                    </li>

                    <li className="page-item dropup">
                        <button
                            className="page-link dropdown-toggle"
                            type="button"
                            onClick={toggleDropdown}
                            aria-expanded={dropdownOpen ? "true" : "false"}
                        >
                            Page {currentPage} / {totalPages}
                        </button>
                        {dropdownOpen && (
                            <ul className="dropdown-menu show" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1}>
                                        <button
                                            className={`dropdown-item ${currentPage === i + 1 ? "active" : ""}`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            Page {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Suivant"
                        >
                            Suivant
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
};

export default Pagination;