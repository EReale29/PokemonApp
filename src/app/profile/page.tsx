// app/profile/page.tsx
"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { useSession } from "next-auth/react";
import NotConnected from "@/components/NotConnected";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Gestion du changement de fichier
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // Fonction pour simuler l'upload de la photo de profil (à remplacer par ta logique réelle)
    const handleUploadPhoto = async () => {
        if (!selectedFile) return;
        setUpdating(true);
        try {
            // Simulation d'un upload (par exemple, vers Firebase Storage)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setMessage("Photo de profil mise à jour avec succès !");
            // Ici, tu mettrais à jour la photo de profil dans la base de données et/ou le contexte
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de la mise à jour de la photo de profil.");
        } finally {
            setUpdating(false);
        }
    };

    // Déclenche l'ouverture de l'input fichier caché
    const handlePencilClick = () => {
        fileInputRef.current?.click();
    };

    if (!session) {
        return <NotConnected />;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mon Profil</h2>

            <div className="card shadow p-4">
                <div className="d-flex align-items-center mb-4 position-relative">
                    <img
                        src={session.user?.image || "https://via.placeholder.com/150"}
                        alt="Photo de profil"
                        className="rounded-circle me-3"
                        style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                        }}
                    />
                    <div>
                        <h3>{session.user?.name}</h3>
                        <p className="text-muted">{session.user?.email}</p>
                    </div>
                </div>
                <hr />
                {/* Input fichier caché */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="d-none"
                    onChange={handleFileChange}
                />
                {previewUrl && (
                    <div className="mb-3">
                        <p>Aperçu de la nouvelle photo :</p>
                        <img
                            src={previewUrl}
                            alt="Aperçu"
                            className="img-thumbnail"
                            style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                )}
                {previewUrl && (
                    <button
                        className="btn btn-primary"
                        onClick={handleUploadPhoto}
                        disabled={updating || !selectedFile}
                    >
                        {updating ? "Mise à jour..." : "Mettre à jour la photo"}
                    </button>
                )}
                {message && <p className="mt-2">{message}</p>}
            </div>
        </div>
    );
}