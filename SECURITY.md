# Security Policy

## 🔒 Versions Supportées

Nous fournissons des mises à jour de sécurité pour les versions suivantes:

| Version | Supportée          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 Signaler une Vulnérabilité

La sécurité de NudgeSafe Hands est une priorité absolue. Si vous découvrez une vulnérabilité de sécurité, veuillez **NE PAS** créer une issue publique.

### Processus de Signalement

1. **Envoyez un email à:** security@preventera.ca
2. **Incluez:**
   - Description détaillée de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Version affectée
   - Votre nom/organisation (si vous souhaitez être crédité)

3. **Réponse attendue:**
   - Accusé de réception: < 48 heures
   - Évaluation initiale: < 7 jours
   - Correctif et communication: selon sévérité

### Niveau de Sévérité

Nous utilisons le [CVSS v3.1](https://www.first.org/cvss/) pour évaluer:

- **Critique (9.0-10.0):** Correctif d'urgence < 24h
- **Haute (7.0-8.9):** Correctif prioritaire < 7 jours
- **Moyenne (4.0-6.9):** Correctif < 30 jours
- **Basse (0.1-3.9):** Correctif prochaine release

## 🛡️ Bonnes Pratiques de Sécurité

### Variables d'Environnement

- ❌ **NE JAMAIS** commiter `.env` dans Git
- ✅ Utiliser `.env.example` comme template
- ✅ Utiliser des secrets forts (min. 32 caractères)
- ✅ Rotationner les secrets régulièrement

### Dépendances

```bash
# Vérifier les vulnérabilités npm
npm audit

# Corriger automatiquement
npm audit fix

# Vérifier les vulnérabilités Python
pip-audit

# Mettre à jour les dépendances
npm update
pip install --upgrade -r requirements.txt
```

### API

- ✅ Toujours utiliser HTTPS en production
- ✅ Implémenter rate limiting
- ✅ Valider toutes les entrées utilisateur
- ✅ Utiliser JWT avec expiration courte
- ✅ Implémenter CORS correctement

### Base de Données

- ✅ Jamais de credentials en dur dans le code
- ✅ Utiliser des requêtes préparées (prévention SQL injection)
- ✅ Chiffrer les données sensibles au repos
- ✅ Backups réguliers et chiffrés

## 📋 Audit de Sécurité

Derniers audits:

| Date | Type | Résultat | Rapport |
|------|------|----------|---------|
| 2025-01-31 | Initial | Aucune vulnérabilité critique | N/A |

## 🏆 Programme de Divulgation Responsable

Nous apprécions les chercheurs en sécurité qui divulguent de manière responsable:

- 🎖️ Crédit public dans CHANGELOG et SECURITY.md
- 🏅 Mention dans Hall of Fame (si souhaité)
- 🎁 Récompenses possibles selon impact (à discuter)

## 📞 Contact

- **Email sécurité:** security@preventera.ca
- **Email général:** info@preventera.ca
- **PGP Key:** [À venir]

## ⚖️ Politique de Divulgation

Nous nous engageons à:

1. Répondre rapidement aux signalements
2. Tenir les chercheurs informés de l'avancement
3. Publier des correctifs en temps opportun
4. Créditer publiquement les découvreurs (avec permission)
5. Ne jamais poursuivre légalement les chercheurs de bonne foi

---

**Dernière mise à jour:** 31 janvier 2025
