"use client";

import React from "react";
import { signIn } from "next-auth/react";

const NotConnected: React.FC = () => {
    return (
        <div className="container mt-5 text-center">
            <h2 className="mb-4">Vous n&apos;êtes pas connecté(e) 😔 </h2>
            <p>Veuillez vous connecter pour avoir accès a la page.</p>
            <button className="btn btn-primary" onClick={() => signIn()}>
                Se connecter
            </button>
        </div>
    );
};

export default NotConnected;