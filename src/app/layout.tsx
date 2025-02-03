"use client";

import { SessionProvider } from "next-auth/react"; // Import de SessionProvider
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import du bundle JS de Bootstrap

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <SessionProvider>
            <Navbar />
            <main>{children}</main>
        </SessionProvider>
        </body>
        </html>
    );
}