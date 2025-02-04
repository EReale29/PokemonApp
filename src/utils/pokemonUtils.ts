import { Pokemon } from "@/utils/types";
import cache from "@/lib/cache";
import { addFavorite, deleteFavorite, getFavorites } from "@/lib/firebaseFavorites";
import { addEquipe, deleteEquipe, getEquipe } from "@/lib/firebaseEquipe";

// Filtrer la liste des Pokémon en fonction du terme de recherche et des types sélectionnés
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
            pokemon.apiTypes.some((type) => selectedTypes.includes(type.name))
        );
    }

    // Tri par ID
    filtered = filtered.sort((a, b) => a.id - b.id);

    return filtered;
};

// Gérer le clic sur le bouton favori
export const handleFavoriteClick = async (
    pokemon: Pokemon,
    favorites: Pokemon[],
    setFavorites: React.Dispatch<React.SetStateAction<Pokemon[]>>,
    session: { user?: { id?: string } } | null
) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter un favori !");
        return;
    }
    try {
        if (favorites.some((fav) => fav.id === pokemon.id)) {
            await deleteFavorite(pokemon.id, session.user.id);
            setFavorites(favorites.filter((fav) => fav.id !== pokemon.id));
        } else {
            await addFavorite(pokemon, session.user.id);
            setFavorites([...favorites, pokemon]);
        }
    } catch (error) {
        console.error("Erreur lors de la gestion du favori :", error);
        alert("Erreur lors de la gestion du favori. Veuillez réessayer.");
    }
};

// Changer de page (pour la pagination)
export const changePage = (
    pageNumber: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};

// Gérer l'ajout ou le retrait d'un Pokémon dans l'équipe
export const handleEquipeClick = async (
    pokemon: Pokemon,
    equipe: Pokemon[],
    setEquipe: React.Dispatch<React.SetStateAction<Pokemon[]>>,
    session: { user?: { id?: string } } | null
) => {
    if (!session || !session.user?.id) {
        alert("Veuillez vous connecter pour ajouter à l'équipe !");
        return;
    }
    try {
        if (equipe.some((p) => p.id === pokemon.id)) {
            // Retirer le Pokémon de l'équipe
            await deleteEquipe(pokemon.id, session.user.id);
            setEquipe(equipe.filter((p) => p.id !== pokemon.id));
        } else {
            if (equipe.length === 6) {
                alert("Vous ne pouvez avoir que 6 Pokémon dans l'équipe !");
                return;
            }
            // Ajouter le Pokémon à l'équipe
            await addEquipe(pokemon, session.user.id);
            setEquipe([...equipe, pokemon]);
        }
    } catch (error) {
        console.error("Erreur lors de la gestion de l'équipe :", error);
        alert("Erreur lors de la gestion de l'équipe. Veuillez réessayer.");
    }
};

// Récupérer les favoris
export const fetchFavorites = async (userId: string): Promise<Pokemon[]> => {
    const cacheKey = `favorites-${userId}`;
    // Vérifier si des données sont déjà en cache
    const cachedFavorites = cache.get<Pokemon[]>(cacheKey);
    if (cachedFavorites) {
        return cachedFavorites;
    }
    try {
        const favorites = await getFavorites(userId);
        cache.set(cacheKey, favorites);
        return favorites;
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        throw error;
    }
};

// Récupérer l'équipe de Pokémon
export const fetchEquipe = async (userId: string): Promise<Pokemon[]> => {
    const cacheKey = `equipe-${userId}`;
    // Vérifier si des données sont déjà en cache
    const cachedEquipe = cache.get<Pokemon[]>(cacheKey);
    if (cachedEquipe) {
        return cachedEquipe;
    }
    try {
        const equipe = await getEquipe(userId);
        cache.set(cacheKey, equipe);
        return equipe;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'équipe :", error);
        throw error;
    }
};