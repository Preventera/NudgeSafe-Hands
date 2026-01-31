# AX5-SafeNudge™ — Guide Setup Développeur
## Configuration Projet Local + GitHub

---

## 🚀 SETUP INITIAL

### Prérequis

```bash
# Vérifier installations
node --version        # v16+ requis
npm --version         # v8+ requis
python --version      # v3.8+ requis
git --version         # v2.30+ requis
```

---

## 📁 STRUCTURE PROJET RECOMMANDÉE

```
AX5-SafeNudge/
│
├── 📁 frontend/                    # Applications web
│   ├── glove-selector/             # App principale
│   │   ├── index.html
│   │   ├── styles/
│   │   └── scripts/
│   ├── dashboard/                  # Dashboard superviseur
│   └── presentation/               # Présentation slides
│
├── 📁 backend/                     # API & Services
│   ├── api/                        # REST API
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── agents/                     # 4 Agents AgenticX5
│   │   ├── nudge-orchestrator/
│   │   ├── risk-predictor/
│   │   ├── effectiveness-tracker/
│   │   └── compliance-reporter/
│   └── parsers/                    # FDS Parser
│       └── fds_parser.py
│
├── 📁 database/                    # Données
│   ├── chemicals.json              # 15 produits chimiques
│   ├── gloves.json                 # 8 matériaux
│   └── migrations/                 # DB migrations
│
├── 📁 docs/                        # Documentation
│   ├── README.md
│   ├── api-reference.md
│   ├── deployment-guide.md
│   └── training-program.md
│
├── 📁 tests/                       # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📁 config/                      # Configuration
│   ├── development.json
│   ├── production.json
│   └── .env.example
│
├── 📁 scripts/                     # Scripts utilitaires
│   ├── setup.sh
│   ├── deploy.sh
│   └── seed-db.js
│
├── .gitignore
├── package.json
├── requirements.txt
└── README.md
```

---

## 🔗 CONFIGURATION GIT & GITHUB

### 1. Initialiser le Repository Local

```bash
# Naviguer vers le dossier
cd C:\Users\Mario\Documents\PROJECTS_NEW\AX5-SafeNudge

# Initialiser Git (si pas déjà fait)
git init

# Configurer Git (si première fois)
git config user.name "Mario"
git config user.email "your.email@example.com"
```

### 2. Connecter au Repository GitHub

```bash
# Ajouter le remote GitHub
git remote add origin https://github.com/Preventera/NudgeSafe-Hands.git

# Vérifier la connexion
git remote -v

# Devrait afficher:
# origin  https://github.com/Preventera/NudgeSafe-Hands.git (fetch)
# origin  https://github.com/Preventera/NudgeSafe-Hands.git (push)
```

### 3. Synchroniser avec le Remote

```bash
# Récupérer l'état du remote
git fetch origin

# Option A: Si le repo GitHub est vide
git branch -M main
git push -u origin main

# Option B: Si le repo GitHub existe déjà
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 4. Structure Branches Recommandée

```bash
# Créer branches de développement
git checkout -b develop              # Branche développement
git checkout -b feature/frontend     # Features frontend
git checkout -b feature/backend      # Features backend
git checkout -b feature/agents       # Agents IA
git checkout -b hotfix/bugs          # Corrections urgentes

# Retourner à main
git checkout main
```

---

## 📝 FICHIER .gitignore RECOMMANDÉ

Créer `.gitignore` à la racine:

```gitignore
# AX5-SafeNudge .gitignore

# Dependencies
node_modules/
__pycache__/
*.pyc
.Python
env/
venv/
ENV/
.venv

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment variables
.env
.env.local
.env.development
.env.production
*.key
*.pem

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.min.js
*.min.css

# Database
*.db
*.sqlite
*.sqlite3
/database/backups/

# OS
.DS_Store
Thumbs.db
desktop.ini

# Testing
coverage/
.nyc_output/
.pytest_cache/

# Temporary files
tmp/
temp/
*.tmp
*.bak
*.cache

# Sensitive data
/config/secrets/
credentials.json
token.json

