export const pokemonTypes = [
    "Tous", "Feu", "Eau", "Plante", "Électrik", "Glace", "Combat",
    "Poison", "Sol", "Vol", "Psy", "Insecte", "Roche", "Spectre",
    "Dragon", "Ténèbres", "Acier", "Fée"
];

export const typeBadges: { [key: string]: string } = {
    "Feu": "bg-danger text-white",
    "Eau": "bg-primary text-white",
    "Plante": "bg-success text-white",
    "Électrik": "bg-warning text-dark",
    "Glace": "bg-info text-dark",
    "Combat": "bg-danger text-white",
    "Poison": "bg-purple text-white",
    "Sol": "bg-brown text-white",
    "Vol": "bg-light text-dark",
    "Psy": "bg-pink text-dark",
    "Insecte": "bg-success text-white",
    "Roche": "bg-secondary text-white",
    "Spectre": "bg-dark text-white",
    "Dragon": "bg-dark text-white",
    "Ténèbres": "bg-dark text-white",
    "Acier": "bg-secondary text-white",
    "Fée": "bg-pink text-dark",
    "Tous": "bg-secondary text-white"
};


// Type représentant les types des Pokémon (ex : Feu, Eau, Plante, etc.)
export interface PokemonType {
    name: string;
}

// Type représentant les statistiques d'un Pokémon
export interface PokemonStats {
    HP: number;      // Points de vie
    attack: number;  // Attaque
    defense: number; // Défense
    speed: number;   // Vitesse
}

// Type représentant un Pokémon avec ses propriétés
export interface Pokemon {
    id: number;            // Identifiant unique du Pokémon
    name: string;          // Nom du Pokémon
    image: string;         // URL de l'image du Pokémon
    apiTypes: PokemonType[];  // Types du Pokémon (ex : "Feu", "Eau", etc.)
    stats: PokemonStats;     // Statistiques du Pokémon
    nickname?: string;       // Surnom du pokemon
}

// Définition du type pour un favori, qui associe un Pokémon à un utilisateur
export type Favorite = {
    id: string;      // Identifiant unique du favori
    pokemon: Pokemon; // Pokémon associé au favori
    userId: string;   // Identifiant de l'utilisateur qui a ajouté ce Pokémon aux favoris
};

// Propriétés nécessaires pour le composant PokemonCard
export interface PokemonCardProps {
    pokemon: Pokemon;         // Pokémon à afficher
    onFavoriteClick: () => void;  // Fonction appelée lors du clic sur l'icône de favori
    onCardClick: () => void;      // Fonction appelée lors du clic sur la carte pour afficher les détails du Pokémon
}