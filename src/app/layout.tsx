import { Metadata } from "next";
import AuthSessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata: Metadata = {
    title: "Pokémon App",
    description: "Liste des Pokémon avec Next.js et PokéBuild API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <AuthSessionProvider>
            <Navbar />
            <main>{children}</main>
        </AuthSessionProvider>
        </body>
        </html>
    );
}