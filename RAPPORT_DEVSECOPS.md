# Rapport DevSecOps — PokemonApp
## 5DVSCOPS — ÉSTIAM — Laurent Frerebeau

**Date :** 1er avril 2026
**Auteur :** Enzo Reale
**Projet :** Pipeline DevSecOps pour PokemonApp

---

## 1. Présentation du projet

PokemonApp est une application Next.js/TypeScript permettant
d'explorer des Pokémons, gérer des favoris et une équipe via
Firebase, et s'authentifier via Google/GitHub avec NextAuth.js.

Pour les besoins de ce projet DevSecOps, une API Flask dédiée
(dossier api/) a été ajoutée avec des dépendances volontairement
datées afin de générer des CVE détectables par Trivy.

---

## 2. AVANT — État initial et mise en place du pipeline

### 2.1 Fichiers créés pour le projet DevSecOps

```
PokemonApp/
├── Dockerfile                    # Build multi-stage node:18-alpine
├── kubernetes.yaml               # Deployment avec faille volontaire
├── policy/
│   └── deny_root.rego           # Règle OPA/Rego
├── api/
│   ├── app.py                   # API Flask Pokémon
│   ├── requirements.txt         # Dépendances volontairement datées
│   └── Dockerfile               # Image python:3.11-slim
└── .github/workflows/
    └── ci.yml                   # Pipeline 6 jobs
```

### 2.2 Pipeline CI/CD configuré (6 jobs)

| Job               | Objectif                          | Outil              |
|-------------------|-----------------------------------|--------------------|
| build             | Build Next.js + tests Jest        | Node.js 18         |
| lint-yaml         | Validation kubernetes.yaml        | yamllint           |
| lint-dockerfile   | Lint Dockerfile bonnes pratiques  | Hadolint           |
| trivy-deps        | Scan dépendances npm + Flask API  | Trivy v0.35.0      |
| trivy-image       | Scan image Docker Next.js         | Trivy v0.35.0      |
| conftest          | Politique sécurité Kubernetes     | OPA/Conftest v0.67 |

### 2.3 Sécurité du pipeline

Conformément aux best practices DevSecOps, le pipeline déclare
des permissions minimales (principe du moindre privilège) :

```yaml
permissions:
  contents: read        # Lecture du code uniquement
  security-events: write # Upload rapports SARIF
  actions: read         # Lecture des artifacts
```

La version trivy-action@v0.35.0 est utilisée — version sûre
publiée après la compromission supply chain du 19 mars 2026
qui avait affecté les versions 0.0.1 à 0.34.2.

### 2.4 Failles volontairement introduites

FAILLE 1 — kubernetes.yaml configuré avec runAsUser: 0

```yaml
# État initial vulnérable (pour démonstration Conftest)
securityContext:
  runAsUser: 0               # Container en root
  allowPrivilegeEscalation: true
```

FAILLE 2 — api/requirements.txt avec versions datées contenant
des CVE HIGH documentées sur NVD et GitHub Advisory Database.

---

## 3. PENDANT — Exécution du pipeline et détection des failles

### 3.1 Vulnérabilités détectées par Trivy — Dépendances npm

Le scan Trivy sur le projet Next.js détecte des dépendances
npm dépréciées et non maintenues : glob@7.2.3, inflight@1.0.6,
domexception@4.0.0, abab@2.0.6. Ces packages sont signalés
comme deprecated et doivent être mis à jour.

### 3.2 Vulnérabilités détectées par Trivy — API Flask

Le scan Trivy sur api/requirements.txt détecte les CVE suivantes,
toutes vérifiées sur NVD (nvd.nist.gov) et GitHub Advisory :

| Package          | CVE            | CVSS | CWE     | Description                                 | Correctif      |
|------------------|----------------|------|---------|---------------------------------------------|----------------|
| Flask 2.1.0      | CVE-2023-30861 | 7.5  | CWE-539 | Divulgation cookie session permanent        | Flask 2.3.2    |
| Werkzeug 2.1.0   | CVE-2023-25577 | 7.5  | CWE-770 | DoS via parsing multipart illimité          | Werkzeug 2.2.3 |
| Werkzeug 2.1.0   | CVE-2024-34069 | 7.5  | CWE-352 | RCE via débogueur (CSRF + localhost bypass) | Werkzeug 3.0.3 |
| gunicorn 20.1.0  | CVE-2024-1135  | HIGH | CWE-444 | HTTP Request Smuggling (Transfer-Encoding)  | gunicorn 22.0  |
| Jinja2 3.0.3     | CVE-2024-34064 | 5.4  | CWE-79  | XSS via filtre xmlattr (vol de cookies)     | Jinja2 3.1.4   |

### 3.3 Détection Conftest — Policy as Code

Le job Conftest teste kubernetes.yaml contre la règle OPA/Rego :

```rego
package main

deny contains msg if {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  container.securityContext.runAsUser == 0
  msg := sprintf(
    "REFUSÉ : le container '%v' tourne en root. Déploiement bloqué.",
    [container.name]
  )
}
```

Résultat attendu dans les logs GitHub Actions :
```
FAIL - kubernetes.yaml - main - REFUSÉ : le container
'pokemon-app' tourne en root. Déploiement bloqué.
```

