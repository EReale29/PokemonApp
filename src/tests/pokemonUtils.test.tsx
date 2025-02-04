// Mocker les modules pour éviter les appels réels vers Firestore et le cache
jest.mock("@/lib/firebaseFavorites", () => ({
    addFavorite: jest.fn(),
    deleteFavorite: jest.fn(),
    getFavorites: jest.fn(),
}));
jest.mock("@/lib/firebaseEquipe", () => ({
    addEquipe: jest.fn(),
    deleteEquipe: jest.fn(),
    getEquipe: jest.fn(),
}));
jest.mock("@/lib/cache", () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
}));

import { fetchFavorites, fetchEquipe, filterPokemon, changePage } from "@/utils/pokemonUtils";
import { getFavorites } from "@/lib/firebaseFavorites";
import { getEquipe } from "@/lib/firebaseEquipe";
import cache from "@/lib/cache";
import { Pokemon } from "@/utils/types";

describe("filterPokemon", () => {
    const samplePokemon: Pokemon[] = [
        {
            id: 1,
            name: "Bulbizarre",
            image: "https://example.com/bulbizarre.png",
            apiTypes: [{ name: "Grass" }, { name: "Poison" }],
            stats: { HP: 45, attack: 49, defense: 49, speed: 45 },
        },
        {
            id: 2,
            name: "Salamèche",
            image: "https://example.com/salamèche.png",
            apiTypes: [{ name: "Fire" }],
            stats: { HP: 39, attack: 52, defense: 43, speed: 65 },
        },
        {
            id: 3,
            name: "Carapuce",
            image: "https://example.com/carapuce.png",
            apiTypes: [{ name: "Water" }],
            stats: { HP: 44, attack: 48, defense: 65, speed: 43 },
        },
    ];

    it("filtre par nom", () => {
        const result = filterPokemon(samplePokemon, "sala", []);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Salamèche");
    });

    it("filtre par type", () => {
        const result = filterPokemon(samplePokemon, "", ["Fire"]);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Salamèche");
    });

    it("filtre par nom et type", () => {
        const result = filterPokemon(samplePokemon, "car", ["Water"]);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Carapuce");
    });

    it("retourne la liste complète si aucun filtre n'est appliqué", () => {
        const result = filterPokemon(samplePokemon, "", []);
        expect(result).toHaveLength(3);
    });
});

describe("changePage", () => {
    it("change la page si le numéro est valide", () => {
        const setCurrentPage = jest.fn();
        changePage(3, setCurrentPage, 5);
        expect(setCurrentPage).toHaveBeenCalledWith(3);
    });

    it("ne change pas la page si le numéro est inférieur à 1", () => {
        const setCurrentPage = jest.fn();
        changePage(0, setCurrentPage, 5);
        expect(setCurrentPage).not.toHaveBeenCalled();
    });

    it("ne change pas la page si le numéro est supérieur au totalPages", () => {
        const setCurrentPage = jest.fn();
        changePage(6, setCurrentPage, 5);
        expect(setCurrentPage).not.toHaveBeenCalled();
    });
});

describe("fetchFavorites", () => {
    const userId = "user1";
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("retourne les favoris depuis le cache s'ils existent", async () => {
        const fakeFavorites: Pokemon[] = [{ id: 1, name: "Bulbizarre", image: "url", apiTypes: [], stats: { HP: 45, attack: 49, defense: 49, speed: 45 } }];
        (cache.get as jest.Mock).mockReturnValue(fakeFavorites);
        const result = await fetchFavorites(userId);
        expect(result).toEqual(fakeFavorites);
        expect(cache.get).toHaveBeenCalledWith(`favorites-${userId}`);
    });

    it("récupère les favoris via getFavorites s'ils ne sont pas dans le cache", async () => {
        (cache.get as jest.Mock).mockReturnValue(null);
        const fakeFavorites: Pokemon[] = [{ id: 2, name: "Salamèche", image: "url", apiTypes: [], stats: { HP: 39, attack: 52, defense: 43, speed: 65 } }];
        (getFavorites as jest.Mock).mockResolvedValue(fakeFavorites);
        const result = await fetchFavorites(userId);
        expect(result).toEqual(fakeFavorites);
        expect(cache.set).toHaveBeenCalledWith(`favorites-${userId}`, fakeFavorites);
    });

    it("relance une erreur en cas d'échec de getFavorites", async () => {
        (cache.get as jest.Mock).mockReturnValue(null);
        (getFavorites as jest.Mock).mockRejectedValue(new Error("Erreur"));
        await expect(fetchFavorites(userId)).rejects.toThrow("Erreur");
    });
});

describe("fetchEquipe", () => {
    const userId = "user1";
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("retourne l'équipe depuis le cache s'ils existent", async () => {
        const fakeEquipe: Pokemon[] = [{ id: 3, name: "Carapuce", image: "url", apiTypes: [], stats: { HP: 44, attack: 48, defense: 65, speed: 43 } }];
        (cache.get as jest.Mock).mockReturnValue(fakeEquipe);
        const result = await fetchEquipe(userId);
        expect(result).toEqual(fakeEquipe);
        expect(cache.get).toHaveBeenCalledWith(`equipe-${userId}`);
    });

    it("récupère l'équipe via getEquipe s'ils ne sont pas dans le cache", async () => {
        (cache.get as jest.Mock).mockReturnValue(null);
        const fakeEquipe: Pokemon[] = [{ id: 3, name: "Carapuce", image: "url", apiTypes: [], stats: { HP: 44, attack: 48, defense: 65, speed: 43 } }];
        (getEquipe as jest.Mock).mockResolvedValue(fakeEquipe);
        const result = await fetchEquipe(userId);
        expect(result).toEqual(fakeEquipe);
        expect(cache.set).toHaveBeenCalledWith(`equipe-${userId}`, fakeEquipe);
    });

    it("relance une erreur en cas d'échec de getEquipe", async () => {
        (cache.get as jest.Mock).mockReturnValue(null);
        (getEquipe as jest.Mock).mockRejectedValue(new Error("Erreur"));
        await expect(fetchEquipe(userId)).rejects.toThrow("Erreur");
    });
});