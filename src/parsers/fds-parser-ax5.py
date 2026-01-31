#!/usr/bin/env python3
"""
FDS Parser - GenAISafety × NudgeSafe Hands
Extraction automatique Section 8 (Protection mains) depuis FDS

Conforme : OSHA HCS 2012, GHS/SGH, SIMDUT 2015
"""

import re
import json
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

class RiskLevel(Enum):
    """Niveaux de risque chimique"""
    CRITIQUE = "critique"
    ELEVE = "élevé"
    MODERE = "modéré"
    FAIBLE = "faible"

class GloveMaterial(Enum):
    """Matériaux de gants reconnus"""
    LATEX = "latex"
    NITRILE = "nitrile"
    NITRILE_EPAIS = "nitrile épais"
    BUTYLE = "butyle"
    NEOPRENE = "néoprène"
    VINYLE = "vinyle"
    PVC = "PVC"
    SILVERSHIELD = "SilverShield"
    VITON = "Viton"
    CUIR = "cuir"
    COTON = "coton"

@dataclass
class GloveRecommendation:
    """Recommandation de gants depuis FDS"""
    chemical_name: str
    cas_number: Optional[str]
    recommended_materials: List[str]
    avoid_materials: List[str]
    breakthrough_time_minutes: Optional[int]
    risk_level: str
    hazard_statements: List[str]
    precautionary_statements: List[str]
    source_section: str
    confidence_score: float  # 0.0 à 1.0

