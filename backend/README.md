# 🐍 NudgeSafe Hands - Backend Python

**Backend Python pour intégration SafetyGraph Core × NudgeSafe Hands**

Version: 1.0.0 (Sprint 1 - Connexion SafetyGraph)  
Date: 1 février 2026

---

## 📦 Contenu

Ce backend Python connecte **NudgeSafe Hands** au **Knowledge Graph SafetyGraph Core (Neo4j)** pour accéder aux données réelles HSE.

### Structure

```
backend/
├── src/
│   ├── clients/
│   │   └── safetygraph_client.py     # Client Neo4j principal
│   ├── models/
│   │   └── safetygraph_models.py     # Modèles Pydantic validation
│   ├── api/                           # API REST (Sprint 1+)
│   ├── agents/                        # Agents IA (Sprint 2+)
│   └── utils/                         # Utilitaires
├── tests/
│   └── test_safetygraph_client.py    # Tests unitaires
├── config/                            # Configurations
├── logs/                              # Logs runtime
├── requirements.txt                   # Dépendances Python
├── .env.example                       # Template configuration
├── demo.py                            # Script démo interactive
└── README.md                          # Ce fichier
```

---

## 🚀 Installation Rapide

### Prérequis

- Python 3.9+
- pip
- (Optionnel) Neo4j 5.x pour mode production

### Installation

```bash
# Naviguer vers le dossier backend
cd backend

# Créer environnement virtuel
python -m venv .venv

# Activer environnement
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Installer dépendances
pip install -r requirements.txt

# Configurer
cp .env.example .env
# Éditer .env selon vos besoins
```

---

## ⚙️ Configuration

Éditer `.env`:

```bash
# Mode développement (sans Neo4j)
MOCK_MODE=true

# Mode production (avec Neo4j)
MOCK_MODE=false
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# Logging
LOG_LEVEL=INFO
```

---

## 🎯 Usage

### Mode Mock (Développement)

```python
from src.clients.safetygraph_client import SafetyGraphClient

# Initialisation mode mock
client = SafetyGraphClient(mock_mode=True)

# Récupérer incidents mains
incidents = client.get_hand_incidents(days=30)
print(f"✅ {len(incidents)} incidents récupérés")

# Calculer score risque zone
score = client.get_zone_risk_score("ZONE_A")
print(f"Score: {score['score']}/100 ({score['niveau']})")

# Fermer
client.close()
```

### Mode Production (Neo4j)

```python
from src.clients.safetygraph_client import SafetyGraphClient

# Context manager (recommandé)
with SafetyGraphClient(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="your_password"
) as client:
    
    # Query avec filtres
    incidents = client.get_hand_incidents(
        days=30,
        severity_min="moyen",
        zone_id="ZONE_A"
    )
    
    print(f"✅ {len(incidents)} incidents moyens/graves Zone A")
```

### Script Démo

```bash
# Lancer démo interactive complète
python demo.py
```

---

## 🧪 Tests

### Exécuter Tests

```bash
# Tests unitaires
cd tests
python test_safetygraph_client.py

# Avec pytest (recommandé)
pytest -v

# Avec couverture
pytest --cov=src --cov-report=html
```

### Résultats Attendus

```
======================================================================
Tests exécutés : 16
✅ Succès      : 16
❌ Échecs      : 0
⚠️  Erreurs     : 0
======================================================================
Couverture : >90%
```

---

## 📚 Documentation API

### SafetyGraphClient

#### Méthodes Principales

**`get_hand_incidents(days, severity_min, zone_id)`**

Récupère les incidents de blessures aux mains.

```python
incidents = client.get_hand_incidents(
    days=30,              # Derniers 30 jours
    severity_min="leger", # leger/moyen/grave
    zone_id="ZONE_A"      # Zone spécifique (optionnel)
)
```

**`get_zone_risk_score(zone_id, days)`**

Calcule le score de risque 0-100 pour une zone.

```python
score = client.get_zone_risk_score(
    zone_id="ZONE_A",
    days=90  # Sur 90 jours
)
# Retourne: {'score': 82, 'niveau': 'rouge', 'incidents_graves': 1, ...}
```

**`get_worker_training_status(zone_id, expired_only)`**

Vérifie les statuts de formation des travailleurs.

```python
trainings = client.get_worker_training_status(
    zone_id="ZONE_A",
    expired_only=True  # Seulement formations expirées
)
```

**`get_near_miss_history(zone_id, days)`**

Récupère l'historique des near-miss.

```python
near_miss = client.get_near_miss_history(
    zone_id="ZONE_A",
    days=30
)
```

---

## 🔌 Intégration avec Frontend

### Option A: API REST (Sprint 1+)

Le backend exposera une API REST FastAPI.

```python
# backend/src/api/main.py (à venir Sprint 1+)
from fastapi import FastAPI
from src.clients.safetygraph_client import SafetyGraphClient

app = FastAPI()

@app.get("/api/v1/incidents/hand")
async def get_hand_incidents(days: int = 30):
    with SafetyGraphClient() as client:
        incidents = client.get_hand_incidents(days=days)
        return {"incidents": incidents}
```

