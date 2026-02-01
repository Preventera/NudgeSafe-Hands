"""
Modèles de Données - SafetyGraph Integration
Sprint 1: Schémas Pydantic pour validation et sérialisation

Ces modèles assurent la cohérence des données entre SafetyGraph Neo4j 
et NudgeSafe Hands Backend.

Author: AgenticX5 Ecosystem
Version: 1.0.0 (Sprint 1)
"""

from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field, validator


class HandIncident(BaseModel):
    """
    Modèle pour un incident de blessure aux mains.
    
    Correspond aux données retournées par SafetyGraphClient.get_hand_incidents()
    """
    id: str = Field(..., description="Identifiant unique incident")
    date: str = Field(..., description="Date/heure incident (ISO format)")
    zone: str = Field(..., description="Nom de la zone de travail")
    zone_id: str = Field(..., description="Identifiant zone")
    gravite: Literal["leger", "moyen", "grave"] = Field(
        ..., 
        description="Niveau de gravité"
    )
    description: str = Field(..., description="Description incident")
    partie_affectee: str = Field(..., description="Partie du corps affectée")
    jours_perdus: int = Field(0, ge=0, description="Jours de travail perdus")
    type_lesion: str = Field(..., description="Type de lésion")
    
    @validator("date")
    def validate_date_format(cls, v):
        """Valide que la date est au format ISO."""
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError(f"Date invalide: {v}. Format attendu: ISO 8601")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "INC-2024-001",
                "date": "2024-01-25T14:30:00",
                "zone": "Zone A - Découpe",
                "zone_id": "ZONE_A",
                "gravite": "moyen",
                "description": "Coupure main droite lors manipulation tôle",
                "partie_affectee": "main droite - index",
                "jours_perdus": 3,
                "type_lesion": "coupure"
            }
        }


class ZoneRiskScore(BaseModel):
    """
    Score de risque calculé pour une zone de travail.
    
    Correspond aux données retournées par SafetyGraphClient.get_zone_risk_score()
    """
    zone_id: str = Field(..., description="Identifiant zone")
    zone_nom: str = Field(..., description="Nom zone")
    score: int = Field(..., ge=0, le=100, description="Score risque 0-100")
    niveau: Literal["vert", "jaune", "orange", "rouge"] = Field(
        ...,
        description="Niveau de risque"
    )
    incidents_total: int = Field(0, ge=0, description="Total incidents période")
    incidents_graves: int = Field(0, ge=0, description="Incidents graves")
    incidents_moyens: int = Field(0, ge=0, description="Incidents moyens")
    incidents_legers: int = Field(0, ge=0, description="Incidents légers")
    near_miss_total: int = Field(0, ge=0, description="Total near-miss")
    periode_jours: int = Field(90, gt=0, description="Période analyse (jours)")
    error: Optional[str] = Field(None, description="Message erreur si applicable")
    
    @validator("niveau")
    def validate_niveau_coherence(cls, v, values):
        """Valide cohérence niveau avec score."""
        if "score" not in values:
            return v
        
        score = values["score"]
        expected_niveau = (
            "rouge" if score >= 76
            else "orange" if score >= 51
            else "jaune" if score >= 26
            else "vert"
        )
        
        if v != expected_niveau:
            raise ValueError(
                f"Incohérence niveau '{v}' avec score {score}. "
                f"Attendu: '{expected_niveau}'"
            )
        
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "zone_id": "ZONE_A",
                "zone_nom": "Zone A - Découpe",
                "score": 82,
                "niveau": "vert",
                "incidents_total": 3,
                "incidents_graves": 1,
                "incidents_moyens": 1,
                "incidents_legers": 1,
                "near_miss_total": 6,
                "periode_jours": 90
            }
        }