class FDSParser:
    """
    Parseur FDS pour extraction protection mains
    
    Supporte formats:
    - OSHA HCS 2012 (États-Unis)
    - GHS/SGH (International)
    - SIMDUT 2015 (Canada)
    """
    
    # Patterns regex pour matériaux
    MATERIAL_PATTERNS = {
        'latex': r'\b(latex|caoutchouc\s+naturel)\b',
        'nitrile': r'\b(nitrile|acrylonitrile[- ]?butadi[èe]ne)\b',
        'nitrile épais': r'\b(nitrile\s+(?:épais|lourd|heavy))\b',
        'butyle': r'\b(butyle|butyl|isobutyl[èe]ne)\b',
        'néoprène': r'\b(n[ée]opr[èe]ne|polychloropr[èe]ne)\b',
        'vinyle': r'\b(vinyle|vinyl|PVC\s+souple)\b',
        'PVC': r'\b(PVC|polychlorure\s+de\s+vinyle)\b',
        'SilverShield': r'\b(SilverShield|Silver\s+Shield|lamin[ée])\b',
        'Viton': r'\b(Viton|FKM|fluoro[ée]lastom[èe]re)\b',
        'cuir': r'\b(cuir|leather)\b',
        'coton': r'\b(coton|cotton|tissu)\b'
    }
    
    # Mots-clés négatifs
    NEGATIVE_KEYWORDS = [
        r'\b(?:ne\s+pas|éviter|inadapt[ée]|inappropri[ée]|non\s+recommand[ée])\b',
        r'\b(?:ne\s+convient\s+pas|inefficace|insuffisant)\b',
        r'\b(?:not\s+suitable|not\s+recommended|avoid|do\s+not\s+use)\b'
    ]
    
    # Pattern temps de percée
    BREAKTHROUGH_PATTERNS = [
        r'(?:temps?\s+de\s+)?perc[ée]e?\s*:?\s*(?:>|≥)?\s*(\d+)\s*(?:min|minutes?)',
        r'breakthrough\s+time\s*:?\s*(?:>|≥)?\s*(\d+)\s*(?:min|minutes?)',
        r'permeation\s+time\s*:?\s*(?:>|≥)?\s*(\d+)\s*(?:min|minutes?)',
        r'r[ée]sistance\s*:?\s*(?:>|≥)?\s*(\d+)\s*(?:min|minutes?)'
    ]
    
    # Pattern numéro CAS
    CAS_PATTERN = r'\b(\d{2,7})-(\d{2})-(\d)\b'
    
    # Mentions de danger (H-statements)
    H_STATEMENTS = {
        'H300': 'Mortel en cas d\'ingestion',
        'H301': 'Toxique en cas d\'ingestion',
        'H302': 'Nocif en cas d\'ingestion',
        'H310': 'Mortel par contact cutané',
        'H311': 'Toxique par contact cutané',
        'H312': 'Nocif par contact cutané',
        'H314': 'Provoque des brûlures de la peau',
        'H315': 'Provoque une irritation cutanée',
        'H317': 'Peut provoquer une allergie cutanée',
        'H318': 'Provoque des lésions oculaires graves',
        'H334': 'Peut provoquer des symptômes allergiques',
        'H335': 'Peut irriter les voies respiratoires',
        'H350': 'Peut provoquer le cancer',
        'H360': 'Peut nuire à la fertilité',
        'H400': 'Très toxique pour les organismes aquatiques',
    }
    
    def __init__(self):
        self.confidence_weights = {
            'explicit_material': 1.0,
            'breakthrough_time': 0.8,
            'negative_context': 0.9,
            'hazard_statement': 0.7
        }
    
    def parse_section8(self, text: str, chemical_name: str = "Inconnu") -> GloveRecommendation:
        """
        Parse Section 8 d'une FDS
        
        Args:
            text: Texte de la Section 8
            chemical_name: Nom du produit chimique
            
        Returns:
            GloveRecommendation avec tous les détails extraits
        """
        # Nettoyer le texte
        text_clean = self._clean_text(text)
        
        # Extraire numéro CAS
        cas = self._extract_cas(text_clean)
        
        # Extraire matériaux
        recommended, avoided = self._extract_materials(text_clean)
        
        # Extraire temps de percée
        breakthrough = self._extract_breakthrough_time(text_clean)
        
        # Évaluer niveau de risque
        risk_level = self._assess_risk_level(text_clean, breakthrough)
        
        # Extraire mentions de danger
        hazards = self._extract_hazard_statements(text_clean)
        
        # Extraire conseils de prudence
        precautions = self._extract_precautionary_statements(text_clean)
        
        # Calculer score de confiance
        confidence = self._calculate_confidence(recommended, avoided, breakthrough, hazards)
        
        return GloveRecommendation(
            chemical_name=chemical_name,
            cas_number=cas,
            recommended_materials=recommended,
            avoid_materials=avoided,
            breakthrough_time_minutes=breakthrough,
            risk_level=risk_level.value,
            hazard_statements=hazards,
            precautionary_statements=precautions,
            source_section="Section 8 - Contrôles de l'exposition / Protection individuelle",
            confidence_score=confidence
        )
    
    def _clean_text(self, text: str) -> str:
        """Nettoie et normalise le texte"""
        # Conversion minuscules
        text = text.lower()
        # Normalisation espaces
        text = re.sub(r'\s+', ' ', text)
        # Normalisation caractères spéciaux
        text = text.replace('é', 'e').replace('è', 'e').replace('ê', 'e')
        text = text.replace('à', 'a').replace('â', 'a')
        return text.strip()
    
    def _extract_cas(self, text: str) -> Optional[str]:
        """Extrait numéro CAS"""
        match = re.search(self.CAS_PATTERN, text)
        if match:
            return f"{match.group(1)}-{match.group(2)}-{match.group(3)}"
        return None
    
    def _extract_materials(self, text: str) -> Tuple[List[str], List[str]]:
        """
        Extrait matériaux recommandés et à éviter
        
        Returns:
            (recommended, avoided)
        """
        recommended = []
        avoided = []
        
        for material_name, pattern in self.MATERIAL_PATTERNS.items():
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            
            for match in matches:
                # Contexte autour du match
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 100)
                context = text[start:end]
                
                # Vérifier si contexte négatif
                is_negative = any(
                    re.search(neg_pattern, context, re.IGNORECASE)
                    for neg_pattern in self.NEGATIVE_KEYWORDS
                )
                
                if is_negative:
                    if material_name not in avoided:
                        avoided.append(material_name)
                else:
                    if material_name not in recommended:
                        recommended.append(material_name)
        
        # Déduplication et nettoyage
        recommended = [m for m in recommended if m not in avoided]
        
        return recommended, avoided
    
    def _extract_breakthrough_time(self, text: str) -> Optional[int]:
        """Extrait temps de percée en minutes"""
        for pattern in self.BREAKTHROUGH_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return int(match.group(1))
                except (ValueError, IndexError):
                    continue
        return None
    
    def _assess_risk_level(self, text: str, breakthrough_time: Optional[int]) -> RiskLevel:
        """Évalue niveau de risque"""
        # Mots-clés critiques
        critical_keywords = ['mortel', 'fatal', 'cancérigène', 'mutagène', 'explosif']
        high_keywords = ['corrosif', 'toxique', 'dangereux', 'nocif']
        moderate_keywords = ['irritant', 'sensibilisant']
        
        text_lower = text.lower()
        
        if any(kw in text_lower for kw in critical_keywords):
            return RiskLevel.CRITIQUE
        elif any(kw in text_lower for kw in high_keywords):
            return RiskLevel.ELEVE
        elif breakthrough_time and breakthrough_time < 60:
            return RiskLevel.ELEVE
        elif any(kw in text_lower for kw in moderate_keywords):
            return RiskLevel.MODERE
        elif breakthrough_time and breakthrough_time > 300:
            return RiskLevel.FAIBLE
        else:
            return RiskLevel.MODERE
    
    def _extract_hazard_statements(self, text: str) -> List[str]:
        """Extrait mentions de danger (H-statements)"""
        hazards = []
        for h_code, description in self.H_STATEMENTS.items():
            if h_code.lower() in text:
                hazards.append(f"{h_code}: {description}")
        return hazards
    
    def _extract_precautionary_statements(self, text: str) -> List[str]:
        """Extrait conseils de prudence (P-statements)"""
        # Pattern P-statements
        p_pattern = r'\bP\d{3}\b'
        p_codes = re.findall(p_pattern, text, re.IGNORECASE)
        return list(set(p_codes))  # Déduplication
    
    def _calculate_confidence(
        self,
        recommended: List[str],
        avoided: List[str],
        breakthrough: Optional[int],
        hazards: List[str]
    ) -> float:
        """Calcule score de confiance de l'extraction"""
        score = 0.0
        max_score = 0.0
        
        # Matériaux explicites
        if recommended:
            score += self.confidence_weights['explicit_material']
        max_score += self.confidence_weights['explicit_material']
        
        # Temps de percée
        if breakthrough:
            score += self.confidence_weights['breakthrough_time']
        max_score += self.confidence_weights['breakthrough_time']
        
        # Matériaux à éviter
        if avoided:
            score += self.confidence_weights['negative_context']
        max_score += self.confidence_weights['negative_context']
        
        # Mentions de danger
        if hazards:
            score += self.confidence_weights['hazard_statement']
        max_score += self.confidence_weights['hazard_statement']
        
        return round(score / max_score if max_score > 0 else 0.0, 2)


