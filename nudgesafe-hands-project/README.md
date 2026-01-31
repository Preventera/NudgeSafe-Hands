# 🧤 NudgeSafe Hands

<div align="center">

![BehaviorX × AgenticX5](https://img.shields.io/badge/BehaviorX-AgenticX5-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![ISO 45001](https://img.shields.io/badge/ISO-45001-orange?style=for-the-badge)
![CNESST](https://img.shields.io/badge/CNESST-Conforme-red?style=for-the-badge)

**Sécurité comportementale des mains par IA agentique**

*Réduire les blessures aux mains de 40% en influençant le Système 1 (instinctif) via des nudges intelligents*

[Démo Live](#-démarrage-rapide) • [Documentation](#-architecture) • [Contribuer](#-contribution)

</div>

---

## 🎯 Le Problème

Les **blessures aux mains** sont l'**accident industriel évitable #1** au niveau mondial.

| Fait | Impact |
|------|--------|
| 90-95% des décisions | Prises par le Système 1 (instinctif) |
| Formations traditionnelles | Ciblent le Système 2 (réflexif) |
| Travailleurs < 1 an | 3x plus de risques |

**Les formations traditionnelles ne fonctionnent pas** car elles ciblent le mauvais système cognitif.

---

## 💡 La Solution : Théorie du Nudge

> *"Un nudge est tout aspect de l'architecture de choix qui modifie le comportement de manière prévisible sans interdire d'options."*  
> — Richard Thaler (Nobel 2017) & Cass Sunstein

### 4 Stratégies Nudge Validées

| Stratégie | Description | Exemple |
|-----------|-------------|---------|
| 👁️ **Direction visuelle** | Icônes et symboles universels | Pictogramme gant à l'entrée de zone |
| 🔔 **Feedback** | Indices visuels/audio temps réel | Lumière rouge si pas de gants |
| 👥 **Preuve sociale** | Influence des pairs | "94% de vos collègues protégés" |
| ⏱️ **Timing opportun** | Bonne info au bon moment | Alerte 30s avant zone à risque |

---

## 🏗️ Architecture AgenticX5 — 5 Niveaux

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│     N1      │     N2      │     N3      │     N4      │     N5      │
│  Collecte   │ Normalisation│   Analyse   │Recommandation│Orchestration│
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Vision IA   │ ISO 45001   │ Scoring     │ Nudges      │ 4 Agents IA │
│ RFID        │ CNESST/OSHA │ Prédiction  │ personnalisés│ spécialisés │
│ IoT/ERP     │ Taxonomie   │ 72h         │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Les 4 Agents IA

| Agent | Rôle | Cadence |
|-------|------|---------|
| **NudgeOrchestrator** | Coordonner les nudges temps réel | < 500ms |
| **HandRiskPredictor** | Anticiper les pics de risque | Toutes les 6h |
| **NudgeEffectivenessTracker** | Mesurer et optimiser | Hebdomadaire |
| **ComplianceReporter** | Générer les packs d'audit | Mensuel |

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/Preventera/NudgeSafe-Hands.git
cd NudgeSafe-Hands

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement avec hot-reload |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |

---

## 📊 Objectifs Mesurables (12 mois)

| KPI | Cible |
|-----|-------|
| 🎯 Blessures mains évitables | **-40%** |
| 🧤 Port gants zones rouges | **> 98%** |
| ⚡ Efficacité nudges (60s) | **> 85%** |
| 💰 ROI prévention | **4:1** |

### KPIs Éthiques

- ✅ Satisfaction travailleurs > 70%
- ✅ Perception surveillance < 20% "intrusive"
- ✅ Exercice droit d'appel < 5%

---

## 📋 Conformité

| Standard | Statut |
|----------|--------|
| ISO 45001:2018 | ✅ Conforme |
| CNESST RSST | ✅ Conforme |
| OSHA 1910.138 | ✅ Conforme |
| Loi 25 / RGPD | ✅ Conforme |
| NIST AI RMF | ✅ Conforme |
| ISO 45003 | ✅ Conforme |

---

## 🗂️ Structure du Projet

```
NudgeSafe-Hands/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── NudgeSafeDashboard.jsx    # Dashboard principal
│   ├── data/
│   │   └── mockData.js               # Données simulées
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   └── specs.md                      # Spécifications complètes
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔧 Technologies

- **Frontend**: React 18 + Vite
- **Icons**: Lucide React
- **Styling**: CSS-in-JS
- **Fonts**: JetBrains Mono

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📜 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

---

## 👥 Équipe

**GenAISafety — Preventera**

- 🌐 [preventera.com](https://preventera.com)
- 📧 contact@genaisafety.com

---

## 🙏 Remerciements

- Richard Thaler & Cass Sunstein — Théorie du Nudge
- Joe Geng, Superior Glove — "REThinking Hand Safety"
- OHS Canada Magazine — Série webinaires 2024-2025
- Daniel Kahneman — Système 1 / Système 2

---

<div align="center">

**Charte d'Écosystème AgenticX5 v1.0**

*Primauté de la vie • Éthique • Prévention • Performance durable • Inclusion • Innovation responsable • Transparence*

</div>
