"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"; // Utilisation de NextAuth pour l'authentification

export default function Navbar() {
    const { data: session, status } = useSession(); // Récupérer la session
    const [darkMode, setDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false); // Contrôle de la modale de connexion
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode === "true") {
            document.documentElement.setAttribute("data-bs-theme", "dark");
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        document.documentElement.setAttribute("data-bs-theme", newMode ? "dark" : "light");
    };

    // Fonction asynchrone pour gérer la connexion avec un provider
    const handleSignIn = async (provider: string) => {
        setErrorMessage(null);
        try {
            await signIn(provider, { callbackUrl: window.location.href });
            setShowModal(false);
        } catch (error: any) {
            console.error("Erreur lors de la connexion :", error);
            setErrorMessage("Une erreur est survenue lors de la connexion.");
        }
    };

    // Fonction asynchrone pour gérer la déconnexion
    const handleSignOut = async () => {
        setErrorMessage(null);
        try {
            await signOut();
        } catch (error: any) {
            console.error("Erreur lors de la déconnexion :", error);
            setErrorMessage("Une erreur est survenue lors de la déconnexion.");
        }
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-danger"} border-bottom border-black shadow`}>
                <div className="container">
                    <Link className="navbar-brand fw-bold" href="/">Pokémon App</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item"><Link className="nav-link" href="/">Accueil</Link></li>
                            <li className="nav-item"><Link className="nav-link" href="/favorites">Favoris</Link></li>
                            <li className="nav-item"><Link className="nav-link" href="/contact">Nous Contacter</Link></li>
                        </ul>

                        {/* Toggle Mode Sombre */}
                        <div className="form-check form-switch me-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="darkModeSwitch"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                            />
                            <label className="form-check-label" htmlFor="darkModeSwitch">
                                {darkMode ? "🌙" : "☀️"}
                            </label>
                        </div>

                        {/* Authentification */}
                        <div className="d-flex">
                            {status === "loading" ? (
                                <span>Chargement...</span>
                            ) : session ? (
                                <div className="nav-item dropdown">
                                    <button className="btn btn-light dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {session.user?.name || "Profil"}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li className="dropdown-item"><Link className="nav-link" href="/profile">Mon Profil</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li className="dropdown-item"><Link className="nav-link" href="/team">Mon Équipe</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li className="dropdown-item"><Link className="nav-link" href="/favorites">Favoris</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li className="dropdown-item">
                                            <button className="btn btn-link" onClick={handleSignOut}>Déconnexion</button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <button className="btn btn-light" onClick={() => setShowModal(true)}>
                                    Se connecter
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Affichage d'un éventuel message d'erreur */}
            {errorMessage && (
                <div className="container mt-2">
                    <div className="alert alert-danger text-center">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Modale de connexion */}
            {showModal && (
                <>
                    {/* Fond semi-transparent */}
                    <div className="modal-backdrop fade show"></div>

                    {/* Fenêtre du modal */}
                    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Se connecter</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body text-center">
                                    <p>Choisissez une méthode de connexion :</p>
                                    <button className="btn btn-primary mb-2 w-100" onClick={() => handleSignIn("google")}>
                                        Connexion avec Google
                                    </button>
                                    <button className="btn btn-dark w-100" onClick={() => handleSignIn("github")}>
                                        Connexion avec GitHub
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}