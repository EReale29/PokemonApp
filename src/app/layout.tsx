"use client";

import { SessionProvider } from "next-auth/react";
import { UserDataProvider } from "@/context/UserDataContext";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="fr">
        <body>
        <SessionProvider>
            <ErrorBoundary>
                <UserDataProvider>
                <Navbar />
                <main>{children}</main>
                </UserDataProvider>
            </ErrorBoundary>
        </SessionProvider>
        </body>
        </html>
    );
}