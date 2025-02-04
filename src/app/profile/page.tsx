"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { useSession } from "next-auth/react";
import NotConnected from "@/components/NotConnected";

export default function ProfilePage() {
    const { data: session } = useSession();

    // Si l'utilisateur n'est pas connecté, on affiche le composant NotConnected
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
            </div>
        </div>
    );
}