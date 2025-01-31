// src/lib/firestoreFavorite.ts

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Pokemon } from "@/utils/types";

// Ajouter un favori
export const addFavorite = async (pokemon: Pokemon, userId: string) => {
    const docRef = doc(db, "favorites", userId, "pokemons", pokemon.id.toString());
    await setDoc(docRef, {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
    });
};

// Retirer un favori
export const removeFavorite = async (pokemonId: number, userId: string) => {
    const docRef = doc(db, "favorites", userId, "pokemons", pokemonId.toString());
    await deleteDoc(docRef);
};

// Récupérer les favoris
export const getFavorites = async (userId: string): Promise<Pokemon[]> => {
    const pokemonsRef = collection(db, "favorites", userId, "pokemons");
    const snapshot = await getDocs(pokemonsRef);
    const favorites: Pokemon[] = [];
    snapshot.forEach(doc => {
        favorites.push(doc.data() as Pokemon);
    });
    return favorites;
};