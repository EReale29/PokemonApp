export async function fetchPokemonList() {
    const res = await fetch("https://pokebuildapi.fr/api/v1/pokemon");
    if (!res.ok) throw new Error("Erreur lors du chargement des Pokémon");
    return res.json();
}