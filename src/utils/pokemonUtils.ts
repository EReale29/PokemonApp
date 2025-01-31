import { Pokemon } from "@/utils/types";
import { addFavorite, removeFavorite, getFavorites } from "@/lib/firebaseFavorites";  // Import des fonctions Firestore
import { addEquipe, removeEquipe, getEquipe } from "@/lib/firebaseEquipe";  // Import des fonctions Firestore

// ✅ Filtrage des Pokémon
export const filterPokemon = (
    pokemonList: Pokemon[],
    searchTerm: string,
    selectedTypes: string[]
): Pokemon[] => {
    let filtered = pokemonList;

    // Filtrage par nom
    if (searchTerm) {
        filtered = filtered.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filtrage par types sélectionnés
    if (selectedTypes.length > 0) {
        filtered = filtered.filter(pokemon =>
            pokemon.apiTypes.some(type => selectedTypes.includes(type.name))
        );
    }

    return filtered;
};

// ✅ Ajouter ou enlever un favori
export const handleFavoriteClick = async (
    pokemon: Pokemon,
    favorites: Pokemon[],
    setFavorites: React.Dispatch<React.SetStateAction<Pokemon[]>>,
    session: { user?: { id?: string } } | null  // Gérer session qui peut être null
) => {

    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter un favori !");
        return;
    }

    if (favorites.some((fav) => fav.id === pokemon.id)) {
        // Retirer du favori Firestore
        await removeFavorite(pokemon.id, session.user.id);
        setFavorites(favorites.filter((fav) => fav.id !== pokemon.id)); // Retirer du favori local
    } else {
        // Ajouter au favori Firestore
        await addFavorite(pokemon, session.user.id);
        setFavorites([...favorites, pokemon]); // Ajouter au favori local
    }
};

// ✅ Ajouter un Pokémon à l'équipe
export const handleEquipeClick = async (
    pokemon: Pokemon,
    equipe: Pokemon[],
    setEquipe: React.Dispatch<React.SetStateAction<Pokemon[]>>,
    session: { user?: { id?: string } } | null  // Gérer session qui peut être null
) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter un Pokémon à votre équipe !");
        return;
    }

    // Vérification si l'utilisateur a déjà 6 Pokémon dans son équipe
    if (equipe.length >= 6) {
        alert("Vous ne pouvez avoir que 6 Pokémon dans votre équipe.");
        return;
    }

    // Ajouter le Pokémon à l'équipe Firestore
    await addEquipe(pokemon, session.user.id);
    setEquipe([...equipe, pokemon]); // Ajouter à l'équipe locale
};

// ✅ Retirer un Pokémon de l'équipe
export const handleRemoveEquipe = async (
    pokemon: Pokemon,
    equipe: Pokemon[],
    setEquipe: React.Dispatch<React.SetStateAction<Pokemon[]>>,
    session: { user?: { id?: string } } | null  // Gérer session qui peut être null
) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour retirer un Pokémon de votre équipe !");
        return;
    }

    // Retirer le Pokémon de l'équipe Firestore
    await removeEquipe(pokemon.id, session.user.id);
    setEquipe(equipe.filter((poke) => poke.id !== pokemon.id)); // Retirer de l'équipe locale
};

// ✅ Changer de page (gestion de la pagination)
export const changePage = (
    pageNumber: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};

// ✅ Récupérer les favoris depuis Firestore
export const fetchFavorites = async (userId: string): Promise<Pokemon[]> => {
    console.log(userId);
    const favorites = await getFavorites(userId);
    console.log(favorites);
    return favorites;
};

// ✅ Récupérer l'équipe depuis Firestore
export const fetchEquipe = async (userId: string): Promise<Pokemon[]> => {
    const equipe = await getEquipe(userId);
    return equipe;

};