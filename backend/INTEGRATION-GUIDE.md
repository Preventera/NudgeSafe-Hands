# 🔌 Guide d'Intégration Backend dans Projet GitHub

## Installation dans Votre Projet Local

### Étape 1: Copier le Dossier Backend

```bash
# Depuis votre terminal dans le projet AX5-SafeNudge
cd C:\Users\Mario\Documents\PROJECTS_NEW\AX5-SafeNudge\AX5-SafeNudge-GitHub-Package

# Créer le dossier backend/ (si pas déjà fait)
mkdir backend

# Copier tous les fichiers du package backend livré
# (depuis le dossier où vous avez extrait ce guide)
```

### Étape 2: Vérifier la Structure

Votre projet devrait maintenant ressembler à :

```
AX5-SafeNudge-GitHub-Package/
├── .vscode/
├── .github/
├── src/
│   └── app/
│       ├── ax5-safenudge-glove-selector.html
│       ├── ax5-safenudge-dashboard.html
│       └── ax5-safenudge-presentation.html
├── backend/                          ← NOUVEAU
│   ├── src/
│   │   ├── clients/
│   │   │   └── safetygraph_client.py
│   │   ├── models/
│   │   │   └── safetygraph_models.py
│   │   ├── api/
│   │   ├── agents/
│   │   └── utils/
│   ├── tests/
│   │   └── test_safetygraph_client.py
│   ├── config/
│   ├── logs/
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   ├── demo.py
│   └── README.md
├── docs/
├── data/
├── tests/
├── examples/
├── scripts/
├── assets/
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

### Étape 3: Mettre à Jour .gitignore Principal

Ajouter dans `.gitignore` à la racine :

```gitignore
# Backend Python
backend/.venv/
backend/__pycache__/
backend/**/__pycache__/
backend/*.pyc
backend/**/*.pyc
backend/.env
backend/logs/*.log
backend/.pytest_cache/
backend/.coverage
backend/htmlcov/
backend/dist/
backend/build/
backend/*.egg-info/
```

### Étape 4: Installer Backend en Mode Dev

```bash
cd backend

# Créer environnement virtuel
python -m venv .venv

# Activer
.venv\Scripts\activate  # Windows
# OU
source .venv/bin/activate  # Linux/Mac

# Installer dépendances
pip install -r requirements.txt

# Configurer
cp .env.example .env
# Éditer .env (MOCK_MODE=true pour développement)
```

### Étape 5: Tester Installation

```bash
# Toujours dans backend/ avec .venv activé
python demo.py
```

Résultat attendu :
```
✅ SafetyGraphClient initialisé en mode MOCK
✅ 2 incidents récupérés
✅ 3 scores zones calculés
✅ 2 statuts formation récupérés
✅ 1 near-miss événement récupéré
```

### Étape 6: Exécuter Tests

```bash
cd tests
python test_safetygraph_client.py

# Ou avec pytest
cd ..
pytest -v
```

### Étape 7: Commit vers GitHub

```bash
# Retour à la racine du projet
cd ..

# Status
git status

# Ajouter backend/
git add backend/

# Commit
git commit -m "feat: Add Python backend with SafetyGraph integration (Sprint 1)

- SafetyGraphClient Neo4j driver
- 4 main Cypher queries (incidents, risk scores, training, near-miss)
- Pydantic validation models
- Mock mode for development
- 16 unit tests (100% pass)
- Complete documentation

Resolves: #SPRINT-1
"

# Push
git push origin main
```

---

## 🔄 Intégration avec Frontend

### Option A: Développement Local

Pour connecter vos apps HTML au backend Python local :

1. **Démarrer serveur API** (après Sprint 1+) :
```bash
cd backend
python -m uvicorn src.api.main:app --reload
```

2. **Modifier vos apps HTML** :
```javascript
// Dans ax5-safenudge-glove-selector.html
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function loadIncidents() {
  const response = await fetch(`${API_BASE_URL}/incidents/hand?days=30`);
  const data = await response.json();
  console.log(data.incidents);
}
```

### Option B: Déploiement Production

Backend et frontend séparés :

- **Frontend** : Netlify (déjà déployé sur https://ax5-nudgesafe-hands.netlify.app)
- **Backend** : Heroku, Railway, AWS Lambda, ou Azure Functions

Configuration CORS dans backend pour autoriser frontend :
```python
# backend/src/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ax5-nudgesafe-hands.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 Conventions de Commit

Pour les prochains commits backend :

```bash
# Features
git commit -m "feat(backend): Add HandRiskPredictor agent"

# Bug fixes
git commit -m "fix(backend): Correct zone risk score calculation"

# Documentation
git commit -m "docs(backend): Update API reference"

# Tests
git commit -m "test(backend): Add integration tests for Neo4j queries"

# Refactor
git commit -m "refactor(backend): Optimize SafetyGraphClient connection pooling"
```

---

## 🆘 Troubleshooting

### Problème: "Module not found"

```bash
# Vérifier environnement virtuel actif
which python  # devrait pointer vers backend/.venv/

# Si pas actif
cd backend
.venv\Scripts\activate  # Windows
```

### Problème: Tests échouent

```bash
# Mode verbose
cd backend
pytest -v -s

# Test spécifique
pytest tests/test_safetygraph_client.py::TestSafetyGraphClientMock -v
```

### Problème: Git ne voit pas les changements

```bash
# Vérifier .gitignore
cat .gitignore | grep backend

# Si backend/ ignoré par erreur, commenter la ligne
# Puis:
git add backend/ -f
```

---

## 📊 Prochaines Étapes

### Sprint 1+ : API REST

- [ ] Créer `backend/src/api/main.py` (FastAPI)
- [ ] Endpoints GET /api/v1/incidents/hand
- [ ] Endpoints GET /api/v1/zones/{zone_id}/risk
- [ ] Swagger UI documentation auto
- [ ] Tests API avec pytest-asyncio
- [ ] Déploiement Heroku/Railway

### Sprint 2 : Modèles IA

- [ ] Feature engineering dans `backend/src/agents/feature_engineering.py`
- [ ] Random Forest dans `backend/src/agents/hand_risk_predictor.py`
- [ ] Training pipeline
- [ ] Model versioning (MLflow)
- [ ] A/B testing framework

---

## ✅ Checklist Validation

Après intégration, vérifier :

- [ ] Dossier `backend/` présent à la racine du projet
- [ ] `.gitignore` mis à jour (pas de .env ou .venv commité)
- [ ] README.md principal mis à jour avec section backend
- [ ] Tests passent en local (`pytest -v`)
- [ ] Demo script fonctionne (`python demo.py`)
- [ ] Commit "feat: Add Python backend" poussé vers GitHub
- [ ] GitHub Actions CI configurées (optionnel)

---

**Intégration prête ! 🚀**

*Guide généré pour Sprint 1 - Connexion SafetyGraph*
