import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Pokemon } from "@/utils/types";
import cache from "@/lib/cache";

// Ajouter un Pokémon à l'équipe
export const addEquipe = async (pokemon: Pokemon, userId: string) => {
    try {
        const equipeRef = collection(db, "equipe", userId, "pokemons");
        const equipeData = await getEquipe(userId);

        if (equipeData.length >= 6) {
            throw new Error("L'équipe ne peut pas contenir plus de 6 Pokémon.");
        }

        // Ajouter le Pokémon à l'équipe
        await setDoc(doc(equipeRef, pokemon.id.toString()), {
            id: pokemon.id,
            nickname: pokemon.nickname || pokemon.name, // Utilise le surnom s'il existe, sinon le nom
            name: pokemon.name,
            image: pokemon.image,
        });

        const cacheKey = `equipe-${userId}`;
        cache.del(cacheKey);
    } catch (error) {
        console.error("Erreur dans addEquipe :", error);
        throw error;
    }
};

// Retirer un Pokémon de l'équipe
export const deleteEquipe = async (pokemonId: number, userId: string) => {
    try {
        const docRef = doc(db, "equipe", userId, "pokemons", pokemonId.toString());
        await deleteDoc(docRef);
        const cacheKey = `equipe-${userId}`;
        cache.del(cacheKey);
    } catch (error) {
        console.error("Erreur dans deleteEquipe :", error);
        throw error;
    }
};

// Mettre à jour un Pokémon dans l'équipe
export const updateEquipe = async (pokemon: Pokemon, userId: string) => {
    try {
        const equipeRef = doc(db, "equipe", userId, "pokemons", pokemon.id.toString());
        await setDoc(equipeRef, { ...pokemon }, { merge: true });
        const cacheKey = `equipe-${userId}`;
        cache.del(cacheKey);
    } catch (error) {
        console.error("Erreur dans updateEquipe :", error);
        throw error;
    }
};

// Récupérer l'équipe de Pokémon
export const getEquipe = async (userId: string): Promise<Pokemon[]> => {
    try {
        const pokemonsRef = collection(db, "equipe", userId, "pokemons");
        const snapshot = await getDocs(pokemonsRef);
        const equipe: Pokemon[] = [];
        snapshot.forEach((docSnap) => {
            equipe.push(docSnap.data() as Pokemon);
        });
        return equipe;
    } catch (error) {
        console.error("Erreur dans getEquipe :", error);
        throw error;
    }
};