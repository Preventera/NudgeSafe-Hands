/**
 * NudgeSafe Hands - Exemple d'Utilisation API JavaScript
 * Démonstration des appels API principaux
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = 'your_api_key_here'; // À remplacer

/**
 * Client JavaScript pour l'API NudgeSafe Hands
 */
class NudgeSafeClient {
  constructor(baseUrl = API_BASE_URL, apiKey = API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Headers par défaut pour les requêtes
   */
  get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Obtenir une recommandation de gant pour un produit chimique
   */
  async getGloveRecommendation(chemicalName, exposureTime = 60, taskType = 'manipulation') {
    const response = await fetch(`${this.baseUrl}/recommendations/glove`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        chemical: chemicalName,
        exposure_time_minutes: exposureTime,
        task_type: taskType,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Parser une Fiche de Données de Sécurité (FDS/SDS)
   */
  async parseSDS(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/parse/sds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        // Ne pas définir Content-Type pour FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtenir les informations d'un produit chimique
   */
  async getChemicalInfo(casNumber = null, name = null) {
    if (!casNumber && !name) {
      throw new Error('CAS number or name required');
    }

    const params = new URLSearchParams();
    if (casNumber) params.append('cas', casNumber);
    if (name) params.append('name', name);

    const response = await fetch(`${this.baseUrl}/chemicals?${params}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtenir la liste de tous les matériaux de gants disponibles
   */
  async getGloveMaterials() {
    const response = await fetch(`${this.baseUrl}/gloves/materials`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Créer un nouveau produit chimique dans la base
   */
  async createChemical(chemicalData) {
    const response = await fetch(`${this.baseUrl}/chemicals`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(chemicalData),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// =============================================================================
// EXEMPLES D'UTILISATION
// =============================================================================

/**
 * Exemple 1: Recommandation simple de gant
 */
async function exampleBasicRecommendation() {
  const client = new NudgeSafeClient();

  try {
    const result = await client.getGloveRecommendation('Acetone', 30, 'cleaning');

    console.log('=== Recommandation pour Acétone ===');
    console.log(`Produit: ${result.chemical.name}`);
    console.log(`CAS: ${result.chemical.cas_number}`);
    console.log('\nGants recommandés:');
    result.recommendations.recommended.forEach((glove) => {
      console.log(`  ✅ ${glove.material} - Temps percée: ${glove.breakthrough_time}min`);
    });

    console.log('\nGants NON recommandés:');
    result.recommendations.not_recommended.forEach((glove) => {
      console.log(`  ❌ ${glove.material} - Raison: ${glove.reason}`);
    });
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple 2: Parser une FDS depuis un input file
 */
async function exampleSDSParsing() {
  const client = new NudgeSafeClient();

  // Simuler sélection fichier (dans un vrai contexte, utiliser <input type="file">)
  const fileInput = document.getElementById('sds-file-input');
  const file = fileInput.files[0];

  if (!file) {
    console.error('Aucun fichier sélectionné');
    return;
  }

  try {
    const result = await client.parseSDS(file);

    console.log('=== Parsing FDS ===');
    console.log(`Produit: ${result.product_name}`);
    console.log(`CAS: ${result.cas_number}`);
    console.log('Section 8 - EPI:');
    console.log(`  Gants: ${result.ppe.gloves.join(', ')}`);
    console.log(`  Protection respiratoire: ${result.ppe.respiratory}`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple 3: Recherche produit chimique par CAS
 */
async function exampleChemicalLookup() {
  const client = new NudgeSafeClient();

  try {
    const result = await client.getChemicalInfo('67-64-1');

    console.log('=== Info Produit Chimique ===');
    console.log(`Nom: ${result.name}`);
    console.log(`CAS: ${result.cas_number}`);
    console.log(`Famille: ${result.family}`);
    console.log('Dangers:');
    result.hazards.forEach((hazard) => console.log(`  - ${hazard}`));
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

/**
 * Exemple 4: Intégration dans une interface utilisateur
 */
function setupUI() {
  const client = new NudgeSafeClient();

  // Bouton de recherche
  document.getElementById('search-btn').addEventListener('click', async () => {
    const chemicalName = document.getElementById('chemical-input').value;
    const resultDiv = document.getElementById('result');

    try {
      resultDiv.innerHTML = '<p>Recherche en cours...</p>';

      const result = await client.getGloveRecommendation(chemicalName);

      let html = `<h3>${result.chemical.name}</h3>`;
      html += '<h4>Gants Recommandés:</h4><ul>';
      result.recommendations.recommended.forEach((glove) => {
        html += `<li>✅ ${glove.material} (${glove.breakthrough_time} min)</li>`;
      });
      html += '</ul>';

      resultDiv.innerHTML = html;
    } catch (error) {
      resultDiv.innerHTML = `<p class="error">❌ ${error.message}</p>`;
    }
  });

  // Upload FDS
  document.getElementById('sds-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const statusDiv = document.getElementById('upload-status');

    if (file) {
      try {
        statusDiv.innerHTML = '<p>Parsing en cours...</p>';

        const result = await client.parseSDS(file);

        statusDiv.innerHTML = `
          <h4>FDS Parsée avec Succès</h4>
          <p><strong>Produit:</strong> ${result.product_name}</p>
          <p><strong>CAS:</strong> ${result.cas_number}</p>
          <p><strong>Gants requis:</strong> ${result.ppe.gloves.join(', ')}</p>
        `;
      } catch (error) {
        statusDiv.innerHTML = `<p class="error">❌ ${error.message}</p>`;
      }
    }
  });
}

// =============================================================================
// EXÉCUTION
// =============================================================================

// Pour Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NudgeSafeClient };
}

// Pour navigateur
if (typeof window !== 'undefined') {
  window.NudgeSafeClient = NudgeSafeClient;

  // Exécuter setupUI() quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUI);
  } else {
    setupUI();
  }
}

// Pour tests/démo en ligne de commande Node.js
if (typeof process !== 'undefined' && process.argv[1] === __filename) {
  console.log('NudgeSafe Hands - Exemples API JavaScript\n');
  exampleBasicRecommendation();
}
