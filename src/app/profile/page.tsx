"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/"); // Redirige si l'utilisateur n'est pas connecté
            return;
        }

        const loadUserData = async () => {
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setDisplayName(docSnap.data().displayName);
                setEmail(docSnap.data().email);
            }
            setLoading(false);
        };

        loadUserData();
    }, [user, router]);

    const handleSave = async () => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { displayName, email }, { merge: true });
        alert("Informations mises à jour !");
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Profil Utilisateur</h2>
            <div className="mb-3">
                <label className="form-label">Nom d'affichage</label>
                <input
                    type="text"
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
                Enregistrer
            </button>
        </div>
    );
}