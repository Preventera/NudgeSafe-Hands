"""
NudgeSafe Hands - Exemple d'Utilisation API Python
Démonstration des appels API principaux
"""

import requests
import json
from typing import Dict, List, Optional

# Configuration
API_BASE_URL = "http://localhost:3000/api/v1"
API_KEY = "your_api_key_here"  # À remplacer

class NudgeSafeClient:
    """Client Python pour l'API NudgeSafe Hands"""
    
    def __init__(self, base_url: str = API_BASE_URL, api_key: str = API_KEY):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    
    def get_glove_recommendation(
        self, 
        chemical_name: str,
        exposure_time: int = 60,
        task_type: str = "manipulation"
    ) -> Dict:
        """
        Obtenir une recommandation de gant pour un produit chimique
        
        Args:
            chemical_name: Nom du produit chimique
            exposure_time: Durée d'exposition en minutes
            task_type: Type de tâche (manipulation, cleaning, immersion)
        
        Returns:
            Dict avec recommandations de gants
        """
        endpoint = f"{self.base_url}/recommendations/glove"
        payload = {
            "chemical": chemical_name,
            "exposure_time_minutes": exposure_time,
            "task_type": task_type
        }
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def parse_sds(self, sds_file_path: str) -> Dict:
        """
        Parser une Fiche de Données de Sécurité (FDS/SDS)
        
        Args:
            sds_file_path: Chemin vers le fichier PDF de la FDS
        
        Returns:
            Dict avec informations extraites
        """
        endpoint = f"{self.base_url}/parse/sds"
        
        with open(sds_file_path, 'rb') as f:
            files = {'file': (sds_file_path, f, 'application/pdf')}
            # Supprimer Content-Type header pour multipart
            headers = {k: v for k, v in self.headers.items() if k != "Content-Type"}
            response = requests.post(endpoint, files=files, headers=headers)
        
        response.raise_for_status()
        return response.json()
    
    def get_chemical_info(self, cas_number: Optional[str] = None, name: Optional[str] = None) -> Dict:
        """
        Obtenir les informations d'un produit chimique
        
        Args:
            cas_number: Numéro CAS du produit
            name: Nom du produit (si CAS non disponible)
        
        Returns:
            Dict avec informations produit
        """
        endpoint = f"{self.base_url}/chemicals"
        params = {}
        
        if cas_number:
            params['cas'] = cas_number
        elif name:
            params['name'] = name
        else:
            raise ValueError("CAS number or name required")
        
        response = requests.get(endpoint, params=params, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_glove_materials(self) -> List[Dict]:
        """
        Obtenir la liste de tous les matériaux de gants disponibles
        
        Returns:
            List de matériaux avec propriétés
        """
        endpoint = f"{self.base_url}/gloves/materials"
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        return response.json()


# =============================================================================
# EXEMPLES D'UTILISATION
# =============================================================================

def example_basic_recommendation():
    """Exemple 1: Recommandation simple de gant"""
    client = NudgeSafeClient()
    
    # Obtenir recommandation pour acétone
    result = client.get_glove_recommendation(
        chemical_name="Acetone",
        exposure_time=30,
        task_type="cleaning"
    )
    
    print("=== Recommandation pour Acétone ===")
    print(f"Produit: {result['chemical']['name']}")
    print(f"CAS: {result['chemical']['cas_number']}")
    print("\nGants recommandés:")
    for glove in result['recommendations']['recommended']:
        print(f"  ✅ {glove['material']} - Temps percée: {glove['breakthrough_time']}min")
    
    print("\nGants NON recommandés:")
    for glove in result['recommendations']['not_recommended']:
        print(f"  ❌ {glove['material']} - Raison: {glove['reason']}")


def example_sds_parsing():
    """Exemple 2: Parser une FDS automatiquement"""
    client = NudgeSafeClient()
    
    # Parser FDS
    result = client.parse_sds("path/to/safety_data_sheet.pdf")
    
    print("=== Parsing FDS ===")
    print(f"Produit: {result['product_name']}")
    print(f"CAS: {result['cas_number']}")
    print(f"Section 8 - EPI:")
    print(f"  Gants: {', '.join(result['ppe']['gloves'])}")
    print(f"  Protection respiratoire: {result['ppe']['respiratory']}")


def example_chemical_lookup():
    """Exemple 3: Recherche produit chimique par CAS"""
    client = NudgeSafeClient()
    
    # Rechercher par CAS
    result = client.get_chemical_info(cas_number="67-64-1")
    
    print("=== Info Produit Chimique ===")
    print(f"Nom: {result['name']}")
    print(f"CAS: {result['cas_number']}")
    print(f"Famille: {result['family']}")
    print(f"Dangers:")
    for hazard in result['hazards']:
        print(f"  - {hazard}")


def example_glove_materials():
    """Exemple 4: Lister tous les matériaux de gants"""
    client = NudgeSafeClient()
    
    materials = client.get_glove_materials()
    
    print("=== Matériaux de Gants Disponibles ===")
    for material in materials:
        print(f"\n{material['name']}:")
        print(f"  Résistance chimique: {material['chemical_resistance']}/5")
        print(f"  Résistance mécanique: {material['mechanical_resistance']}/5")
        print(f"  Dextérité: {material['dexterity']}/5")
        print(f"  Prix: {'$' * material['cost_level']}")


if __name__ == "__main__":
    print("NudgeSafe Hands - Exemples API Python\n")
    
    try:
        example_basic_recommendation()
        print("\n" + "="*60 + "\n")
        
        # Décommentez pour tester les autres exemples
        # example_sds_parsing()
        # example_chemical_lookup()
        # example_glove_materials()
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur API: {e}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
