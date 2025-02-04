"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Pokemon } from "@/utils/types";
import { fetchFavorites, fetchEquipe } from "@/utils/pokemonUtils";

interface UserDataContextType {
    favorites: Pokemon[];
    team: Pokemon[];
    reloadFavorites: () => Promise<void>;
    reloadTeam: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState<Pokemon[]>([]);
    const [team, setTeam] = useState<Pokemon[]>([]);

    // Fonction pour charger les favoris
    const reloadFavorites = useCallback(async () => {
        if (session?.user?.id) {
            try {
                const favs = await fetchFavorites(session.user.id);
                setFavorites(favs);
            } catch (error) {
                console.error("Erreur lors du chargement des favoris :", error);
            }
        }
    }, [session]);

    // Fonction pour charger l'équipe
    const reloadTeam = useCallback(async () => {
        if (session?.user?.id) {
            try {
                const eq = await fetchEquipe(session.user.id);
                setTeam(eq);
            } catch (error) {
                console.error("Erreur lors du chargement de l'équipe :", error);
            }
        }
    }, [session]);

    // Lorsqu'une session est présente, charger les données une fois au montage ou lors du changement de session
    useEffect(() => {
        if (session?.user?.id) {
            reloadFavorites();
            reloadTeam();
        } else {
            // Si l'utilisateur se déconnecte, on réinitialise les données
            setFavorites([]);
            setTeam([]);
        }
    }, [session, reloadFavorites, reloadTeam]);

    return (
        <UserDataContext.Provider value={{ favorites, team, reloadFavorites, reloadTeam }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = (): UserDataContextType => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
};