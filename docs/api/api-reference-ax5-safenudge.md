# API Reference - GenAISafety Glove Selector

## 📡 Endpoints Documentation

Base URL: `https://api.nudgesafe.com/v1`

---

## 1. Glove Selection & Recommendation

### `POST /genaisafety/analyze`

Analyse une tâche et recommande le gant approprié avec génération de nudge.

**Authentication:** Bearer Token required

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer {access_token}
X-Site-ID: {site_identifier}
```

**Request Body:**
```json
{
  "task": {
    "name": "Nettoyage de cuve de stockage",
    "task_id": "TASK-2025-001",
    "zone_id": "ZONE-C"
  },
  "chemical": {
    "name": "acétone",
    "cas": "67-64-1",
    "concentration": "99%"
  },
  "exposure": {
    "duration_minutes": 45,
    "frequency": "daily",
    "contact_type": "immersion"
  },
  "current_glove": {
    "material": "nitrile",
    "thickness_mm": 0.15,
    "glove_id": "GLV-12345"
  },
  "worker_profile": {
    "worker_id": "anonymized_hash_abc123",
    "allergies": ["latex"],
    "dexterity_required": "high",
    "hand_size": "L"
  }
}
```

**Response 200 - Success:**
```json
{
  "status": "success",
  "timestamp": "2025-01-30T15:42:00Z",
  "analysis_id": "ANA-2025-30-15420",
  
  "recommendation": {
    "primary_glove": {
      "material": "butyle",
      "min_thickness_mm": 0.5,
      "standard": "EN 374-1:2016",
      "breakthrough_time_minutes": 240,
      "recommended_brands": [
        "Ansell AlphaTec 09-430",
        "MAPA Vital 117"
      ]
    },
    "alternatives": [
      {
        "material": "SilverShield",
        "breakthrough_time_minutes": 180,
        "notes": "Laminé multi-couches, usage unique"
      },
      {
        "material": "Viton",
        "breakthrough_time_minutes": 300,
        "notes": "Excellente résistance, coût élevé"
      }
    ],
    "unsuitable_materials": [
      "latex",
      "vinyle",
      "nitrile léger",
      "PVC"
    ],
    "safe_duration_max_minutes": 192,
    "replacement_frequency": "Changer gants toutes les 3 heures"
  },
  
  "risk_assessment": {
    "level": "élevé",
    "score": 75,
    "hazards": [
      {
        "type": "chemical",
        "description": "Solvant organique inflammable",
        "severity": "high"
      },
      {
        "type": "permeation",
        "description": "Perméation rapide dans nitrile standard",
        "severity": "critical"
      }
    ],
    "health_effects": "Irritation cutanée, dessèchement, absorption systémique possible",
    "osha_standard": "29 CFR 1910.1000",
    "en_norm": "EN 374-1:2016",
    "pictograms": ["GHS02", "GHS07"]
  },
  
  "nudge": {
    "status": "warning",
    "type": "orange",
    "icon": "🟠",
    "title": "Attention - Gant Insuffisant",
    "message": "Le gant nitrile (0.15mm) est insuffisant pour l'acétone. Temps de percée < 20 minutes. Risque de perméation rapide et d'exposition cutanée. Utilisez immédiatement un gant butyle (min 0.5mm).",
    "action_required": "Changer de gant avant exposition",
    "urgency": "high",
    "auto_lock_machine": false
  },
  
  "compliance": {
    "conformity": false,
    "reason": "Matériau inadapté - Breakthrough time insuffisant",
    "hitl_required": false,
    "supervisor_notification": true,
    "audit_flag": true
  },
  
  "additional_info": {
    "fds_section8_summary": "Protection mains requise. Utiliser gants résistants solvants organiques.",
    "storage_requirements": "Stocker gants à l'abri de la lumière et chaleur",
    "inspection_checklist": [
      "Vérifier intégrité avant usage",
      "Pas de trous ni fissures",
      "Date de péremption valide"
    ]
  }
}
```

**Response 400 - Invalid Request:**
```json
{
  "status": "error",
  "error_code": "INVALID_CHEMICAL",
  "message": "Le produit chimique 'xyz' n'est pas reconnu dans la base de données",
  "suggestion": "Vérifiez le nom ou le numéro CAS. Consultez /chemicals/list",
  "timestamp": "2025-01-30T15:42:00Z"
}
```

**Response 404 - Not Found:**
```json
{
  "status": "error",
  "error_code": "CHEMICAL_NOT_FOUND",
  "message": "Aucune donnée de compatibilité disponible pour ce produit",
  "next_steps": "Contactez HSE pour ajout dans la base de données",
  "timestamp": "2025-01-30T15:42:00Z"
}
```

---

## 2. Chemical Database Queries

### `GET /genaisafety/chemicals`

Récupère la liste complète des produits chimiques dans la base de données.

**Query Parameters:**
- `search` (optional): Recherche par nom ou CAS
- `risk_level` (optional): Filtre par niveau de risque (critique, élevé, modéré, faible)
- `limit` (optional): Nombre de résultats (default: 50)
- `offset` (optional): Pagination (default: 0)

**Example Request:**
```http
GET /genaisafety/chemicals?search=acide&risk_level=élevé
```

**Response 200:**
```json
{
  "status": "success",
  "total_count": 127,
  "returned_count": 15,
  "chemicals": [
    {
      "id": "CHEM-001",
      "name": "Acétone",
      "cas": "67-64-1",
      "category": "Solvant organique",
      "risk_level": "élevé",
      "recommended_glove": "Butyle",
      "osha_standard": "29 CFR 1910.1000"
    },
    {
      "id": "CHEM-003",
      "name": "Acide sulfurique 98%",
      "cas": "7664-93-9",
      "category": "Acide fort",
      "risk_level": "critique",
      "recommended_glove": "Néoprène",
      "osha_standard": "29 CFR 1910.1000"
    }
  ]
}
```

---

### `GET /genaisafety/chemicals/{cas_number}`

Récupère les détails complets d'un produit chimique spécifique.

**Example Request:**
```http
GET /genaisafety/chemicals/67-64-1
```

**Response 200:**
```json
{
  "status": "success",
  "chemical": {
    "name": "Acétone",
    "cas": "67-64-1",
    "synonyms": ["Propanone", "Diméthylcétone", "2-Propanone"],
    "category": "Solvant organique",
    "molecular_formula": "C3H6O",
    "molecular_weight": 58.08,
    
    "hazards": {
      "risk_level": "élevé",
      "ghs_classification": ["Flam. Liq. 2", "Eye Irrit. 2", "STOT SE 3"],
      "pictograms": ["GHS02", "GHS07"],
      "signal_word": "Danger",
      "h_statements": [
        "H225: Liquide et vapeurs très inflammables",
        "H319: Provoque une sévère irritation des yeux",
        "H336: Peut provoquer somnolence ou vertiges"
      ],
      "p_statements": [
        "P210: Tenir à l'écart de la chaleur, surfaces chaudes, étincelles",
        "P280: Porter des gants de protection/des vêtements de protection"
      ]
    },
    
    "glove_compatibility": {
      "recommended": [
        {
          "material": "Butyle",
          "breakthrough_time_minutes": 240,
          "permeation_rate": "< 0.1 µg/cm²/min",
          "degradation_rating": "Excellent"
        },
        {
          "material": "SilverShield",
          "breakthrough_time_minutes": 180,
          "permeation_rate": "< 0.5 µg/cm²/min",
          "degradation_rating": "Excellent"
        }
      ],
      "unsuitable": [
        {
          "material": "Nitrile",
          "breakthrough_time_minutes": 15,
          "permeation_rate": "> 10 µg/cm²/min",
          "degradation_rating": "Faible",
          "reason": "Perméation rapide - Protection insuffisante"
        },
        {
          "material": "Latex",
          "breakthrough_time_minutes": 5,
          "permeation_rate": "> 50 µg/cm²/min",
          "degradation_rating": "Très faible",
          "reason": "Dégradation immédiate"
        }
      ]
    },
    
    "exposure_limits": {
      "osha_pel_8h": "1000 ppm",
      "niosh_rel_10h": "250 ppm",
      "acgih_tlv_8h": "250 ppm",
      "stel_15min": "500 ppm"
    },
    
    "first_aid": {
      "skin_contact": "Laver abondamment à l'eau et au savon. Consulter un médecin si irritation persiste.",
      "eye_contact": "Rincer immédiatement et abondamment à l'eau pendant au moins 15 minutes. Consulter un ophtalmologiste.",
      "inhalation": "Transporter la victime à l'air frais. En cas de difficultés respiratoires, administrer de l'oxygène.",
      "ingestion": "Ne PAS faire vomir. Consulter immédiatement un médecin."
    },
    
    "references": [
      {
        "source": "NIOSH Pocket Guide",
        "url": "https://www.cdc.gov/niosh/npg/npgd0004.html"
      },
      {
        "source": "OSHA Chemical Data",
        "url": "https://www.osha.gov/chemicaldata/40"
      }
    ]
  }
}
```

---

## 3. FDS (SDS) Parsing

### `POST /genaisafety/parse-fds`

Parse automatiquement une FDS (Section 8) pour extraire les recommandations EPI.

**Request Body (Multipart Form Data):**
```
file: [PDF file]
section: 8 (optional, default: 8)
language: fr (optional, default: fr)
```

**OR JSON:**
```json
{
  "text": "Section 8 - Contrôles de l'exposition...",
  "chemical_name": "Toluène",
  "section_number": 8
}
```

**Response 200:**
```json
{
  "status": "success",
  "parsed_data": {
    "chemical_detected": "Toluène",
    "cas_detected": "108-88-3",
    "section_8_content": {
      "recommended_materials": ["Butyle", "Viton", "SilverShield"],
      "avoid_materials": ["Nitrile", "Latex", "Vinyle"],
      "breakthrough_time_mentioned": 240,
      "thickness_requirement": "> 0.5 mm",
      "additional_notes": "Changer gants toutes les 4 heures maximum"
    },
    "confidence_score": 0.95,
    "extraction_method": "regex + nlp",
    "verification_needed": false
  }
}
```

---

## 4. Nudge Generation

### `POST /genaisafety/nudge/generate`

Génère un nudge comportemental personnalisé basé sur la situation.

**Request Body:**
```json
{
  "situation": {
    "current_glove": "nitrile",
    "recommended_glove": "butyle",
    "chemical": "acétone",
    "risk_level": "élevé"
  },
  "worker_context": {
    "experience_months": 6,
    "previous_violations": 0,
    "language_preference": "fr",
    "reading_level": "intermediate"
  },
  "nudge_preferences": {
    "tone": "firm",
    "include_image": true,
    "include_video": false
  }
}
```

**Response 200:**
```json
{
  "status": "success",
  "nudge": {
    "id": "NUDGE-2025-001",
    "type": "warning",
    "status_color": "orange",
    "icon": "🟠",
    "title": "Attention - Changement de Gant Requis",
    "message_short": "Gant nitrile inadapté pour acétone",
    "message_detailed": "Le gant nitrile que vous portez n'offre qu'une protection de 15 minutes contre l'acétone. Pour votre sécurité, utilisez un gant butyle qui protège pendant 4 heures.",
    "action_button": {
      "text": "Changer de gant maintenant",
      "action": "open_glove_dispenser"
    },
    "visual_aid": {
      "type": "comparison_image",
      "url": "https://cdn.nudgesafe.com/nudges/nitrile-vs-butyle-acetone.png"
    },
    "learning_tip": "💡 Astuce : Les solvants organiques comme l'acétone traversent rapidement le nitrile. Privilégiez toujours le butyle pour ces produits.",
    "estimated_compliance_rate": 0.87,
    "a_b_test_variant": "variant_B"
  }
}
```

---

## 5. Compliance & Logging

### `POST /genaisafety/log/selection`

Enregistre une sélection de gant pour audit et traçabilité.

**Request Body:**
```json
{
  "event": {
    "timestamp": "2025-01-30T15:42:00Z",
    "event_type": "glove_selection",
    "site_id": "SITE-MTL-001",
    "zone_id": "ZONE-C"
  },
  "worker": {
    "worker_hash": "anonymized_abc123",
    "role": "technician"
  },
  "task": {
    "task_id": "TASK-2025-001",
    "task_name": "Nettoyage cuve"
  },
  "chemical": {
    "name": "acétone",
    "cas": "67-64-1"
  },
  "glove_selection": {
    "recommended_glove": "butyle",
    "actual_glove": "butyle",
    "conformity": true,
    "change_from": "nitrile",
    "reason_for_change": "nudge_alert"
  },
  "nudge": {
    "nudge_id": "NUDGE-2025-001",
    "displayed": true,
    "action_taken": "changed_glove",
    "response_time_seconds": 45
  }
}
```

**Response 201 - Created:**
```json
{
  "status": "success",
  "log_id": "LOG-2025-30-154200",
  "message": "Selection logged successfully",
  "audit_trail": {
    "stored": true,
    "retention_days": 2555,
    "accessible_by": ["hse_manager", "auditor"]
  }
}
```

---

## 6. Analytics & Reporting

### `GET /genaisafety/analytics/summary`

Récupère un résumé analytique des sélections de gants.

**Query Parameters:**
- `start_date`: Date de début (ISO 8601)
- `end_date`: Date de fin (ISO 8601)
- `site_id` (optional): Filtre par site
- `zone_id` (optional): Filtre par zone

**Response 200:**
```json
{
  "status": "success",
  "period": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-01-30T23:59:59Z",
    "days": 30
  },
  "summary": {
    "total_selections": 1247,
    "conformity_rate": 0.94,
    "non_conformities": 75,
    "nudges_displayed": 312,
    "nudge_effectiveness": 0.89,
    "incidents_prevented_estimated": 18
  },
  "top_chemicals": [
    {
      "chemical": "Acétone",
      "selections": 245,
      "non_conformity_rate": 0.08,
      "most_common_error": "Using nitrile instead of butyle"
    },
    {
      "chemical": "Acide sulfurique",
      "selections": 189,
      "non_conformity_rate": 0.03,
      "most_common_error": "Using latex"
    }
  ],
  "recommendations": [
    "Renforcer formation sur solvants organiques",
    "Augmenter stock gants butyle en Zone C"
  ]
}
```

---

## Error Codes Reference

| Code | Message | HTTP Status | Action |
|------|---------|-------------|--------|
| `INVALID_CHEMICAL` | Produit chimique non reconnu | 400 | Vérifier nom/CAS |
| `CHEMICAL_NOT_FOUND` | Pas de données disponibles | 404 | Contacter HSE |
| `INVALID_TOKEN` | Token d'authentification invalide | 401 | Renouveler token |
| `INSUFFICIENT_DATA` | Données incomplètes | 400 | Compléter requête |
| `RATE_LIMIT_EXCEEDED` | Limite de requêtes dépassée | 429 | Attendre 60s |
| `SERVER_ERROR` | Erreur serveur | 500 | Réessayer plus tard |

---

## Rate Limits

| Endpoint | Limite | Période |
|----------|--------|---------|
| `/analyze` | 100 requêtes | Par minute |
| `/chemicals` | 200 requêtes | Par minute |
| `/parse-fds` | 20 requêtes | Par minute |
| `/log/*` | 500 requêtes | Par minute |

---

## Authentication

Toutes les requêtes nécessitent un Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Obtenir un token:**
```http
POST /auth/token
Content-Type: application/json

{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "scope": "genaisafety:read genaisafety:write"
}
```

---

## Webhooks (Optional)

Configurez des webhooks pour recevoir des notifications en temps réel:

**Events disponibles:**
- `glove.selection.non_compliant`
- `nudge.displayed`
- `nudge.action_taken`
- `chemical.added`
- `fds.parsed`

**Configuration:**
```http
POST /webhooks/configure
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["glove.selection.non_compliant"],
  "secret": "your_webhook_secret"
}
```

---

**API Version:** v1.0.0
**Last Updated:** 2025-01-30
**Support:** api-support@nudgesafe.com

*Conforme OSHA • EN 374 • ISO 45001 • RGPD/Loi 25*