class WorkerTrainingStatus(BaseModel):
    """
    Statut de formation d'un travailleur.
    
    Correspond aux données retournées par SafetyGraphClient.get_worker_training_status()
    """
    worker_id: str = Field(..., description="Identifiant travailleur")
    nom: str = Field(..., description="Nom complet travailleur")
    formation_date: str = Field(..., description="Date formation (ISO)")
    formation_valide: bool = Field(..., description="Formation valide (<365 jours)")
    jours_depuis_formation: int = Field(..., ge=0, description="Jours depuis formation")
    
    @validator("formation_valide")
    def validate_formation_validity(cls, v, values):
        """Valide cohérence validité avec jours écoulés."""
        if "jours_depuis_formation" not in values:
            return v
        
        jours = values["jours_depuis_formation"]
        expected_valid = jours <= 365
        
        if v != expected_valid:
            raise ValueError(
                f"Incohérence formation_valide={v} avec {jours} jours. "
                f"Attendu: {expected_valid}"
            )
        
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "worker_id": "W001",
                "nom": "Jean Tremblay",
                "formation_date": "2023-11-15",
                "formation_valide": True,
                "jours_depuis_formation": 77
            }
        }


class NearMissEvent(BaseModel):
    """
    Événement near-miss (quasi-accident).
    
    Correspond aux données retournées par SafetyGraphClient.get_near_miss_history()
    """
    id: str = Field(..., description="Identifiant near-miss")
    date: str = Field(..., description="Date détection (ISO)")
    description: str = Field(..., description="Description événement")
    risque_potentiel: str = Field(..., description="Risque évité")
    action_corrective: str = Field(..., description="Action corrective prise")
    
    @validator("date")
    def validate_date_format(cls, v):
        """Valide format date ISO."""
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError(f"Date invalide: {v}")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "NM-2024-001",
                "date": "2024-01-30T11:20:00",
                "description": "Travailleur a failli coincer main dans presse",
                "risque_potentiel": "Écrasement main - grave",
                "action_corrective": "Rappel port gants + formation presse"
            }
        }


# ============================================================================
# MODÈLES DE RÉPONSE API (pour FastAPI endpoints)
# ============================================================================

class HandIncidentsResponse(BaseModel):
    """Réponse API liste incidents mains."""
    success: bool = True
    total: int = Field(..., ge=0)
    periode_jours: int = Field(..., gt=0)
    incidents: List[HandIncident]
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "total": 2,
                "periode_jours": 30,
                "incidents": [
                    {
                        "id": "INC-2024-001",
                        "date": "2024-01-25T14:30:00",
                        "zone": "Zone A",
                        "zone_id": "ZONE_A",
                        "gravite": "moyen",
                        "description": "Coupure main",
                        "partie_affectee": "main droite",
                        "jours_perdus": 3,
                        "type_lesion": "coupure"
                    }
                ]
            }
        }


class ZoneRiskResponse(BaseModel):
    """Réponse API score risque zone."""
    success: bool = True
    zone: ZoneRiskScore
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "zone": {
                    "zone_id": "ZONE_A",
                    "zone_nom": "Zone A - Découpe",
                    "score": 82,
                    "niveau": "vert",
                    "incidents_total": 3,
                    "incidents_graves": 1,
                    "incidents_moyens": 1,
                    "incidents_legers": 1,
                    "near_miss_total": 6,
                    "periode_jours": 90
                }
            }
        }


class WorkerTrainingResponse(BaseModel):
    """Réponse API statuts formation."""
    success: bool = True
    total: int = Field(..., ge=0)
    workers: List[WorkerTrainingStatus]
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "total": 1,
                "workers": [
                    {
                        "worker_id": "W001",
                        "nom": "Jean Tremblay",
                        "formation_date": "2023-11-15",
                        "formation_valide": True,
                        "jours_depuis_formation": 77
                    }
                ]
            }
        }


class ErrorResponse(BaseModel):
    """Réponse API en cas d'erreur."""
    success: bool = False
    error: str = Field(..., description="Message erreur")
    details: Optional[str] = Field(None, description="Détails techniques")
    
    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "error": "Zone non trouvée",
                "details": "Zone ZONE_X inexistante dans SafetyGraph"
            }
        }
