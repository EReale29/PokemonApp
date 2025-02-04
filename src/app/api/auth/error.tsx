'use client';

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="container mt-5">
            <h1 className="text-center">Erreur de Connexion</h1>
            <p className="text-center">
                {error || "Une erreur inconnue est survenue. Veuillez réessayer ultérieurement."}
            </p>
        </div>
    );
};

export default ErrorPage;