"""
Tests Unitaires - SafetyGraphClient
Sprint 1: Tests complets avec mock Neo4j

Vérifie le bon fonctionnement du client SafetyGraph en mode mock 
et prépare les tests d'intégration avec Neo4j réel.

Author: AgenticX5 Ecosystem
Version: 1.0.0 (Sprint 1)
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timedelta
import sys
import os

# Ajout path pour imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from clients.safetygraph_client import SafetyGraphClient
from models.safetygraph_models import (
    HandIncident,
    ZoneRiskScore,
    WorkerTrainingStatus,
    NearMissEvent
)


class TestSafetyGraphClientMock(unittest.TestCase):
    """Tests du client en mode mock (sans Neo4j)."""
    
    def setUp(self):
        """Initialisation avant chaque test."""
        self.client = SafetyGraphClient(mock_mode=True)
    
    def tearDown(self):
        """Nettoyage après chaque test."""
        self.client.close()
    
    def test_client_initialization_mock(self):
        """Test initialisation client en mode mock."""
        self.assertIsNone(self.client.driver)
        self.assertTrue(self.client.mock_mode)
    
    def test_get_hand_incidents_mock(self):
        """Test récupération incidents mains (mock)."""
        incidents = self.client.get_hand_incidents(days=30)
        
        # Vérifications structure
        self.assertIsInstance(incidents, list)
        self.assertGreater(len(incidents), 0)
        
        # Vérification premier incident
        incident = incidents[0]
        self.assertIn("id", incident)
        self.assertIn("date", incident)
        self.assertIn("zone", incident)
        self.assertIn("gravite", incident)
        self.assertIn("description", incident)
        
        # Validation avec Pydantic
        incident_obj = HandIncident(**incident)
        self.assertEqual(incident_obj.id, incident["id"])
    
    def test_get_zone_risk_score_mock(self):
        """Test calcul score risque zone (mock)."""
        zone_id = "ZONE_A"
        score = self.client.get_zone_risk_score(zone_id)
        
        # Vérifications structure
        self.assertIsInstance(score, dict)
        self.assertEqual(score["zone_id"], zone_id)
        self.assertIn("score", score)
        self.assertIn("niveau", score)
        
        # Vérification score dans range
        self.assertGreaterEqual(score["score"], 0)
        self.assertLessEqual(score["score"], 100)
        
        # Vérification cohérence niveau
        score_val = score["score"]
        niveau = score["niveau"]
        if score_val >= 76:
            self.assertEqual(niveau, "rouge")
        elif score_val >= 51:
            self.assertEqual(niveau, "orange")
        elif score_val >= 26:
            self.assertEqual(niveau, "jaune")
        else:
            self.assertEqual(niveau, "vert")
        
        # Validation Pydantic
        score_obj = ZoneRiskScore(**score)
        self.assertEqual(score_obj.score, score["score"])
    
    def test_get_worker_training_mock(self):
        """Test récupération formations travailleurs (mock)."""
        trainings = self.client.get_worker_training_status()
        
        # Vérifications
        self.assertIsInstance(trainings, list)
        self.assertGreater(len(trainings), 0)
        
        # Vérification premier enregistrement
        training = trainings[0]
        self.assertIn("worker_id", training)
        self.assertIn("nom", training)
        self.assertIn("formation_date", training)
        self.assertIn("formation_valide", training)
        
        # Validation Pydantic
        training_obj = WorkerTrainingStatus(**training)
        self.assertEqual(training_obj.worker_id, training["worker_id"])
    
    def test_get_near_miss_mock(self):
        """Test récupération near-miss (mock)."""
        zone_id = "ZONE_A"
        near_miss = self.client.get_near_miss_history(zone_id, days=30)
        
        # Vérifications
        self.assertIsInstance(near_miss, list)
        
        if len(near_miss) > 0:
            nm = near_miss[0]
            self.assertIn("id", nm)
            self.assertIn("date", nm)
            self.assertIn("description", nm)
            
            # Validation Pydantic
            nm_obj = NearMissEvent(**nm)
            self.assertEqual(nm_obj.id, nm["id"])
    
    def test_context_manager(self):
        """Test utilisation avec context manager."""
        with SafetyGraphClient(mock_mode=True) as client:
            incidents = client.get_hand_incidents(days=30)
            self.assertIsInstance(incidents, list)
        
        # Client doit être fermé automatiquement
        # (pas de driver en mode mock, mais test la structure)


class TestSafetyGraphClientNeo4j(unittest.TestCase):
    """Tests avec Neo4j mocké (simulation connexion)."""
    
    @patch('clients.safetygraph_client.GraphDatabase')
    def test_client_initialization_neo4j(self, mock_graphdb):
        """Test initialisation avec Neo4j (mocké)."""
        # Mock du driver Neo4j
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_result = MagicMock()
        mock_result.single.return_value = {"test": 1}
        
        mock_session.run.return_value = mock_result
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_graphdb.driver.return_value = mock_driver
        
        # Création client
        client = SafetyGraphClient(
            uri="bolt://localhost:7687",
            user="neo4j",
            password="test_password"
        )
        
        # Vérifications
        self.assertIsNotNone(client.driver)
        self.assertFalse(client.mock_mode)
        mock_graphdb.driver.assert_called_once()
        
        client.close()
    
    @patch('clients.safetygraph_client.GraphDatabase')
    def test_get_hand_incidents_neo4j(self, mock_graphdb):
        """Test query incidents avec Neo4j mocké."""
        # Setup mock
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_result = MagicMock()
        
        # Données simulées retournées par Neo4j
        mock_records = [
            {
                "id": "INC-TEST-001",
                "date": "2024-01-25T14:30:00",
                "zone": "Zone Test",
                "zone_id": "ZONE_TEST",
                "gravite": "moyen",
                "description": "Test incident",
                "partie_affectee": "main droite",
                "jours_perdus": 2,
                "type_lesion": "coupure"
            }
        ]
        
        mock_result.__iter__.return_value = iter(mock_records)
        mock_session.run.return_value = mock_result
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_graphdb.driver.return_value = mock_driver
        
        # Test
        client = SafetyGraphClient(
            uri="bolt://localhost:7687",
            user="neo4j",
            password="test"
        )
        
        incidents = client.get_hand_incidents(days=30)
        
        # Vérifications
        self.assertEqual(len(incidents), 1)
        self.assertEqual(incidents[0]["id"], "INC-TEST-001")
        
        # Vérifier que la query Cypher a été exécutée
        mock_session.run.assert_called()
        
        client.close()


class TestSafetyGraphClientErrors(unittest.TestCase):
    """Tests gestion d'erreurs."""
    
    @patch('clients.safetygraph_client.GraphDatabase')
    def test_auth_error(self, mock_graphdb):
        """Test erreur authentification Neo4j."""
        from neo4j.exceptions import AuthError
        
        # Simuler erreur authentification
        mock_graphdb.driver.side_effect = AuthError("Invalid credentials")
        
        with self.assertRaises(AuthError):
            SafetyGraphClient(
                uri="bolt://localhost:7687",
                user="wrong_user",
                password="wrong_password"
            )
    
    @patch('clients.safetygraph_client.GraphDatabase')
    def test_service_unavailable(self, mock_graphdb):
        """Test Neo4j inaccessible."""
        from neo4j.exceptions import ServiceUnavailable
        
        # Simuler service indisponible
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_session.run.side_effect = ServiceUnavailable("Connection failed")
        mock_driver.session.return_value.__enter__.return_value = mock_session
        mock_graphdb.driver.return_value = mock_driver
        
        with self.assertRaises(ServiceUnavailable):
            SafetyGraphClient(
                uri="bolt://localhost:7687",
                user="neo4j",
                password="password"
            )
    
    def test_zone_not_found_mock(self):
        """Test zone inexistante (mock)."""
        client = SafetyGraphClient(mock_mode=True)
        
        # Zone qui n'existe pas dans les mocks
        score = client.get_zone_risk_score("ZONE_INEXISTANTE")
        
        # Mock retourne quand même des données, mais avec score par défaut
        self.assertIsInstance(score, dict)
        self.assertIn("zone_id", score)