# Package managers
package-lock.json  # Optionnel, selon préférence équipe
yarn.lock
```

---

## 📦 CONFIGURATION package.json

Créer `package.json` à la racine:

```json
{
  "name": "@agenticx5/safenudge",
  "version": "1.0.0",
  "description": "AX5-SafeNudge - Behavioral AI for Hand Safety",
  "author": "AgenticX5 Ecosystem / Preventera",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Preventera/NudgeSafe-Hands.git"
  },
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:frontend": "http-server frontend -p 3000 -o",
    "dev:backend": "nodemon backend/api/server.js",
    "build": "npm run build:frontend && npm run build:backend",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .js,.jsx",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "deploy": "npm run build && node scripts/deploy.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "http-server": "^14.1.1",
    "nodemon": "^3.0.2",
    "npm-run-all": "^4.1.5",
    "jest": "^29.7.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  },
  "keywords": [
    "safenudge",
    "ax5",
    "hand-safety",
    "behavioral-ai",
    "hse",
    "preventera"
  ]
}
```

---

## 🐍 CONFIGURATION requirements.txt

Créer `requirements.txt` pour Python:

```txt
# AX5-SafeNudge Python Dependencies

# Core
python>=3.8

# API Framework
flask>=3.0.0
flask-cors>=4.0.0
flask-jwt-extended>=4.5.3

# Data Processing
pandas>=2.1.0
numpy>=1.24.0

# FDS Parser
PyPDF2>=3.0.1
pdfplumber>=0.10.3
regex>=2023.10.3

# Database
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.9

# ML/AI (pour agents)
scikit-learn>=1.3.0
joblib>=1.3.2

# Testing
pytest>=7.4.0
pytest-cov>=4.1.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0

# Development
black>=23.12.0
flake8>=6.1.0
mypy>=1.7.0
```

---

## ⚙️ CONFIGURATION VS CODE

### settings.json (Workspace)

Créer `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/dist": true,
    "**/build": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.venv": true
  },
  "python.defaultInterpreterPath": ".venv/Scripts/python.exe",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

### Extensions VS Code Recommandées

Créer `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.vscode-pylance",
    "eamodio.gitlens",
    "ritwickdey.liveserver",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "vincaslt.highlight-matching-tag",
    "donjayamanne.githistory"
  ]
}
```

---

## 🚀 SCRIPTS DE DÉMARRAGE

### setup.sh (Linux/Mac) ou setup.bat (Windows)

**setup.bat** pour Windows:

```batch
@echo off
echo ========================================
echo  AX5-SafeNudge Setup Script
echo ========================================

echo.
echo [1/5] Création environnement Python...
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [2/5] Installation dépendances Node.js...
npm install

echo.
echo [3/5] Création fichiers configuration...
if not exist config\development.json copy config\.env.example config\development.json

echo.
echo [4/5] Initialisation base de données...
node scripts\seed-db.js

echo.
echo [5/5] Configuration Git hooks...
git config core.hooksPath .githooks

echo.
echo ========================================
echo  Setup terminé avec succès!
echo ========================================
echo.
echo Commandes disponibles:
echo   npm run dev         - Démarrer serveur développement
echo   npm run test        - Lancer les tests
echo   npm run build       - Build production
echo.
```

---

## 🔧 WORKFLOW GIT QUOTIDIEN

### Début de journée

```bash
# Mettre à jour depuis GitHub
git pull origin main

# Créer branche pour nouvelle feature
git checkout -b feature/nom-feature
```

### Pendant le développement

```bash
# Vérifier les fichiers modifiés
git status

# Ajouter fichiers spécifiques
git add frontend/glove-selector/index.html
git add backend/api/routes/chemicals.js

# Ou tout ajouter
git add .

# Commit avec message descriptif
git commit -m "feat: Add chemical analysis endpoint"

# Format messages:
# feat:     Nouvelle fonctionnalité
# fix:      Correction bug
# docs:     Documentation
# style:    Formatage code
# refactor: Refactoring
# test:     Tests
# chore:    Tâches diverses
```

### Fin de journée / Push vers GitHub

```bash
# Push vers GitHub
git push origin feature/nom-feature

# Si c'est votre première push de cette branche
git push -u origin feature/nom-feature
```

### Merge dans main

