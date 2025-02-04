import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (parseError) {
        console.error("Erreur lors du parsing du JSON :", parseError);
        return NextResponse.json(
            { message: "JSON invalide dans la requête" },
            { status: 400 }
        );
    }

    const { name, email, objet, message } = body;

    if (!name || !email || !objet || !message) {
        return NextResponse.json(
            { message: "Missing fields" },
            { status: 400 }
        );
    }

    try {
        // Vérification optionnelle des variables d'environnement
        if (
            !process.env.EMAIL_HOST ||
            !process.env.EMAIL_PORT ||
            !process.env.EMAIL_USER ||
            !process.env.EMAIL_PASS ||
            !process.env.EMAIL_FROM ||
            !process.env.EMAIL_ADMIN
        ) {
            throw new Error("Les variables d'environnement nécessaires ne sont pas définies.");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false, // false pour TLS sur le port 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            requireTLS: true,
        });

        const mailOptionsUser = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Confirmation de réception de votre demande",
            text: `Bonjour ${name},\n\nNous avons bien reçu votre demande concernant "${objet}". Nous vous répondrons dès que possible.\n\nCordialement,\nL'équipe`,
        };

        const mailOptionsAdmin = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_ADMIN,
            subject: `Nouvelle demande de contact: ${objet}`,
            text: `Nouvelle demande de contact:\n\nNom: ${name}\nEmail: ${email}\nObjet: ${objet}\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptionsUser);
        await transporter.sendMail(mailOptionsAdmin);

        return NextResponse.json(
            { message: "Emails envoyés avec succès" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de l'envoi des emails :", error);
        return NextResponse.json(
            { message: "Erreur interne lors de l'envoi des emails" },
            { status: 500 }
        );
    }
}