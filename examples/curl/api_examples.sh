# NudgeSafe Hands - Exemples cURL API
# Commandes cURL pour tester l'API rapidement

# Variables d'environnement
export API_BASE_URL="http://localhost:3000/api/v1"
export API_KEY="your_api_key_here"

# =============================================================================
# AUTHENTIFICATION
# =============================================================================

# Login (obtenir token JWT)
curl -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'

# Refresh token
curl -X POST "${API_BASE_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "refresh_token": "your_refresh_token"
  }'

# =============================================================================
# RECOMMANDATIONS GANTS
# =============================================================================

# Obtenir recommandation pour un produit chimique
curl -X POST "${API_BASE_URL}/recommendations/glove" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "chemical": "Acetone",
    "exposure_time_minutes": 30,
    "task_type": "cleaning"
  }'

# Recommandation avec paramètres additionnels
curl -X POST "${API_BASE_URL}/recommendations/glove" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "chemical": "Hydrochloric Acid",
    "exposure_time_minutes": 120,
    "task_type": "immersion",
    "temperature_celsius": 25,
    "concentration_percent": 37
  }'

# =============================================================================
# PRODUITS CHIMIQUES
# =============================================================================

# Rechercher par nom
curl -X GET "${API_BASE_URL}/chemicals?name=Acetone" \
  -H "Authorization: Bearer ${API_KEY}"

# Rechercher par numéro CAS
curl -X GET "${API_BASE_URL}/chemicals?cas=67-64-1" \
  -H "Authorization: Bearer ${API_KEY}"

# Obtenir tous les produits chimiques
curl -X GET "${API_BASE_URL}/chemicals" \
  -H "Authorization: Bearer ${API_KEY}"

# Obtenir un produit spécifique par ID
curl -X GET "${API_BASE_URL}/chemicals/123" \
  -H "Authorization: Bearer ${API_KEY}"

# Créer un nouveau produit chimique
curl -X POST "${API_BASE_URL}/chemicals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "name": "Toluene",
    "cas_number": "108-88-3",
    "family": "Aromatic Hydrocarbon",
    "hazards": ["Flammable", "Toxic"],
    "pictograms": ["GHS02", "GHS08"],
    "exposure_limits": {
      "ppm_8h": 50,
      "ppm_15min": 150
    }
  }'

# Mettre à jour un produit chimique
curl -X PUT "${API_BASE_URL}/chemicals/123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "name": "Toluène (updated)",
    "hazards": ["Inflammable", "Toxique", "Nocif"]
  }'

# Supprimer un produit chimique
curl -X DELETE "${API_BASE_URL}/chemicals/123" \
  -H "Authorization: Bearer ${API_KEY}"

# =============================================================================
# MATÉRIAUX DE GANTS
# =============================================================================

# Obtenir tous les matériaux
curl -X GET "${API_BASE_URL}/gloves/materials" \
  -H "Authorization: Bearer ${API_KEY}"

# Obtenir un matériau spécifique
curl -X GET "${API_BASE_URL}/gloves/materials/nitrile" \
  -H "Authorization: Bearer ${API_KEY}"

# Comparer plusieurs matériaux pour un produit
curl -X POST "${API_BASE_URL}/gloves/compare" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "chemical": "Methanol",
    "materials": ["Nitrile", "Neoprene", "Butyl", "Viton"]
  }'

# =============================================================================
# PARSING FDS / SDS
# =============================================================================

# Parser une FDS (fichier PDF)
curl -X POST "${API_BASE_URL}/parse/sds" \
  -H "Authorization: Bearer ${API_KEY}" \
  -F "file=@/path/to/safety_data_sheet.pdf"

# Parser avec options
curl -X POST "${API_BASE_URL}/parse/sds" \
  -H "Authorization: Bearer ${API_KEY}" \
  -F "file=@/path/to/sds.pdf" \
  -F "extract_section_8=true" \
  -F "language=fr"

# =============================================================================
# COMPLIANCE & STANDARDS
# =============================================================================

# Vérifier conformité produit chimique
curl -X POST "${API_BASE_URL}/compliance/check" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "chemical_id": "123",
    "standards": ["OSHA", "EN374", "ISO45001"],
    "jurisdiction": "CA-QC"
  }'

# Obtenir exigences par standard
curl -X GET "${API_BASE_URL}/compliance/standards/OSHA" \
  -H "Authorization: Bearer ${API_KEY}"

# =============================================================================
# RAPPORTS & ANALYTICS
# =============================================================================

# Générer rapport mensuel
curl -X POST "${API_BASE_URL}/reports/monthly" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "year": 2025,
    "month": 1,
    "format": "pdf"
  }'

# Obtenir statistiques d'utilisation
curl -X GET "${API_BASE_URL}/analytics/usage?period=30d" \
  -H "Authorization: Bearer ${API_KEY}"

# Top 10 produits chimiques les plus recherchés
curl -X GET "${API_BASE_URL}/analytics/top-chemicals?limit=10" \
  -H "Authorization: Bearer ${API_KEY}"

# =============================================================================
# AGENTS IA (AgenticX5)
# =============================================================================

# Trigger HandRiskPredictor
curl -X POST "${API_BASE_URL}/agents/risk-predictor/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "zone_id": "zone-a",
    "prediction_hours": 72
  }'

# Obtenir historique nudges
curl -X GET "${API_BASE_URL}/agents/nudges/history?zone=zone-a&limit=100" \
  -H "Authorization: Bearer ${API_KEY}"

# Mesurer efficacité nudges
curl -X GET "${API_BASE_URL}/agents/nudges/effectiveness?period=7d" \
  -H "Authorization: Bearer ${API_KEY}"

# =============================================================================
# HEALTH CHECK & MONITORING
# =============================================================================

# Health check
curl -X GET "${API_BASE_URL}/health"

# Detailed status
curl -X GET "${API_BASE_URL}/status" \
  -H "Authorization: Bearer ${API_KEY}"

# API version
curl -X GET "${API_BASE_URL}/version"

# =============================================================================
# PAGINATION & FILTRES
# =============================================================================

# Avec pagination
curl -X GET "${API_BASE_URL}/chemicals?page=1&limit=20" \
  -H "Authorization: Bearer ${API_KEY}"

# Avec filtres
curl -X GET "${API_BASE_URL}/chemicals?family=Solvent&hazard=Flammable&sort=name&order=asc" \
  -H "Authorization: Bearer ${API_KEY}"

# =============================================================================
# EXPORT DONNÉES
# =============================================================================

# Export CSV
curl -X GET "${API_BASE_URL}/export/chemicals?format=csv" \
  -H "Authorization: Bearer ${API_KEY}" \
  -o chemicals.csv

# Export JSON
curl -X GET "${API_BASE_URL}/export/chemicals?format=json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -o chemicals.json

# Export Excel
curl -X GET "${API_BASE_URL}/export/gloves?format=xlsx" \
  -H "Authorization: Bearer ${API_KEY}" \
  -o gloves.xlsx

# =============================================================================
# NOTES
# =============================================================================

# Pour voir les headers de réponse:
# Ajouter -i ou -v à n'importe quelle commande

# Pour formatter la réponse JSON (avec jq):
# Ajouter | jq '.' à la fin

# Exemple:
curl -X GET "${API_BASE_URL}/chemicals?cas=67-64-1" \
  -H "Authorization: Bearer ${API_KEY}" \
  | jq '.'