Cet échec est VOLONTAIRE — il prouve que la règle OPA/Rego
fonctionne et bloque les déploiements non conformes.

### 3.4 Analyse CID des vulnérabilités

La méthode CID (Confidentialité, Intégrité, Disponibilité)
issue du cours permet d'évaluer l'impact réel de chaque faille.

#### Confidentialité (C)
- **CVE-2023-30861** (Flask 2.1.0, CVSS 7.5) : divulgation du
  cookie de session permanent via un proxy cache. Un attaquant
  peut usurper l'identité d'un utilisateur et accéder à ses
  favoris et équipe Pokémon Firebase. Impact : **HAUT**
- **CVE-2024-34064** (Jinja2 3.0.3) : XSS via le filtre xmlattr
  permettant le vol de cookies d'authentification. Impact : **MOYEN**
- Clés Firebase non sécurisées dans les variables d'environnement :
  accès potentiel non autorisé à la base de données. Impact : **HAUT**

#### Intégrité (I)
- **CVE-2024-34069** (Werkzeug 2.1.0, CVSS 7.5) : RCE via le
  débogueur Werkzeug. Un attaquant peut exécuter du code arbitraire
  sur le serveur même si le débogueur tourne en localhost.
  Impact : **CRITIQUE**
- **runAsUser: 0** dans kubernetes.yaml : si le container est
  compromis, l'attaquant obtient les droits root sur le host
  Kubernetes, pouvant modifier ou supprimer des données.
  Impact : **CRITIQUE**

#### Disponibilité (D)
- **CVE-2023-25577** (Werkzeug 2.1.0, CVSS 7.5) : DoS par parsing
  multipart illimité, épuisant CPU et RAM jusqu'au kill du process.
  Impact : **HAUT**
- **CVE-2024-1135** (gunicorn 20.1.0) : HTTP Request Smuggling
  via validation incorrecte du header Transfer-Encoding, permettant
  de saturer l'API et de bloquer les requêtes légitimes.
  Impact : **HAUT**
- **allowPrivilegeEscalation: true** : escalade de privilèges
  pouvant compromettre tout le cluster Kubernetes. Impact : **CRITIQUE**

### 3.5 Incident supply chain Trivy (mars 2026)

Le 19 mars 2026, les versions 0.0.1 à 0.34.2 de trivy-action
ont été compromises par un credential stealer injectant du code
malveillant dans les runners GitHub Actions pour exfiltrer les
secrets CI/CD vers un domaine contrôlé par l'attaquant.

Ce projet utilise trivy-action@v0.35.0, version sûre publiée
après containment de l'attaque. Cet incident illustre
concrètement les risques supply chain étudiés en cours —
l'importance d'épingler les versions des GitHub Actions.

---

## 4. APRÈS — Corrections et recommandations

### 4.1 Correction Kubernetes (état production)

```yaml
# AVANT — vulnérable (état actuel pour démonstration)
securityContext:
  runAsUser: 0
  allowPrivilegeEscalation: true

# APRÈS — corrigé pour la production
securityContext:
  runAsUser: 1000
  runAsNonRoot: true
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
```

### 4.2 Correction API Flask (versions sécurisées)

```
# AVANT — versions vulnérables
Flask==2.1.0        → CVE-2023-30861
Werkzeug==2.1.0     → CVE-2023-25577, CVE-2024-34069
gunicorn==20.1.0    → CVE-2024-1135
Jinja2==3.0.3       → CVE-2024-34064

# APRÈS — versions corrigées
Flask>=3.0.0
Werkzeug>=3.0.3
gunicorn>=22.0.0
Jinja2>=3.1.4
```

### 4.3 Recommandations pour PokemonApp

1. Stocker toutes les clés Firebase dans GitHub Secrets
2. Rotation régulière du NEXTAUTH_SECRET (TTL < 24h)
3. Activer Dependabot pour mises à jour automatiques
4. Ajouter SAST (Semgrep) pour analyse statique TypeScript
5. Ajouter DAST (OWASP ZAP) sur environnement staging
6. Migrer vers une image Docker distroless pour réduire la
   surface d'attaque

### 4.4 Métriques DevSecOps cibles

| Métrique               | Objectif |
|------------------------|----------|
| MTTR vulns critiques   | < 48h    |
| Images Docker scannées | 100%     |
| Pods en root en prod   | 0        |
| Secrets commités       | 0        |
| Coverage tests sécu    | > 80%    |

---

## 5. Conclusion

Ce projet démontre l'intégration complète d'une chaîne DevSecOps
appliquant le principe Shift Left : détection précoce des
vulnérabilités dépendances (SCA via Trivy), scan d'image Docker,
et Policy as Code avec OPA/Conftest. L'incident supply chain
Trivy de mars 2026 vécu durant ce projet illustre concrètement
les enjeux réels de la sécurité de la chaîne d'approvisionnement
logicielle abordés dans le cours.

---

## Références

- OWASP DevSecOps Guideline — owasp.org
- CIS Kubernetes Benchmarks — cisecurity.org
- NVD CVE Database — nvd.nist.gov
- Trivy Documentation — aquasecurity.github.io/trivy
- OPA/Rego Language — openpolicyagent.org
- GitHub Actions Security — docs.github.com/actions/security-guides
- Trivy Supply Chain Attack (mars 2026) — aquasec.com/blog
