"use client";

import React, { useState } from "react";

// Fonction de validation simple pour le formulaire
const validateForm = (
    name: string,
    email: string,
    objet: string,
    message: string
) => {
    const errors: { name?: string; email?: string; objet?: string; message?: string } = {};

    if (!name) errors.name = "Le nom est requis";

    // Vérification du format de l'e-mail via une expression régulière
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) {
        errors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
        errors.email = "L'email n'est pas valide";
    }

    if (!objet) errors.objet = "L'objet est requis";
    if (!message) errors.message = "Le message est requis";

    return errors;
};

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        objet: "",
        message: "",
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; objet?: string; message?: string }>({});
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Envoi du formulaire vers notre API avec gestion d'erreur
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Réinitialiser le message d'erreur

        const formErrors = validateForm(formData.name, formData.email, formData.objet, formData.message);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({}); // Réinitialiser les erreurs si le formulaire est valide

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                // Si le serveur renvoie une réponse d'erreur, essayez d'extraire le message d'erreur
                const data = await res.json();
                throw new Error(data.message || "Erreur lors de l'envoi du mail");
            }

            setSuccess(true);
            setFormData({ name: "", email: "", objet: "", message: "" }); // Réinitialiser le formulaire
        } catch (error) {
            if  (error instanceof Error) {
                console.error("Erreur lors de l'envoi du formulaire :", error);
                setErrorMessage(error.message || "Une erreur inconnue est survenue.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Nous Contacter</h2>

            {success ? (
                <div className="alert alert-success">
                    Merci pour votre message, nous reviendrons vers vous bientôt !
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div className="alert alert-danger">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Nom
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="objet" className="form-label">
                                Objet
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="objet"
                                name="objet"
                                value={formData.objet}
                                onChange={handleChange}
                            />
                            {errors.objet && <div className="text-danger">{errors.objet}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">
                                Message
                            </label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={10}
                            />
                            {errors.message && <div className="text-danger">{errors.message}</div>}
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                                Envoyer
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}