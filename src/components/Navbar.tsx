"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const [darkMode, setDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false); // ✅ Ajout du state pour le modal

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

        if (newMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-danger"} border-bottom border-black shadow`}>
                <div className="container">
                    <Link className="navbar-brand fw-bold" href="/">
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                            alt="Pokémon Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top me-2"
                        />
                        Pokémon App
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/">Accueil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/favorites">Favoris</Link>
                            </li>
                        </ul>

                        {/* ✅ Toggle Mode Sombre */}
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
                            {session ? (
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
                                    <button className="btn btn-primary mb-2 w-100" onClick={() => { signIn("google"); setShowModal(false); }}>
                                        Connexion avec Google
                                    </button>
                                    <button className="btn btn-dark w-100" onClick={() => { signIn("github"); setShowModal(false); }}>
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