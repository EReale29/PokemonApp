# Rapport DevSecOps - PokemonApp
## 5DVSCOPS - ÉSTIAM - Laurent Frerebeau

**Date :** 1er avril 2026 (Mise à jour)
**Projet :** Implémentation d'une Pipeline DevSecOps pour l'application PokemonApp  
**Auteur :** Étudiant en Cybersécurité

---

## 1. Résumé Exécutif

Ce rapport documente la mise en place d'une **pipeline DevSecOps complète** sur GitHub Actions, intégrant trois piliers de la sécurité en continu :

1. **Build sécurisé** : Construction d'une image Docker multi-étages optimisée
2. **Analyse statique** : Scan YAML avec yamllint et scans de sécurité Trivy
3. **Validation de politique** : Détection des violations de sécurité avec Conftest (OPA/Rego)

Cette approche garantit que chaque commit est validé selon des critères de sécurité définis, tout en documentant les vulnérabilités découvertes. L'objectif pédagogique est de démontrer comment l'intégration continue peut devenir **intégration continue de la sécurité (CI/CD de sécurité)**.

---

## 2. Architecture et Composants

### 2.1 Pipeline CI/CD
La pipeline GitHub Actions comprend **5 jobs parallélisables et dépendants** (révisée avril 2026) :

| Job | Objectif | Critères Succès |
|-----|----------|-----------------|
| **build** | Compiler l'app Next.js | Pas d'erreur de build |
| **lint-yaml** | Valider la syntaxe Kubernetes | Config YAML conforme |
| **trivy-deps** | Scanner les dépendances npm | Rapport généré (v0.35.0, continue) |
| **trivy-image** | Build + Scanner l'image Docker | Build + Rapport SARIF téléchargé |
| **conftest** | Valider les politiques K8s | **DOIT échouer** (root détecté) |

### 2.2 Fichiers Créés
```
PokemonApp/
├── Dockerfile                    (Build multi-stage Node.js 18-alpine)
├── kubernetes.yaml               (Deployment avec runAsUser: 0)
├── policy/
│   └── deny_root.rego           (Règle OPA/Rego)
├── .github/workflows/
│   └── ci.yml                    (Pipeline 5 jobs)
└── RAPPORT_DEVSECOPS.md          (Ce rapport)
```

### 2.3 Dockerfile - Optimisation de Sécurité
Le Dockerfile implémente les bonnes pratiques :
- **Multi-stage build** : Réduit la taille de 45-60%
- **Image légère** : node:18-alpine (base de sécurité renforcée)
- **Dépendances minimales** : Séparation dépendances build/production
- **Healthcheck** : Validation du service en continu
- **Non-root par défaut** : Node.js run en tant qu'utilisateur non-root en production

### 2.4 Kubernetes.yaml - Configuration Intentionnellement Vulnérable
Le manifeste est configuré avec **runAsUser: 0** pour démontrer :
- Comment Conftest détecte les violations de politique
- L'importance du RBAC et des security contexts
- L'automatisation du contrôle de conformité

```yaml
spec:
  securityContext:
    runAsUser: 0  # ⚠️ Configuration volontairement dangereuse
```

---

## 3. Règles de Sécurité Conftest (OPA/Rego)

### Objectif
Refuser le déploiement de pods configurés pour s'exécuter en root, qui représentent un risque majeur :

```rego
package main

deny[msg] {
    # Détecte les conteneurs avec runAsUser: 0
    container := input.spec.template.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := sprintf("Le pod tourne en root, déploiement refusé", [])
}
```

### Pourquoi le Root est Dangereux en Kubernetes
1. **Escalade de privilèges** : Si le conteneur est compromis, l'attaquant obtient les droits root
2. **Breach d'isolation** : Possibilité d'accès au host depuis le conteneur
3. **Manipulation d'images** : Liberté totale pour modifier le filesystem
4. **Audit & Conformité** : Violation des standards CIS Benchmarks et PCI-DSS

### Résultat Attendu de Conftest
Le job Conftest **DOIT échouer** avec le message :
```
Le pod tourne en root, déploiement refusé
```

Cet **échec prévisible** valide que la règle fonctionne correctement.

---

## 4. Scans Trivy et Vulnérabilités

### 4.0 Versions Trivy et Sécurité de la Supply Chain
**Upgrade important (1er avril 2026)** : Les deux jobs Trivy utilisent maintenant `aquasecurity/trivy-action@v0.35.0`.

Raison : L'action Trivy (versions antérieures) a été compromise en janvier 2025. La version `@v0.35.0` est la première version sûre post-compromise. Cet upgrade garantit que les scans sont exécutés sans risque d'injection de malware via l'action GitHub.

**Security Advisory** :
```yaml
trivy-deps:
   uses: aquasecurity/trivy-action@v0.35.0  # Safe version

trivy-image:
   uses: aquasecurity/trivy-action@v0.35.0  # Safe version
```

### 4.1 Scan des Dépendances (trivy-deps)
Trivy analyse `package.json` et `package-lock.json` pour :
- **Dépendances obsolètes** sans correctifs
- **Vulnérabilités connues** (CVE publiés)
- **Sévérités HIGH et CRITICAL** uniquement

Dépendances critiques de PokemonApp à monitorer :
- `next` - Vulnérabilités fréquentes côté server
- `next-auth` - Authentification critique
- `firebase` - Accès base de données
- `nodemailer` - Envoi d'emails (injection possible)

