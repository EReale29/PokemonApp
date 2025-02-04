"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4">404 - Page non trouvée</h1>
            <p className="lead">Désolé, la page que vous recherchez n'existe pas.</p>
            <Link href="/" className="btn btn-primary">
                Retour à l'accueil
            </Link>
        </div>
    );
}