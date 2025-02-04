import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Pokemon } from "@/utils/types";
import cache from "@/lib/cache";

// Ajouter un favori
export const addFavorite = async (pokemon: Pokemon, userId: string) => {
    try {
        const docRef = doc(db, "favorites", userId, "pokemons", pokemon.id.toString());
        await setDoc(docRef, {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
            apiTypes: pokemon.apiTypes,
            stats: pokemon.stats,
        });
        const cacheKey = `favorites-${userId}`;
        cache.del(cacheKey);
    } catch (error) {
        console.error("Erreur lors de l'ajout du favori :", error);
        throw error;
    }
};

// Retirer un favori
export const deleteFavorite = async (pokemonId: number, userId: string) => {
    try {
        const docRef = doc(db, "favorites", userId, "pokemons", pokemonId.toString());
        await deleteDoc(docRef);
        const cacheKey = `favorites-${userId}`;
        cache.del(cacheKey);
    } catch (error) {
        console.error("Erreur lors de la suppression du favori :", error);
        throw error;
    }
};

// Récupérer les favoris
export const getFavorites = async (userId: string): Promise<Pokemon[]> => {
    try {
        const pokemonsRef = collection(db, "favorites", userId, "pokemons");
        const snapshot = await getDocs(pokemonsRef);
        const favorites: Pokemon[] = [];
        snapshot.forEach((docSnap) => {
            favorites.push(docSnap.data() as Pokemon);
        });
        return favorites;
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        throw error;
    }
};