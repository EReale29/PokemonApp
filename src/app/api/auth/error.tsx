'use client';
import { useRouter } from 'next/router';

const ErrorPage = () => {
    const router = useRouter();
    const { error } = router.query;

    return (
        <div>
            <h1>Erreur de Connexion</h1>
            <p>{error}</p>
        </div>
    );
};

export default ErrorPage;