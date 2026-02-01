#!/usr/bin/env python3
"""
Quick Demo - SafetyGraph Integration Sprint 1
Démonstration rapide des fonctionnalités du SafetyGraphClient

Usage:
    python demo.py
"""

import sys
import os

# Ajout path pour imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from clients.safetygraph_client import SafetyGraphClient
from models.safetygraph_models import HandIncident, ZoneRiskScore


def print_header(title):
    """Affiche un header formaté."""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70 + "\n")


def demo_mode_mock():
    """Démonstration en mode mock (sans Neo4j)."""
    print_header("🔹 DÉMONSTRATION MODE MOCK (Sans Neo4j)")
    
    # Initialisation client
    print("📌 Initialisation SafetyGraphClient en mode mock...")
    client = SafetyGraphClient(mock_mode=True)
    print("✅ Client initialisé\n")
    
    # Test 1: Récupération incidents
    print("📊 Test 1: Récupération incidents mains (30 derniers jours)")
    print("-" * 70)
    
    incidents = client.get_hand_incidents(days=30)
    print(f"✅ {len(incidents)} incidents récupérés\n")
    
    for i, inc in enumerate(incidents, 1):
        # Validation avec Pydantic
        incident_obj = HandIncident(**inc)
        
        print(f"  Incident #{i}:")
        print(f"    ID          : {incident_obj.id}")
        print(f"    Date        : {incident_obj.date}")
        print(f"    Zone        : {incident_obj.zone}")
        print(f"    Gravité     : {incident_obj.gravite}")
        print(f"    Description : {incident_obj.description}")
        print(f"    Jours perdus: {incident_obj.jours_perdus}")
        print()
    
    # Test 2: Score risque zone
    print("\n📍 Test 2: Calcul score risque zones")
    print("-" * 70)
    
    zones = ["ZONE_A", "ZONE_B", "ZONE_C"]
    
    for zone_id in zones:
        score_raw = client.get_zone_risk_score(zone_id)
        score = ZoneRiskScore(**score_raw)  # Validation Pydantic
        
        # Emoji selon niveau
        emoji = {
            "vert": "🟢",
            "jaune": "🟡",
            "orange": "🟠",
            "rouge": "🔴"
        }.get(score.niveau, "⚪")
        
        print(f"  {emoji} {score.zone_nom}")
        print(f"    Score        : {score.score}/100")
        print(f"    Niveau       : {score.niveau.upper()}")
        print(f"    Incidents    : {score.incidents_total} (dont {score.incidents_graves} graves)")
        print(f"    Near-miss    : {score.near_miss_total}")
        print()
    
    # Test 3: Formations travailleurs
    print("\n👷 Test 3: Statut formations travailleurs")
    print("-" * 70)
    
    trainings = client.get_worker_training_status()
    print(f"✅ {len(trainings)} formations récupérées\n")
    
    for training in trainings:
        status_emoji = "✅" if training['formation_valide'] else "❌"
        print(f"  {status_emoji} {training['nom']} (ID: {training['worker_id']})")
        print(f"    Formation   : {training['formation_date']}")
        print(f"    Depuis      : {training['jours_depuis_formation']} jours")
        print(f"    Valide      : {'Oui' if training['formation_valide'] else 'Non (>365 jours)'}")
        print()
    
    # Test 4: Near-miss
    print("\n⚠️  Test 4: Historique near-miss Zone A")
    print("-" * 70)
    
    near_miss = client.get_near_miss_history("ZONE_A", days=30)
    
    if near_miss:
        print(f"✅ {len(near_miss)} near-miss détectés\n")
        for nm in near_miss:
            print(f"  Near-Miss: {nm['id']}")
            print(f"    Date           : {nm['date']}")
            print(f"    Description    : {nm['description']}")
            print(f"    Risque évité   : {nm['risque_potentiel']}")
            print(f"    Action         : {nm['action_corrective']}")
            print()
    else:
        print("ℹ️  Aucun near-miss dans la période\n")
    
    # Fermeture
    client.close()
    print("✅ Connexion fermée")


def demo_context_manager():
    """Démonstration avec context manager."""
    print_header("🔹 DÉMONSTRATION CONTEXT MANAGER")
    
    print("📌 Utilisation avec 'with' statement (fermeture automatique)...")
    print()
    
    with SafetyGraphClient(mock_mode=True) as client:
        # Query simple
        incidents = client.get_hand_incidents(days=7)
        print(f"✅ {len(incidents)} incidents derniers 7 jours")
        
        score = client.get_zone_risk_score("ZONE_A")
        print(f"✅ Score Zone A: {score['score']}/100")
    
    print("\n✅ Connexion fermée automatiquement (context manager)")


def demo_error_handling():
    """Démonstration gestion d'erreurs."""
    print_header("🔹 DÉMONSTRATION GESTION D'ERREURS")
    
    client = SafetyGraphClient(mock_mode=True)
    
    # Zone inexistante
    print("📌 Test récupération zone inexistante...")
    score = client.get_zone_risk_score("ZONE_INEXISTANTE")
    
    if "error" in score:
        print(f"⚠️  Erreur détectée: {score.get('error')}")
        print(f"    Score par défaut retourné: {score['score']}/100")
    else:
        print(f"✅ Zone trouvée: {score['zone_nom']}")
    
    client.close()


def main():
    """Fonction principale."""
    print("\n" + "="*70)
    print("  SafetyGraph Integration - Sprint 1 Demo")
    print("  NudgeSafe Hands × SafetyGraph Core")
    print("="*70)
    
    try:
        # Démos
        demo_mode_mock()
        demo_context_manager()
        demo_error_handling()
        
        # Résumé
        print_header("✅ DÉMONSTRATION TERMINÉE")
        print("📚 Pour plus d'informations:")
        print("   - README.md : Documentation complète")
        print("   - tests/test_safetygraph_client.py : Tests unitaires")
        print("   - src/clients/safetygraph_client.py : Code source")
        print("\n💡 Prochaine étape:")
        print("   - Connecter à Neo4j réel: MOCK_MODE=false dans .env")
        print("   - Lancer tests: pytest -v")
        print("   - Créer API REST: Sprint 1+ (FastAPI)")
        print()
        
        return 0
        
    except Exception as e:
        print(f"\n❌ ERREUR: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(main())