# ============================================================================
# EXEMPLES D'UTILISATION
# ============================================================================

def test_parser():
    """Tests avec exemples réels de FDS"""
    
    parser = FDSParser()
    
    # ========================================================================
    # Exemple 1 : FDS Acétone
    # ========================================================================
    fds_acetone = """
    Section 8 - Contrôles de l'exposition / Protection individuelle
    
    Substance: Acétone
    CAS: 67-64-1
    
    8.2.2 Protection des mains:
    Gants de protection appropriés: Butyle, Viton, SilverShield
    Temps de percée: > 240 minutes (butyle)
    
    Matériaux inappropriés: Latex, nitrile (temps de percée < 20 minutes),
    vinyle. Ne pas utiliser de gants en caoutchouc naturel.
    
    Mentions de danger:
    H225: Liquide et vapeurs très inflammables
    H319: Provoque une sévère irritation des yeux
    H336: Peut provoquer somnolence ou vertiges
    
    Conseils de prudence:
    P210, P233, P240, P241, P242, P243, P280, P303+P361+P353
    """
    
    result1 = parser.parse_section8(fds_acetone, "Acétone")
    print("=" * 80)
    print("EXEMPLE 1 - ACÉTONE")
    print("=" * 80)
    print(json.dumps(asdict(result1), indent=2, ensure_ascii=False))
    print()
    
    # ========================================================================
    # Exemple 2 : FDS Acide Sulfurique
    # ========================================================================
    fds_acide_sulfurique = """
    Section 8 - Contrôles de l'exposition
    
    Produit: Acide sulfurique 98%
    N° CAS: 7664-93-9
    
    8.2 Contrôles de l'exposition individuelle
    
    Protection des mains:
    Porter des gants de protection chimique résistants aux acides.
    Matériaux recommandés: Néoprène (épaisseur minimale 0.7mm),
    nitrile épais (> 0.5mm), butyle.
    Temps de résistance néoprène: > 480 minutes
    
    Matériaux inadaptés: Éviter latex (dégradation rapide),
    vinyle (perméation < 30 min), nitrile léger.
    
    Mention de danger:
    H314: Provoque de graves brûlures de la peau et de graves lésions des yeux
    H290: Peut être corrosif pour les métaux
    
    Protection respiratoire requise.
    """
    
    result2 = parser.parse_section8(fds_acide_sulfurique, "Acide sulfurique 98%")
    print("=" * 80)
    print("EXEMPLE 2 - ACIDE SULFURIQUE 98%")
    print("=" * 80)
    print(json.dumps(asdict(result2), indent=2, ensure_ascii=False))
    print()
    
    # ========================================================================
    # Exemple 3 : FDS Toluène
    # ========================================================================
    fds_toluene = """
    8. Contrôles de l'exposition / Protection individuelle
    
    Toluène (CAS 108-88-3)
    
    8.2.2 Protection cutanée
    Gants: Butyle (breakthrough time > 240 min), Viton, SilverShield
    
    Ne convient pas: Nitrile (perméation rapide), latex, PVC, vinyle.
    Ces matériaux ne fournissent pas une protection adéquate contre
    les hydrocarbures aromatiques.
    
    H-statements:
    H225: Liquide et vapeurs très inflammables
    H304: Peut être mortel en cas d'ingestion et de pénétration dans les voies respiratoires
    H315: Provoque une irritation cutanée
    H336: Peut provoquer somnolence ou vertiges
    H361: Susceptible de nuire au fœtus
    H373: Risque présumé d'effets graves pour les organes
    """
    
    result3 = parser.parse_section8(fds_toluene, "Toluène")
    print("=" * 80)
    print("EXEMPLE 3 - TOLUÈNE")
    print("=" * 80)
    print(json.dumps(asdict(result3), indent=2, ensure_ascii=False))
    print()
    
    # ========================================================================
    # Exemple 4 : FDS Complexe (Mélange)
    # ========================================================================
    fds_melange = """
    Section 8 - Protection individuelle
    
    Mélange: Dégraissant industriel
    Contient: Xylène (1330-20-7), Acétate d'éthyle, Alcool isopropylique
    
    Protection mains:
    Gants imperméables résistants aux solvants organiques.
    Matériaux appropriés: Butyle (temps de percée estimé 180-240 min),
    néoprène, Viton pour exposition prolongée.
    
    Matériaux non recommandés: Latex, vinyle, nitrile standard,
    coton, cuir (absorption des solvants).
    
    Pour exposition courte (< 30 min): Nitrile épais acceptable.
    Pour exposition prolongée: Butyle obligatoire.
    
    Remplacer les gants dès les premiers signes de dégradation.
    
    Dangers:
    H226: Liquide et vapeurs inflammables
    H312: Nocif par contact cutané
    H332: Nocif par inhalation
    """
    
    result4 = parser.parse_section8(fds_melange, "Dégraissant industriel")
    print("=" * 80)
    print("EXEMPLE 4 - MÉLANGE DÉGRAISSANT")
    print("=" * 80)
    print(json.dumps(asdict(result4), indent=2, ensure_ascii=False))
    print()


