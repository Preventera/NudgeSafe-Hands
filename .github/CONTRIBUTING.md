# Contributing to AX5-SafeNudge™

Merci de votre intérêt pour contribuer à **AX5-SafeNudge™**! 🎉

Ce guide vous aidera à contribuer efficacement au projet.

---

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler un Bug](#signaler-un-bug)
- [Proposer une Fonctionnalité](#proposer-une-fonctionnalité)
- [Questions](#questions)

---

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md).

**Principes clés:**
- Respecter tous les contributeurs
- Accepter les critiques constructives
- Privilégier les intérêts de la communauté
- Faire preuve d'empathie

---

## 🤝 Comment Contribuer

### Types de Contributions Bienvenues

✅ **Code:**
- Corrections de bugs
- Nouvelles fonctionnalités
- Améliorations performances
- Tests automatisés

✅ **Documentation:**
- Corrections typos/grammaire
- Améliorations clarté
- Traductions
- Exemples d'utilisation

✅ **Design:**
- Améliorations UI/UX
- Nouveaux composants
- Assets graphiques
- Guides de style

✅ **Données:**
- Nouveaux produits chimiques
- Nouveaux matériaux gants
- Validation données existantes
- Sources scientifiques

---

## 🛠️ Configuration Environnement

### Prérequis

```bash
# Node.js 16+
node --version

# Python 3.8+
python --version

# Git
git --version
```

### Installation

```bash
# 1. Forker le repo sur GitHub
# 2. Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/NudgeSafe-Hands.git
cd NudgeSafe-Hands

# 3. Ajouter upstream
git remote add upstream https://github.com/Preventera/NudgeSafe-Hands.git

# 4. Installer dépendances
npm install
pip install -r requirements.txt

# 5. Créer une branche
git checkout -b feature/ma-fonctionnalite
```

### Lancer en Dev

```bash
# Frontend
npm run dev

# API (terminal séparé)
npm run api:dev

# Tests
npm test
pytest

# Linter
npm run lint
black src/
```

---

## 📝 Standards de Code

### JavaScript/TypeScript

**Style:**
- ESLint configuration fournie
- Prettier pour formatting
- 2 espaces indentation
- Single quotes
- Semicolons obligatoires

```javascript
// ✅ BON
const analyzeGlove = (chemical, glove) => {
  return chemical.compatibleWith(glove);
};

// ❌ MAUVAIS
function analyzeGlove(chemical,glove)
{
    return chemical.compatibleWith(glove)
}
```

**Naming:**
- camelCase pour variables/fonctions
- PascalCase pour classes/composants
- UPPER_CASE pour constantes
- Noms descriptifs

```javascript
// ✅ BON
const MAX_EXPOSURE_TIME = 240;
class ChemicalAnalyzer {}
const getUserPreferences = () => {};

// ❌ MAUVAIS
const max = 240;
class chemicalanalyzer {}
const gup = () => {};
```

### Python

**Style:**
- PEP 8 compliance
- Black pour formatting
- 4 espaces indentation
- Type hints recommandés

```python
# ✅ BON
def analyze_chemical_compatibility(
    chemical: str, 
    glove_material: str
) -> GloveRecommendation:
    """Analyze compatibility between chemical and glove."""
    return GloveRecommendation(...)

# ❌ MAUVAIS
def analyze(c,g):
    return GloveRecommendation(...)
```

### CSS/Styles

- BEM methodology
- Mobile-first
- Variables CSS pour couleurs/spacing
- Éviter !important

```css
/* ✅ BON */
.safenudge-alert--warning {
  background-color: var(--color-warning);
  padding: var(--spacing-md);
}

/* ❌ MAUVAIS */
.alert {
  background-color: #F59E0B !important;
  padding: 16px;
}
```

### Commits

**Format:**
```
type(scope): description courte

Description détaillée optionnelle.

Resolves: #123
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction bug
- `docs`: Documentation
- `style`: Formatting (pas de changement code)
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

**Exemples:**
```bash
feat(parser): add OCR support for FDS parsing
fix(api): correct breakthrough time calculation
docs(readme): update installation instructions
```

---

## 🔀 Processus de Pull Request

### Avant de Soumettre

✅ **Checklist:**
- [ ] Code suit les standards
- [ ] Tests passent (npm test, pytest)
- [ ] Linter OK (npm run lint)
- [ ] Documentation mise à jour
- [ ] Commits suivent convention
- [ ] Branch à jour avec main

### Soumettre la PR

1. **Push votre branche:**
```bash
git push origin feature/ma-fonctionnalite
```

2. **Créer PR sur GitHub:**
- Titre descriptif
- Description détaillée (quoi, pourquoi, comment)
- Référencer issues (#123)
- Screenshots si UI

3. **Template PR:**
```markdown
## Description
[Description claire des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués

## Screenshots (si applicable)
[Ajouter screenshots]

## Checklist
- [ ] Code suit les standards
- [ ] Documentation mise à jour
- [ ] Tests passent
- [ ] Ready for review
```

### Review Process

1. **Automated checks:**
   - CI/CD tests
   - Linting
   - Code coverage

2. **Code review:**
   - 1-2 reviewers assignés
   - Feedback constructif
   - Itérations si nécessaire

3. **Merge:**
   - Squash & merge (default)
   - Delete branch après merge

---

## 🐛 Signaler un Bug

### Avant de Signaler

1. Vérifier [Issues existantes](https://github.com/Preventera/NudgeSafe-Hands/issues)
2. Tester sur dernière version
3. Reproduire le bug

### Template Issue Bug

```markdown
**Description du bug**
[Description claire et concise]

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir erreur

**Comportement attendu**
[Ce qui devrait se passer]

**Comportement actuel**
[Ce qui se passe réellement]

**Screenshots**
[Si applicable]

**Environnement:**
- OS: [e.g. Windows 11]
- Navigateur: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Logs/Erreurs**
```
[Coller logs]
```

**Contexte additionnel**
[Toute info pertinente]
```

---

## 💡 Proposer une Fonctionnalité

### Template Issue Feature

```markdown
**Problème à résoudre**
[Quel problème cette feature résout-elle?]

**Solution proposée**
[Description de la solution]

**Alternatives considérées**
[Autres approches envisagées]

**Impact**
- Utilisateurs affectés: [tous/certains/nouveaux]
- Complexité: [faible/moyenne/élevée]
- Priorité: [basse/moyenne/haute]

**Ressources additionnelles**
[Mockups, références, etc.]
```

---

## 📚 Contribuer à la Documentation

### Types de Docs

- **API Reference:** Docs techniques endpoints
- **User Guide:** Guide utilisateur final
- **Developer Guide:** Guide intégration
- **Training:** Matériel formation

### Standards Documentation

- Markdown format
- Exemples de code
- Screenshots annotés
- Liens internes/externes valides
- Table des matières pour docs longues

---

## 🌍 Traductions

Nous accueillons les traductions!

**Langues prioritaires:**
- Français ✅ (complet)
- English ✅ (complet)
- Español 🚧 (en cours)
- العربية 📅 (planifié)
- 中文 📅 (planifié)

**Comment contribuer:**
1. Copier fichier EN ou FR
2. Traduire contenu
3. Soumettre PR avec tag [i18n]

---

## ❓ Questions

**Besoin d'aide?**

- 💬 [Discussions GitHub](https://github.com/Preventera/NudgeSafe-Hands/discussions)
- 📧 Email: dev@safenudge.com
- 💼 Slack: #safenudge-dev (sur demande)

**Ressources:**
- [Documentation](https://docs.safenudge.com)
- [API Reference](https://api.safenudge.com/docs)
- [FAQ](https://safenudge.com/faq)

---

## 🎖️ Contributeurs

Un grand merci à tous nos contributeurs! 🙏

[![Contributors](https://contrib.rocks/image?repo=Preventera/NudgeSafe-Hands)](https://github.com/Preventera/NudgeSafe-Hands/graphs/contributors)

---

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la même licence MIT que le projet.

---

**Merci de contribuer à rendre les milieux industriels plus sûrs! 🛡️**

*AX5-SafeNudge™ — Making the Right Choice, the Easy Choice™*
