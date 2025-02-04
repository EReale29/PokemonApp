// src/utils/pokemonUtils.ts
import { Pokemon } from "@/utils/types";
import cache from "@/lib/cache";
import { addFavorite, deleteFavorite, getFavorites } from "@/lib/firebaseFavorites";
import { addEquipe, deleteEquipe, getEquipe } from "@/lib/firebaseEquipe";

export const filterPokemon = (
    pokemonList: Pokemon[],
    searchTerm: string,
    selectedTypes: string[]
): Pokemon[] => {

    let filtered = pokemonList;

    // Filtrage par nom
    if (searchTerm) {
        filtered = filtered.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filtrage par types sélectionnés
    if (selectedTypes.length > 0) {
        filtered = filtered.filter((pokemon) =>
            pokemon.apiTypes.some((type) => selectedTypes.includes(type.name)) // Vérifie si le Pokémon a un type dans selectedTypes
        );
    }

    // Tri par ID
    filtered = filtered.sort((a, b) => a.id - b.id);

    return filtered;
};

export const handleFavoriteClick = async (pokemon: Pokemon, favorites: Pokemon[], setFavorites: React.Dispatch<React.SetStateAction<Pokemon[]>>, session: { user?: { id?: string } } | null) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter un favori !");
        return;
    }
    if (favorites.some((fav) => fav.id === pokemon.id)) {
        await deleteFavorite(pokemon.id, session.user.id);
        setFavorites(favorites.filter((fav) => fav.id !== pokemon.id));
    } else {
        await addFavorite(pokemon, session.user.id);
        setFavorites([...favorites, pokemon]);
    }
};

export const changePage = (
    pageNumber: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};

export const handleEquipeClick = async (
    pokemon: Pokemon,
    equipe: Pokemon[], // L'équipe actuelle
    setEquipe: React.Dispatch<React.SetStateAction<Pokemon[]>>, // Fonction pour mettre à jour l'état de l'équipe
    session: { user?: { id?: string } } | null // Données de session
) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter à l'équipe !");
        return;
    }
    if (equipe.some((p) => p.id === pokemon.id)) {
        // Si le Pokémon est déjà dans l'équipe, on le retire
        await deleteEquipe(pokemon.id, session.user.id);
        setEquipe(equipe.filter((p) => p.id !== pokemon.id));
    } else {
        if (equipe.length === 6) {
            alert("Vous ne pouvez avoir que 6 pokemon dans l'equipe !");
            return;
        }
        // Si le Pokémon n'est pas dans l'équipe, on l'ajoute
        await addEquipe(pokemon, session.user.id);
        setEquipe([...equipe, pokemon]);
    }
};

export const fetchFavorites = async (userId: string): Promise<Pokemon[]> => {
    const cacheKey = `favorites-${userId}`;

    // Vérifier si des données sont déjà en cache
    const cachedEquipe = cache.get<Pokemon[]>(cacheKey);
    if (cachedEquipe) {
        return cachedEquipe;
    }
    const favorites = await getFavorites(userId);
    // Stocker le résultat dans le cache
    cache.set(cacheKey, favorites);
    return favorites;
};

export const fetchEquipe = async (userId: string): Promise<Pokemon[]> => {
    const cacheKey = `equipe-${userId}`;

    // Vérifier si des données sont déjà en cache
    const cachedEquipe = cache.get<Pokemon[]>(cacheKey);
    if (cachedEquipe) {
        return cachedEquipe;
    }
    const equipe = await getEquipe(userId);
    // Stocker le résultat dans le cache
    cache.set(cacheKey, equipe);
    return equipe;
};