Appel frontend:
```javascript
// src/app/ax5-safenudge-glove-selector.html
fetch('http://localhost:8000/api/v1/incidents/hand?days=30')
  .then(res => res.json())
  .then(data => console.log(data.incidents));
```

### Option B: Import Direct (Application Desktop)

```python
# Pour Electron app ou app desktop
from backend.src.clients.safetygraph_client import SafetyGraphClient

client = SafetyGraphClient(mock_mode=False)
incidents = client.get_hand_incidents(days=30)
```

---

## 🛠️ Développement

### Ajouter une Nouvelle Query Cypher

1. Éditer `src/clients/safetygraph_client.py`
2. Ajouter méthode avec docstring complète
3. Créer modèle Pydantic dans `src/models/safetygraph_models.py`
4. Ajouter tests dans `tests/test_safetygraph_client.py`
5. Mettre à jour ce README

### Exemple Query Custom

```python
def get_safety_culture_index(self, zone_id: str) -> dict:
    """
    Calcule l'indice de culture sécurité.
    
    Args:
        zone_id: ID de la zone
        
    Returns:
        Dict avec index 0-100 et composantes
    """
    query = """
    MATCH (z:ZoneTravail {id: $zone_id})
    // Votre query Cypher ici
    RETURN index
    """
    
    result = self.driver.execute_query(
        query,
        zone_id=zone_id,
        database_="neo4j"
    )
    
    return {"index": result[0]["index"]}
```

---

## 📊 Modèles de Données

### HandIncident

```python
{
    "incident_id": "INC-2024-001",
    "date": "2024-01-25T14:30:00",
    "zone_id": "ZONE_A",
    "zone_nom": "Zone A - Découpe",
    "gravite": "moyen",  # leger/moyen/grave
    "partie_affectee": "main droite",
    "description": "Coupure main droite lors manipulation tôle",
    "jours_perdus": 3
}
```

### ZoneRiskScore

```python
{
    "zone_id": "ZONE_A",
    "zone_nom": "Zone A - Découpe",
    "score": 82,  # 0-100
    "niveau": "rouge",  # vert/jaune/orange/rouge
    "incidents_graves": 1,
    "incidents_moyens": 2,
    "incidents_legers": 0,
    "near_miss_count": 6,
    "periode_jours": 90
}
```

---

## 🐛 Troubleshooting

### Problème: ModuleNotFoundError

```bash
# Vérifier que vous êtes dans l'environnement virtuel
which python  # Devrait pointer vers .venv/

# Réinstaller dépendances
pip install -r requirements.txt
```

### Problème: Connexion Neo4j Failed

```bash
# Vérifier que Neo4j tourne
neo4j status

# Vérifier credentials dans .env
cat .env | grep NEO4J

# Tester connexion
python -c "from neo4j import GraphDatabase; driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'password')); driver.verify_connectivity(); print('✅ Connected')"
```

### Problème: Tests échouent

```bash
# Mode verbose
pytest -v -s

# Test spécifique
pytest tests/test_safetygraph_client.py::TestSafetyGraphClientMock::test_get_hand_incidents
```

---

## 🔐 Sécurité

### Fichiers à NE JAMAIS Commiter

❌ `.env` (contient secrets)  
❌ `*.log` (logs potentiellement sensibles)  
❌ `.venv/` (environnement virtuel)  
❌ `__pycache__/` (cache Python)

✅ Tous déjà exclus dans `.gitignore`

### Bonnes Pratiques

1. **Credentials**: Toujours via variables environnement (`.env`)
2. **Logs**: Pas de données sensibles loggées
3. **Connexions**: Toujours utiliser context managers (`with`)
4. **Validation**: Pydantic valide toutes entrées/sorties

---

## 📈 Roadmap

### ✅ Sprint 1 (Complété)
- SafetyGraphClient fonctionnel
- 4 queries Cypher principales
- Mode mock intégré
- Tests 100% pass
- Documentation complète

### 🔜 Sprint 1+ (API REST)
- FastAPI endpoints
- Swagger UI documentation
- CORS configuration
- Rate limiting
- Authentication JWT

### 🔜 Sprint 2 (Modèles IA)
- Feature engineering
- Random Forest training
- HandRiskPredictor v2
- A/B testing framework
- Model versioning

### 🔜 Sprint 3 (Boucle Rétroaction)
- NudgeEffectivenessTracker
- Apprentissage continu
- Dashboard analytics
- Alerting système

---

## 🆘 Support

### Documentation

- **README principal**: `/README.md` (projet complet)
- **API Reference**: Ce fichier (backend)
- **Delivery Report**: `/SPRINT-1-DELIVERY-REPORT.md`

### Ressources Externes

- **Neo4j Driver**: https://neo4j.com/docs/api/python-driver/current/
- **Pydantic**: https://docs.pydantic.dev/latest/
- **FastAPI**: https://fastapi.tiangolo.com/

### Contact

- **Issues**: https://github.com/Preventera/NudgeSafe-Hands/issues
- **Email**: support@preventera.ca
- **Documentation**: https://preventera.ca/docs

---

## 📄 License

MIT License © 2025 Preventera Inc. / AgenticX5 Ecosystem

---

**Prêt pour Sprint 2! 🚀**

*Backend généré par AgenticX5 - Sprint 1 Connexion SafetyGraph*
