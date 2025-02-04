import cache from "@/lib/cache";

export async function fetchPokemonList() {
    const cacheKey = "pokemonList";

    // Vérifier si la liste est déjà en cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log("Retour de la liste des Pokémon depuis le cache");
        return cachedData;
    }

    try {
        // Faire l'appel API
        const res = await fetch("https://pokebuildapi.fr/api/v1/pokemon");

        // Vérifier le statut de la réponse
        if (!res.ok) {
            throw new Error(`Erreur lors du chargement des Pokémon (HTTP ${res.status})`);
        }

        const data = await res.json();

        // Stocker le résultat dans le cache
        cache.set(cacheKey, data);

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des Pokémon :", error);
        // Propager l'erreur afin que l'appelant puisse également la gérer si nécessaire
        throw error;
    }
}