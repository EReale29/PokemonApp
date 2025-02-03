// src/lib/firestoreEquipe.ts

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Pokemon } from "@/utils/types";

// Ajouter un Pokémon à l'équipe
export const addEquipe = async (pokemon: Pokemon, userId: string) => {
    const equipeRef = collection(db, "equipe", userId, "pokemons");
    const equipeData = await getEquipe(userId);

    if (equipeData.length >= 6) {
        throw new Error("L'équipe ne peut pas contenir plus de 6 Pokémon.");
    }

    // Ajouter le Pokémon à l'équipe
    await setDoc(doc(equipeRef, pokemon.id.toString()), {
        id: pokemon.id,
        nickname: pokemon.nickname || pokemon.name, // Si `pokemon.nickname` existe, on l'utilise, sinon on utilise `pokemon.name`
        name: pokemon.name,
        image: pokemon.image,
    });
};

// Retirer un Pokémon de l'équipe
export const removeEquipe = async (pokemonId: number, userId: string) => {
    const docRef = doc(db, "equipe", userId, "pokemons", pokemonId.toString());
    await deleteDoc(docRef);
};

export const updateEquipe = async (pokemon: Pokemon, id: string) => {
    removeEquipe(pokemon.id, id);
    addEquipe(pokemon, id);
}


// Récupérer l'équipe de Pokémon
export const getEquipe = async (userId: string): Promise<Pokemon[]> => {
    const pokemonsRef = collection(db, "equipe", userId, "pokemons");
    const snapshot = await getDocs(pokemonsRef);
    const equipe: Pokemon[] = [];
    snapshot.forEach(doc => {
        equipe.push(doc.data() as Pokemon);
    });
    return equipe;
};