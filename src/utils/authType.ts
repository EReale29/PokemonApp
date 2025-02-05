export interface Account {
    provider: string;
    type: string;
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
}

export interface User {
    id?: string; // Ajouté pour correspondre à l'ID du token
    email: string;
    name?: string;
    image?: string;
    providerId: string;
    createdAt: Date;
    uid: string;
}