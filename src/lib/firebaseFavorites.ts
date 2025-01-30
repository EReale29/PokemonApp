import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

// ✅ Ajouter un favori pour un utilisateur
export async function addFavorite(userId: string, pokemon: any) {
    try {
        await addDoc(collection(db, "favorites"), {
            userId,
            pokemon,
        });
    } catch (error) {
        console.error("🔥 Erreur lors de l'ajout du favori :", error);
    }
}

// ✅ Récupérer les favoris d'un utilisateur
export async function getFavorites(userId: string) {
    try {
        const q = query(collection(db, "favorites"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("🔥 Erreur lors de la récupération des favoris :", error);
        return [];
    }
}

// ✅ Supprimer un favori
export async function removeFavorite(favoriteId: string) {
    try {
        await deleteDoc(doc(db, "favorites", favoriteId));
    } catch (error) {
        console.error("🔥 Erreur lors de la suppression du favori :", error);
    }
}