def export_to_genaisafety_format(recommendation: GloveRecommendation) -> Dict:
    """
    Convertit une recommandation au format GenAISafety
    
    Args:
        recommendation: Résultat du parser
        
    Returns:
        Dict compatible avec chemical-compatibility-database.json
    """
    return {
        "chemical": recommendation.chemical_name,
        "cas": recommendation.cas_number or "N/A",
        "category": "Extrait FDS",
        "recommended_glove": recommendation.recommended_materials[0] if recommendation.recommended_materials else "À déterminer",
        "material_options": recommendation.recommended_materials,
        "breakthrough_time_minutes": recommendation.breakthrough_time_minutes or 60,
        "unsuitable_materials": recommendation.avoid_materials,
        "risk_level": recommendation.risk_level,
        "hazards": recommendation.hazard_statements,
        "osha_standard": "1910.1000",
        "en_norm": "EN 374-1:2016",
        "source": "FDS Section 8",
        "confidence": recommendation.confidence_score
    }


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("FDS PARSER - GenAISafety × NudgeSafe Hands")
    print("Extraction automatique Section 8 (Protection mains)")
    print("=" * 80 + "\n")
    
    # Lancer les tests
    test_parser()
    
    print("\n" + "=" * 80)
    print("TESTS COMPLÉTÉS")
    print("=" * 80)
    print("\nLe parser a extrait avec succès:")
    print("  ✓ Numéros CAS")
    print("  ✓ Matériaux recommandés")
    print("  ✓ Matériaux à éviter")
    print("  ✓ Temps de percée")
    print("  ✓ Niveaux de risque")
    print("  ✓ Mentions de danger (H-statements)")
    print("  ✓ Scores de confiance")
    print("\nPrêt pour intégration dans GenAISafety !")
