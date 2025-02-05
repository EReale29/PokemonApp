# PokemonApp

![PokemonApp](https://img.shields.io/badge/Status-Active-brightgreen.svg)

## Description
PokemonApp est une application permettant aux utilisateurs d'explorer, rechercher et afficher des informations sur leurs Pokémons préférés. Elle utilise une API pour récupérer les données et offre une interface conviviale pour naviguer entre les différents Pokémons.

## Fonctionnalités
- 🔍 Recherche de Pokémons par nom
- 📜 Affichage des détails d'un Pokémon (type, stats, attaques, etc.)
- ⭐ Gestion des Pokémons favoris avec Firebase
- 🏆 Gestion d'une équipe de Pokémons avec Firebase (max 6 Pokémons)
- 🔑 Authentification avec Google et GitHub via NextAuth.js
- 🎨 Interface utilisateur intuitive et responsive
- 📡 Intégration avec une API Pokémon
- 🔄 Système de cache pour améliorer la performance
- 📑 Pagination pour une navigation efficace
- 👤 Gestion des données utilisateur avec React Context API
- 🎯 Filtrage des Pokémons par type
- 🛠 Tests unitaires avec Jest et mocking des modules Firebase
- 📩 Formulaire de contact avec validation et gestion des erreurs
- 📧 Envoi automatique d'e-mails de confirmation et de notification via Nodemailer
- ⚠️ Gestion des erreurs d'authentification avec une page dédiée
- 🏷️ Page 404 personnalisée pour une meilleure expérience utilisateur
- 🖥️ Intégration de Bootstrap pour le design et la mise en page
- 🔄 Chargement et gestion dynamique des Pokémon avec pagination et filtres

## Technologies Utilisées
- [Next.js](https://nextjs.org/) - Framework React pour le rendu côté serveur
- [NextAuth.js](https://next-auth.js.org/) - Gestion de l'authentification (Google et GitHub)
- [Firebase](https://firebase.google.com/) - Stockage des favoris et de l'équipe
- [React Context API](https://reactjs.org/docs/context.html) - Gestion des états globaux utilisateur
- [Bootstrap](https://getbootstrap.com/) - UI et composants pour la mise en page
- [PokeAPI](https://pokeapi.co/) - API pour les données des Pokémons
- [Jest](https://jestjs.io/) - Tests unitaires et mocking des modules Firebase
- [Nodemailer](https://nodemailer.com/) - Envoi d'e-mails automatisés

## Architecture du projet
```
src
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   ├── route.ts
│   │   │   ├── error.tsx
│   │   ├── contact
│   │   │   ├── route.ts
│   ├── contact
│   │   ├── page.tsx
│   ├── favorites
│   │   ├── page.tsx
│   ├── profile
│   │   ├── page.tsx
│   ├── team
│   │   ├── page.tsx
│   ├── error
│   │   ├── page.tsx
│   ├── not-found
│   │   ├── page.tsx
│   ├── home
│   │   ├── page.tsx
├── components
│   ├── ErrorBoundary.tsx
│   ├── Navbar.tsx
│   ├── NotConnected.tsx
│   ├── Pagination.tsx
│   ├── PokemonCard.tsx
│   ├── PokemonModal.tsx
│   ├── SearchBar.tsx
├── context
│   ├── UserDataContext.tsx
├── lib
│   ├── cache.ts
│   ├── firebase.ts
│   ├── firebaseEquipe.ts
│   ├── firebaseFavorites.ts
├── styles
│   ├── animations.css
│   ├── components.css
│   ├── globals.css
│   ├── loader.css
│   ├── themes.css
├── tests
│   ├── pokemonUtils.test.tsx
├── utils
│   ├── api.ts
│   ├── authOptions.ts
│   ├── authType.ts
│   ├── pokemonUtils.ts
│   ├── types.ts
```

## Installation
### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Compte Firebase configuré
- Variables d'environnement configurées (`.env.local`)

### Démarrage du projet
```bash
# Cloner le dépôt
git clone https://github.com/EReale29/PokemonApp.git
cd PokemonApp

# Installer les dépendances
npm install  # ou yarn install

# Lancer l'application
npm run dev  # ou yarn dev
```

## Utilisation
1. Ouvrir l'application dans votre navigateur (http://localhost:3000/)
2. S'inscrire / Se connecter avec Google ou GitHub via NextAuth.js
3. Rechercher un Pokémon par nom
4. Filtrer les Pokémons par type avec la barre de recherche
5. Ajouter des Pokémons aux favoris ou à l'équipe
6. Naviguer entre les pages grâce à la pagination
7. Envoyer un message via le formulaire de contact
8. Consulter la page d'erreur en cas d'échec d'authentification
9. Voir la page 404 personnalisée pour une meilleure expérience utilisateur

## Tests
Pour exécuter les tests unitaires :
```bash
npm run test  # ou yarn test
```

## Licence
Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

✨ _Attrapez-les tous avec PokemonApp !_ ✨

