// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    const body = await request.json();
    const { name, email, objet, message } = body;

    if (!name || !email || !objet || !message) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false,
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

        return NextResponse.json({ message: "Emails envoyés avec succès" }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de l'envoi des emails:", error);
        return NextResponse.json({ message: "Erreur interne lors de l'envoi des emails" }, { status: 500 });
    }
}