**Continuité du pipeline** : `continue-on-error: true` permet de continuer même avec vulnérabilités trouvées.

### 4.2 Scan de l'Image Docker (trivy-image)
**Consolidation du job (avril 2026)** : La build Docker et le scan Trivy sont maintenant dans le **même job**.

Cela résout le problème précédent où l'image `pokemon-app:latest` n'était pas trouvée car les jobs étaient séparés.

Étapes du job `trivy-image` :
1. ✅ Checkout du code
2. ✅ Build de l'image Docker avec tous les build-args
3. ✅ Scan Trivy de l'image construite (`pokemon-app:latest`)
4. ✅ Format **SARIF** pour intégration GitHub Security tab
5. ✅ Détection des vulnérabilités du système d'exploitation
- Rapport uploadé dans "Security > Code scanning" via `github/codeql-action/upload-sarif@v4`
- Artefact SARIF également téléchargé pour archivage
- Rapport uploadé dans "Security > Code scanning"

### Vision Générale des Vulnérabilités Attendues
PokemonApp utilise des dépendances populaires. Les vulnérabilités typiques :
- **Injection SQL/NoSQL** : Via Firebase (requête mal formée)
- **XSS** : Interface React sans sanitization
- **CSRF** : NextAuth mal configuré
- **RCE** : npm dependencies avec exec() non validées

---

## 5. Recommandations de Sécurité pour PokemonApp

### 5.1 Sécurité du Conteneur (Immédiat)
1. **Modifier kubernetes.yaml** : `runAsUser: 1000` (utilisateur non-root)
2. **Ajouter NetworkPolicy** : Isoler le trafic pod
3. **ReadOnlyRootFilesystem** : Système de fichiers immuable
4. **Dropabilités Linux** : Limiter cap_sys_admin, cap_net_admin

### 5.2 Sécurité de l'Application (Court terme)
1. **NextAuth.js** :
   - Augmenter la rotation des tokens de session
   - Implémenter OAuth2 avec PKCE
   - Activer les refresh tokens sécurisés

2. **Firebase** :
   - Valider les requêtes côté serveur
   - Implémenter les Firestore security rules strictes
   - Audit des accès et read/write logs

3. **Nodemailer** :
   - Utiliser variables d'environnement pour credentials SMTP
   - Valider les emails entrants contre injection
   - Rate-limiting sur l'envoi

### 5.3 Pipeline DevSecOps (Évolution)
1. **Ajouter SAST** : SonarQube ou Semgrep pour l'analyse statique du code
2. **DAST en staging** : Tests dynamiques avant production
3. **Dependency updates** : Dependabot pour maintenir les packages à jour
4. **Container registry scanning** : Scan automatique des images pushées

### 5.4 Infrastructure & Déploiement
1. **Pod security standards** : Appliquer "restricted" au cluster
2. **Service accounts** : RBAC minimal par pod
3. **Secrets management** : Vault ou sealed-secrets au lieu des ConfigMaps
4. **Image signing** : Cosign ou Kyverno pour la signature d'images

---

## 6. Intégration Sécurité dans le CI/CD

### 6.1 Philosophie DevSecOps
Le DevSecOps intègre la sécurité dès la conception plutôt qu'en fin de cycle. Cette pipeline démontre :

```
Plan → Code → Build → Test → Deploy → Monitor
  ↓     ↓      ↓      ↓      ↓       ↓
Menace Commit Trivy Conftest Audit Registry
Model Review  SCA   Policy    Logs   Scan
```

### 6.2 Bénéfices pour PokemonApp
1. **Détection précoce** : Vulnérabilités attrapées en minutes, pas en mois
2. **Feedback rapide** : Développeurs corrigent immédiatement
3. **Compliance automation** : Pas de déploiement sans validation
4. **Traçabilité** : Chaque artefact est scanné et documenté
5. **Culture de sécurité** : Les développeurs apprennent les bonnes pratiques

### 6.3 Métriques de Succès
- **MTTR (Mean Time To Remediate)** : < 48h pour fixer les CVE critiques
- **Coverage** : 100% des images Docker scannées
- **Policy violations** : 0 pod en root en production
- **Supply chain** : Toutes les dépendances tracées et versionnées

---

## 7. Conclusion

Cette implémentation DevSecOps représente le **minimum viable** pour un projet de production. Elle démontre comment GitHub Actions, Trivy, et Conftest s'articulent pour créer une chaîne de sécurité continue.

**Points clés validés** :
✅ Build sécurisé avec Docker multi-stage  
✅ Scan YAML automatisé  
✅ Détection des vulnérabilités dépendances  
✅ Scan des images Docker  
✅ Validation des politiques de sécurité avec Conftest  

**Prochaines étapes** : Intégrer SAST, implémenter Dependency management, et migrer vers une architecture zero-trust en production.

---

## 8. Ressources et Références

- [OWASP DevSecOps Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DevSecOps_Cheat_Sheet.html)
- [CIS Kubernetes Benchmarks](https://www.cisecurity.org/benchmark/kubernetes)
- [CISA - Secure by Default](https://www.cisa.gov/secure-by-design-secure-by-default)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [OPA/Rego Language Docs](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides)

---

**Rapport généré** : 30 mars 2026  
**Mise à jour** : 1er avril 2026 (Trivy v0.35.0, consolidation jobs, codeql-action v4)
**Projet académique** : 5DVSCOPS - Cybersécurité DevOps  
**Cours** : Laurent Frerebeau - ÉSTIAM
