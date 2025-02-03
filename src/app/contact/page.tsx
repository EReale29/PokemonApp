// app/contact/page.tsx
"use client";

import React, { useState } from "react";

// Fonction de validation simple pour le formulaire
const validateForm = (name: string, email: string, objet: string, message: string) => {
    const errors: { name?: string; email?: string; objet?: string; message?: string } = {};
    if (!name) errors.name = "Le nom est requis";
    if (!email) errors.email = "L'email est requis";
    if (!objet) errors.objet = "l'objet est requis";
    if (!message) errors.message = "Le message est requis";
    return errors;
};

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", objet: "", message: "" });
    const [errors, setErrors] = useState({} as any);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm(formData.name, formData.email, formData.objet, formData.message);
        if (Object.keys(formErrors).length === 0) {
            // Formulaire valide, vous pouvez envoyer les données (par exemple à un API)
            setSuccess(true);
            setFormData({ name: "", email: "", objet: "", message: "" }); // Réinitialiser le formulaire
        } else {
            setErrors(formErrors); // Afficher les erreurs de validation
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Nous Contacter</h2>

            {success ? (
                <div className="alert alert-success">Merci pour votre message, nous reviendrons vers vous bientôt !</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nom</label>
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
                        <label htmlFor="email" className="form-label">Email</label>
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
                        <label htmlFor="objet" className="form-label">Objet</label>
                        <input
                            type="objet"
                            className="form-control"
                            id="objet"
                            name="objet"
                            value={formData.objet}
                            onChange={handleChange}
                        />
                        {errors.objet && <div className="text-danger">{errors.objet}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Message</label>
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
                    <div className="text-center">  {/* Utilisation de text-center pour centrer le contenu */}
                        <button type="submit" className="btn btn-primary">Envoyer</button>
                    </div>
                </form>
            )}
        </div>
    );
}