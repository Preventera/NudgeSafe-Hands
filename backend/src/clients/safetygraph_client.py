"""
SafetyGraph Client - NudgeSafe Hands Integration
Sprint 1: Connexion Données SafetyGraph Core → NudgeSafe Backend

Ce client permet à NudgeSafe Hands de lire les données du Knowledge Graph 
SafetyGraph Core (Neo4j) pour alimenter les agents IA avec des données réelles.

Author: AgenticX5 Ecosystem
Version: 1.0.0 (Sprint 1)
License: MIT
"""

import os
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from neo4j import GraphDatabase, Driver, Session
from neo4j.exceptions import ServiceUnavailable, AuthError
import logging

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SafetyGraphClient:
    """
    Client pour interagir avec SafetyGraph Core (Neo4j Knowledge Graph).
    
    Fonctionnalités Sprint 1:
    - Récupération incidents mains (blessures aux mains)
    - Calcul score risque par zone
    - Statut formation travailleurs
    - Historique near-miss zone
    
    Usage:
        client = SafetyGraphClient(
            uri="bolt://localhost:7687",
            user="neo4j",
            password="your_password"
        )
        
        incidents = client.get_hand_incidents(days=30)
        risk_score = client.get_zone_risk_score("ZONE_A")
    """
    
    def __init__(
        self, 
        uri: Optional[str] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        mock_mode: bool = False
    ):
        """
        Initialise la connexion au Knowledge Graph SafetyGraph.
        
        Args:
            uri: URI Neo4j (ex: bolt://localhost:7687)
            user: Utilisateur Neo4j
            password: Mot de passe Neo4j
            mock_mode: Si True, retourne données mockées (pour dev/tests)
        """
        self.mock_mode = mock_mode
        
        if mock_mode:
            logger.info("SafetyGraphClient initialisé en MODE MOCK (dev/tests)")
            self.driver = None
            return
        
        # Récupération variables environnement si non fournies
        self.uri = uri or os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = user or os.getenv("NEO4J_USER", "neo4j")
        self.password = password or os.getenv("NEO4J_PASSWORD", "password")
        
        try:
            self.driver = GraphDatabase.driver(
                self.uri, 
                auth=(self.user, self.password)
            )
            # Test connexion
            with self.driver.session() as session:
                result = session.run("RETURN 1 AS test")
                result.single()
            logger.info(f"✅ Connexion SafetyGraph établie: {self.uri}")
        except AuthError:
            logger.error("❌ Échec authentification Neo4j - Vérifier credentials")
            raise
        except ServiceUnavailable:
            logger.error("❌ Neo4j inaccessible - Vérifier que le service est démarré")
            raise
        except Exception as e:
            logger.error(f"❌ Erreur connexion SafetyGraph: {str(e)}")
            raise
    
    def close(self):
        """Ferme la connexion Neo4j proprement."""
        if self.driver:
            self.driver.close()
            logger.info("Connexion SafetyGraph fermée")
    
    def __enter__(self):
        """Support context manager."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Fermeture automatique avec context manager."""
        self.close()
    
    # ========================================================================
    # QUERIES PRINCIPALES - SPRINT 1
    # ========================================================================
    
    def get_hand_incidents(
        self, 
        days: int = 30,
        severity_min: Optional[str] = None,
        zone_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Récupère les incidents liés aux blessures aux mains.
        
        Cypher Query:
        MATCH (i:Incident)-[:SURVENU_DANS]->(z:ZoneTravail)
        WHERE i.partie_corps_affectee CONTAINS 'main' 
          OR i.partie_corps_affectee CONTAINS 'doigt'
          OR i.partie_corps_affectee CONTAINS 'poignet'
        
        Args:
            days: Nombre de jours historique (défaut: 30)
            severity_min: Gravité minimale ('leger', 'moyen', 'grave')
            zone_id: Filtrer par zone spécifique
        
        Returns:
            Liste de dict avec: id, date, zone, gravite, description, 
                               partie_affectee, jours_perdus
        """
        if self.mock_mode:
            return self._mock_hand_incidents(days)
        
        date_limit = (datetime.now() - timedelta(days=days)).isoformat()
        
        query = """
        MATCH (i:Incident)-[:SURVENU_DANS]->(z:ZoneTravail)
        WHERE i.date_incident >= $date_limit
          AND (
            toLower(i.partie_corps_affectee) CONTAINS 'main' 
            OR toLower(i.partie_corps_affectee) CONTAINS 'doigt'
            OR toLower(i.partie_corps_affectee) CONTAINS 'poignet'
          )
        """
        
        params = {"date_limit": date_limit}
        
        if severity_min:
            query += " AND i.gravite >= $severity_min"
            params["severity_min"] = severity_min
        
        if zone_id:
            query += " AND z.zone_id = $zone_id"
            params["zone_id"] = zone_id
        
        query += """
        RETURN 
          i.incident_id AS id,
          i.date_incident AS date,
          z.nom AS zone,
          z.zone_id AS zone_id,
          i.gravite AS gravite,
          i.description AS description,
          i.partie_corps_affectee AS partie_affectee,
          i.jours_perdus AS jours_perdus,
          i.type_lesion AS type_lesion
        ORDER BY i.date_incident DESC
        """
        
        with self.driver.session() as session:
            result = session.run(query, params)
            incidents = [dict(record) for record in result]
        
        logger.info(f"📊 {len(incidents)} incidents mains récupérés ({days} jours)")
        return incidents
    
    def get_zone_risk_score(
        self, 
        zone_id: str,
        days: int = 90
    ) -> Dict[str, Any]:
        """
        Calcule le score de risque d'une zone basé sur historique incidents.
        
        Score = (incidents_graves * 10 + incidents_moyens * 5 + near_miss * 2) / jours
        Normalisé sur échelle 0-100.
        
        Cypher Query:
        MATCH (z:ZoneTravail {zone_id: $zone_id})
        OPTIONAL MATCH (z)<-[:SURVENU_DANS]-(i:Incident)
        OPTIONAL MATCH (z)<-[:DETECTE_DANS]-(nm:NearMiss)
        
        Args:
            zone_id: Identifiant unique de la zone
            days: Période d'analyse (défaut: 90 jours)
        
        Returns:
            Dict avec: zone_id, zone_nom, score (0-100), niveau (vert/jaune/orange/rouge),
                      incidents_total, near_miss_total, tendance
        """
        if self.mock_mode:
            return self._mock_zone_risk_score(zone_id)
        
        date_limit = (datetime.now() - timedelta(days=days)).isoformat()
        
        query = """
        MATCH (z:ZoneTravail {zone_id: $zone_id})
        
        OPTIONAL MATCH (z)<-[:SURVENU_DANS]-(i:Incident)
        WHERE i.date_incident >= $date_limit
          AND (
            toLower(i.partie_corps_affectee) CONTAINS 'main' 
            OR toLower(i.partie_corps_affectee) CONTAINS 'doigt'
          )
        
        OPTIONAL MATCH (z)<-[:DETECTE_DANS]-(nm:NearMiss)
        WHERE nm.date_detection >= $date_limit
        
        WITH z,
             COUNT(DISTINCT CASE WHEN i.gravite = 'grave' THEN i END) AS graves,
             COUNT(DISTINCT CASE WHEN i.gravite = 'moyen' THEN i END) AS moyens,
             COUNT(DISTINCT CASE WHEN i.gravite = 'leger' THEN i END) AS legers,
             COUNT(DISTINCT nm) AS near_miss
        
        RETURN 
          z.zone_id AS zone_id,
          z.nom AS zone_nom,
          graves,
          moyens,
          legers,
          near_miss,
          z.niveau_risque_base AS niveau_risque_base
        """
        
        params = {
            "zone_id": zone_id,
            "date_limit": date_limit
        }
        
        with self.driver.session() as session:
            result = session.run(query, params)
            record = result.single()
        
        if not record:
            logger.warning(f"⚠️  Zone {zone_id} non trouvée dans SafetyGraph")
            return {
                "zone_id": zone_id,
                "zone_nom": "INCONNU",
                "score": 0,
                "niveau": "vert",
                "error": "Zone non trouvée"
            }
        
        # Calcul score pondéré
        graves = record["graves"] or 0
        moyens = record["moyens"] or 0
        legers = record["legers"] or 0
        near_miss = record["near_miss"] or 0
        
        raw_score = (graves * 10) + (moyens * 5) + (legers * 2) + (near_miss * 1)
        # Normalisation sur 100 (ajuster facteur selon densité incidents)
        score = min(100, int(raw_score * (100 / days) * 5))
        
        # Détermination niveau
        if score >= 76:
            niveau = "rouge"
        elif score >= 51:
            niveau = "orange"
        elif score >= 26:
            niveau = "jaune"
        else:
            niveau = "vert"
        
        result_dict = {
            "zone_id": record["zone_id"],
            "zone_nom": record["zone_nom"],
            "score": score,
            "niveau": niveau,
            "incidents_total": graves + moyens + legers,
            "incidents_graves": graves,
            "incidents_moyens": moyens,
            "incidents_legers": legers,
            "near_miss_total": near_miss,
            "periode_jours": days
        }
        
        logger.info(f"📍 Zone {zone_id}: Score {score}/100 ({niveau})")
        return result_dict
    
    def get_worker_training_status(
        self, 
        worker_id: Optional[str] = None,
        zone_id: Optional[str] = None,
        training_type: str = "protection_mains"
    ) -> List[Dict[str, Any]]:
        """
        Récupère le statut de formation des travailleurs.
        
        Cypher Query:
        MATCH (t:Travailleur)-[r:A_SUIVI]->(f:Formation)
        WHERE f.type_formation = 'protection_mains'
        
        Args:
            worker_id: ID travailleur spécifique (optionnel)
            zone_id: Filtrer par zone de travail
            training_type: Type de formation (défaut: protection_mains)
        
        Returns:
            Liste de dict avec: worker_id, nom, formation_date, 
                               formation_valide, jours_depuis_formation
        """
        if self.mock_mode:
            return self._mock_worker_training(worker_id, zone_id)
        
        query = """
        MATCH (t:Travailleur)-[r:A_SUIVI]->(f:Formation)
        WHERE f.type_formation = $training_type
        """
        
        params = {"training_type": training_type}
        
        if worker_id:
            query += " AND t.travailleur_id = $worker_id"
            params["worker_id"] = worker_id
        
        if zone_id:
            query += """
            MATCH (t)-[:TRAVAILLE_DANS]->(z:ZoneTravail {zone_id: $zone_id})
            """
            params["zone_id"] = zone_id
        
        query += """
        WITH t, f, r,
             duration.between(date(r.date_completion), date()).days AS jours_depuis
        RETURN 
          t.travailleur_id AS worker_id,
          t.nom AS nom,
          r.date_completion AS formation_date,
          CASE 
            WHEN jours_depuis <= 365 THEN true 
            ELSE false 
          END AS formation_valide,
          jours_depuis AS jours_depuis_formation
        ORDER BY jours_depuis ASC
        """
        
        with self.driver.session() as session:
            result = session.run(query, params)
            trainings = [dict(record) for record in result]
        
        logger.info(f"👷 {len(trainings)} formations récupérées")
        return trainings
    
    def get_near_miss_history(
        self,
        zone_id: str,
        days: int = 30
    ) -> List[Dict[str, Any]]:
        """
        Récupère l'historique des near-miss (quasi-accidents) pour une zone.
        
        Args:
            zone_id: Identifiant de la zone
            days: Période historique
        
        Returns:
            Liste near-miss avec détails
        """
        if self.mock_mode:
            return self._mock_near_miss(zone_id, days)
        
        date_limit = (datetime.now() - timedelta(days=days)).isoformat()
        
        query = """
        MATCH (nm:NearMiss)-[:DETECTE_DANS]->(z:ZoneTravail {zone_id: $zone_id})
        WHERE nm.date_detection >= $date_limit
        RETURN 
          nm.nearmiss_id AS id,
          nm.date_detection AS date,
          nm.description AS description,
          nm.risque_potentiel AS risque_potentiel,
          nm.action_corrective AS action_corrective
        ORDER BY nm.date_detection DESC
        """
        
        params = {
            "zone_id": zone_id,
            "date_limit": date_limit
        }
        
        with self.driver.session() as session:
            result = session.run(query, params)
            near_miss = [dict(record) for record in result]
        
        logger.info(f"⚠️  {len(near_miss)} near-miss récupérés (zone {zone_id})")
        return near_miss
    
    # ========================================================================
    # MÉTHODES MOCK - DÉVELOPPEMENT/TESTS
    # ========================================================================
    
    def _mock_hand_incidents(self, days: int) -> List[Dict[str, Any]]:
        """Données mockées pour développement sans Neo4j."""
        return [
            {
                "id": "INC-2024-001",
                "date": "2024-01-25T14:30:00",
                "zone": "Zone A - Découpe",
                "zone_id": "ZONE_A",
                "gravite": "moyen",
                "description": "Coupure main droite lors manipulation tôle",
                "partie_affectee": "main droite - index",
                "jours_perdus": 3,
                "type_lesion": "coupure"
            },
            {
                "id": "INC-2024-002",
                "date": "2024-01-28T09:15:00",
                "zone": "Zone C - Soudure",
                "zone_id": "ZONE_C",
                "gravite": "leger",
                "description": "Brûlure superficielle poignet",
                "partie_affectee": "poignet gauche",
                "jours_perdus": 0,
                "type_lesion": "brulure"
            }
        ]
    
    def _mock_zone_risk_score(self, zone_id: str) -> Dict[str, Any]:
        """Score de risque mocké."""
        mock_scores = {
            "ZONE_A": {"score": 82, "niveau": "rouge", "incidents": 3},
            "ZONE_B": {"score": 71, "niveau": "orange", "incidents": 7},
            "ZONE_C": {"score": 45, "niveau": "jaune", "incidents": 12}
        }
        
        data = mock_scores.get(zone_id, {"score": 50, "niveau": "jaune", "incidents": 5})
        
        return {
            "zone_id": zone_id,
            "zone_nom": f"Zone {zone_id.split('_')[1]} - Mock",
            "score": data["score"],
            "niveau": data["niveau"],
            "incidents_total": data["incidents"],
            "incidents_graves": 1,
            "incidents_moyens": 2,
            "incidents_legers": data["incidents"] - 3,
            "near_miss_total": data["incidents"] * 2,
            "periode_jours": 90
        }
    
    def _mock_worker_training(
        self, 
        worker_id: Optional[str],
        zone_id: Optional[str]
    ) -> List[Dict[str, Any]]:
        """Formations mockées."""
        return [
            {
                "worker_id": "W001",
                "nom": "Jean Tremblay",
                "formation_date": "2023-11-15",
                "formation_valide": True,
                "jours_depuis_formation": 77
            },
            {
                "worker_id": "W002",
                "nom": "Marie Dubois",
                "formation_date": "2022-08-20",
                "formation_valide": False,
                "jours_depuis_formation": 523
            }
        ]
    
    def _mock_near_miss(self, zone_id: str, days: int) -> List[Dict[str, Any]]:
        """Near-miss mockés."""
        return [
            {
                "id": "NM-2024-001",
                "date": "2024-01-30T11:20:00",
                "description": "Travailleur a failli coincer main dans presse",
                "risque_potentiel": "Écrasement main - grave",
                "action_corrective": "Rappel port gants + formation presse"
            }
        ]


# ============================================================================
# USAGE EXEMPLE
# ============================================================================

if __name__ == "__main__":
    # Exemple 1: Mode Mock (développement sans Neo4j)
    print("=== Mode Mock ===")
    client_mock = SafetyGraphClient(mock_mode=True)
    
    incidents = client_mock.get_hand_incidents(days=30)
    print(f"\n📊 {len(incidents)} incidents récupérés:")
    for inc in incidents:
        print(f"  - {inc['date']}: {inc['description']} ({inc['gravite']})")
    
    score = client_mock.get_zone_risk_score("ZONE_A")
    print(f"\n📍 Zone A - Score: {score['score']}/100 ({score['niveau']})")
    
    # Exemple 2: Mode Production (avec Neo4j réel)
    # Décommenter si Neo4j disponible
    """
    print("\n=== Mode Production ===")
    with SafetyGraphClient(
        uri="bolt://localhost:7687",
        user="neo4j",
        password="your_password"
    ) as client:
        incidents_real = client.get_hand_incidents(days=30)
        print(f"✅ {len(incidents_real)} incidents réels récupérés")
        
        score_real = client.get_zone_risk_score("ZONE_A", days=90)
        print(f"✅ Score risque réel: {score_real['score']}/100")
    """