class TestPydanticValidation(unittest.TestCase):
    """Tests validation Pydantic des modèles."""
    
    def test_hand_incident_validation(self):
        """Test validation modèle HandIncident."""
        # Données valides
        valid_data = {
            "id": "INC-001",
            "date": "2024-01-25T14:30:00",
            "zone": "Zone A",
            "zone_id": "ZONE_A",
            "gravite": "moyen",
            "description": "Test",
            "partie_affectee": "main",
            "jours_perdus": 3,
            "type_lesion": "coupure"
        }
        
        incident = HandIncident(**valid_data)
        self.assertEqual(incident.id, "INC-001")
        self.assertEqual(incident.jours_perdus, 3)
    
    def test_hand_incident_invalid_gravite(self):
        """Test validation gravité invalide."""
        invalid_data = {
            "id": "INC-001",
            "date": "2024-01-25T14:30:00",
            "zone": "Zone A",
            "zone_id": "ZONE_A",
            "gravite": "invalid",  # Invalide
            "description": "Test",
            "partie_affectee": "main",
            "jours_perdus": 3,
            "type_lesion": "coupure"
        }
        
        with self.assertRaises(Exception):  # Pydantic ValidationError
            HandIncident(**invalid_data)
    
    def test_zone_risk_score_validation(self):
        """Test validation ZoneRiskScore."""
        valid_data = {
            "zone_id": "ZONE_A",
            "zone_nom": "Zone A",
            "score": 82,
            "niveau": "rouge",
            "incidents_total": 3,
            "incidents_graves": 1,
            "incidents_moyens": 1,
            "incidents_legers": 1,
            "near_miss_total": 6,
            "periode_jours": 90
        }
        
        score = ZoneRiskScore(**valid_data)
        self.assertEqual(score.score, 82)
        self.assertEqual(score.niveau, "rouge")
    
    def test_zone_risk_score_invalid_coherence(self):
        """Test incohérence score-niveau."""
        # Score 85 devrait être "rouge", pas "vert"
        invalid_data = {
            "zone_id": "ZONE_A",
            "zone_nom": "Zone A",
            "score": 85,
            "niveau": "vert",  # Incohérent
            "incidents_total": 10,
            "incidents_graves": 5,
            "incidents_moyens": 3,
            "incidents_legers": 2,
            "near_miss_total": 20,
            "periode_jours": 90
        }
        
        with self.assertRaises(Exception):  # ValidationError
            ZoneRiskScore(**invalid_data)


# ============================================================================
# SUITE DE TESTS COMPLÈTE
# ============================================================================

def suite():
    """Créer la suite de tests complète."""
    test_suite = unittest.TestSuite()
    
    # Tests mode mock
    test_suite.addTest(unittest.makeSuite(TestSafetyGraphClientMock))
    
    # Tests Neo4j mocké
    test_suite.addTest(unittest.makeSuite(TestSafetyGraphClientNeo4j))
    
    # Tests erreurs
    test_suite.addTest(unittest.makeSuite(TestSafetyGraphClientErrors))
    
    # Tests validation Pydantic
    test_suite.addTest(unittest.makeSuite(TestPydanticValidation))
    
    return test_suite


if __name__ == '__main__':
    # Exécution tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite())
    
    # Résumé
    print("\n" + "="*70)
    print("RÉSUMÉ TESTS - SafetyGraph Client Sprint 1")
    print("="*70)
    print(f"Tests exécutés : {result.testsRun}")
    print(f"✅ Succès      : {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"❌ Échecs      : {len(result.failures)}")
    print(f"⚠️  Erreurs     : {len(result.errors)}")
    print("="*70)
    
    # Code sortie
    exit(0 if result.wasSuccessful() else 1)
