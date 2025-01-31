"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"; // Utilisation de NextAuth pour le signIn et signOut

export default function Navbar() {
    const { data: session, status } = useSession(); // Récupérer les données de session de NextAuth
    const [darkMode, setDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false); // Pour contrôler la modale de connexion

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

    const handleSignIn = (provider: string) => {
        // Appel à NextAuth pour gérer l'authentification via le fournisseur spécifié (Google ou GitHub)
        signIn(provider, { callbackUrl: window.location.href }); // La redirection se fera après la connexion réussie
        setShowModal(false); // Ferme la modale après la connexion
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
                        </ul>

                        {/* ✅ Toggle Mode Sombre */}
                        <div className="form-check form-switch me-4">
                            <input className="form-check-input" type="checkbox" id="darkModeSwitch" checked={darkMode} onChange={toggleDarkMode} />
                            <label className="form-check-label" htmlFor="darkModeSwitch">{darkMode ? "🌙" : "☀️"}</label>
                        </div>

                        {/* ✅ Authentification */}
                        <div className="d-flex">
                            {status === "loading" ? (
                                <span>Chargement...</span>
                            ) : session ? (
                                <>
                                    <span className="navbar-text me-3">Bienvenue, {session.user?.name}!</span>
                                    <button className="btn btn-light" onClick={() => signOut()}>Déconnexion</button>
                                </>
                            ) : (
                                <button className="btn btn-light" onClick={() => setShowModal(true)}>Se connecter</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ✅ Modale de connexion */}
            {showModal && (
                <>
                    {/* ✅ Fond semi-transparent du modal */}
                    <div className="modal-backdrop fade show"></div>

                    {/* ✅ Fenêtre du modal */}
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