```bash
# Retour à main
git checkout main

# Mettre à jour main
git pull origin main

# Merger la feature
git merge feature/nom-feature

# Push vers GitHub
git push origin main

# Supprimer branche locale (optionnel)
git branch -d feature/nom-feature
```

---

## 📋 CHECKLIST PREMIER DÉMARRAGE

```
□ Git installé et configuré
□ Node.js v16+ installé
□ Python 3.8+ installé
□ VS Code avec extensions recommandées
□ Repository GitHub créé (Preventera/NudgeSafe-Hands)
□ Projet local initialisé
□ Remote GitHub ajouté
□ .gitignore créé
□ package.json créé
□ requirements.txt créé
□ Environnement virtuel Python créé
□ Dépendances installées (npm install)
□ Configuration VS Code (.vscode/)
□ Premier commit effectué
□ Push initial vers GitHub
□ Branches de développement créées
□ README.md à jour
```

---

## 🔐 CONFIGURATION SECRETS (.env)

Créer `.env` à la racine (NE PAS COMMITER):

```env
# AX5-SafeNudge Environment Variables

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=safenudge_dev
DB_USER=safenudge_user
DB_PASSWORD=your_secure_password

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=24h

# API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-your-anthropic-key

# Email (notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=debug

# AX5-SafeNudge Specific
NUDGE_THRESHOLD_ORANGE=50
NUDGE_THRESHOLD_RED=75
PREDICTION_WINDOW_HOURS=72
```

**Créer aussi `.env.example`** (version publique):

```env
# AX5-SafeNudge Environment Variables (Example)

NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api/v1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=safenudge_dev
DB_USER=safenudge_user
DB_PASSWORD=change_me

JWT_SECRET=change_me_to_random_string
JWT_EXPIRATION=24h

# ... (autres variables sans valeurs sensibles)
```

---

## 🧪 COMMANDES DE TEST

```bash
# Installer dépendances de test
npm install --save-dev jest @testing-library/react

# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests spécifiques
npm test -- chemicals.test.js
```

---

## 📊 COMMANDES UTILES

### Node.js / Frontend

```bash
# Démarrer serveur dev
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Formatter
npm run format
```

### Python / Backend

```bash
# Activer environnement virtuel
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Lancer serveur Flask
python backend/api/server.py

# Tests Python
pytest tests/

# Coverage Python
pytest --cov=backend tests/
```

### Git

```bash
# Statut
git status

# Historique
git log --oneline --graph --all

# Voir différences
git diff

# Annuler modifications fichier
git checkout -- fichier.js

# Revenir à commit précédent (dangereux!)
git reset --hard HEAD~1
```

---

## 🆘 TROUBLESHOOTING

### Problème: Git remote already exists

```bash
git remote remove origin
git remote add origin https://github.com/Preventera/NudgeSafe-Hands.git
```

### Problème: Port 3000 déjà utilisé

```bash
# Windows - trouver processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer port dans .env
PORT=3001
```

### Problème: Python module not found

```bash
# Réinstaller dépendances
.venv\Scripts\activate
pip install -r requirements.txt --upgrade
```

### Problème: VS Code ne trouve pas Python

```
Ctrl+Shift+P > Python: Select Interpreter
Sélectionner: .venv\Scripts\python.exe
```

---

## 📚 RESSOURCES

**Documentation:**
- README.md principal
- /docs/api-reference.md
- /docs/deployment-guide.md

**Support:**
- GitHub Issues: https://github.com/Preventera/NudgeSafe-Hands/issues
- Email: support@safenudge.com

**Formation:**
- training-program-ax5.md (3 niveaux)

---

## 🎯 PROCHAINES ÉTAPES

1. **Aujourd'hui:**
   - [ ] Exécuter setup.bat
   - [ ] Tester `npm run dev`
   - [ ] Premier commit + push

2. **Cette semaine:**
   - [ ] Implémenter feature prioritaire
   - [ ] Écrire premiers tests
   - [ ] Documenter API

3. **Ce mois:**
   - [ ] Déployer version beta
   - [ ] Obtenir feedback utilisateurs
   - [ ] Itérer

---

*Guide Setup Développeur AX5-SafeNudge™ v1.0*  
*© 2025 AgenticX5 Ecosystem / Preventera*  
*Dernière mise à jour: 30 janvier 2025*
