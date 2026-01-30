// Données simulées pour NudgeSafe Hands
// Ces données représentent ce que les agents IA collecteraient en temps réel

export const ZONE_TEMPLATES = [
  { 
    id: 'A', 
    name: 'Zone A - Découpe', 
    baseScore: 75, 
    level: 'vert', 
    baseWorkers: 12, 
    baseGlovesRate: 98, 
    risk: 'Coupure',
    requiredGlove: 'A4 anti-coupure',
    machines: ['Scie circulaire', 'Cisaille', 'Découpe laser']
  },
  { 
    id: 'B', 
    name: 'Zone B - Assemblage', 
    baseScore: 60, 
    level: 'jaune', 
    baseWorkers: 18, 
    baseGlovesRate: 94, 
    risk: 'Écrasement',
    requiredGlove: 'A2 anti-écrasement',
    machines: ['Presse hydraulique', 'Riveteuse', 'Visseuse industrielle']
  },
  { 
    id: 'C', 
    name: 'Zone C - Soudure', 
    baseScore: 45, 
    level: 'orange', 
    baseWorkers: 8, 
    baseGlovesRate: 87, 
    risk: 'Brûlure',
    requiredGlove: 'Gants thermiques niveau 3',
    machines: ['Poste MIG', 'Poste TIG', 'Chalumeau']
  },
  { 
    id: 'D', 
    name: 'Zone D - Chimie', 
    baseScore: 65, 
    level: 'jaune', 
    baseWorkers: 6, 
    baseGlovesRate: 96, 
    risk: 'Chimique',
    requiredGlove: 'Nitrile résistant chimique',
    machines: ['Cuve de mélange', 'Station de dilution', 'Poste de nettoyage']
  },
];

export const NUDGE_TYPES = [
  { 
    type: 'Direction visuelle', 
    icon: 'Eye', 
    color: '#3B82F6', 
    description: 'Icônes et symboles universels',
    effectiveness: 0.78,
    triggerConditions: ['Entrée zone', 'Changement tâche', 'Nouveau travailleur']
  },
  { 
    type: 'Feedback sonore', 
    icon: 'Volume2', 
    color: '#8B5CF6', 
    description: 'Alertes audio contextuelles',
    effectiveness: 0.85,
    triggerConditions: ['Non-port détecté', 'Zone critique', 'Escalade timeout']
  },
  { 
    type: 'Preuve sociale', 
    icon: 'Users', 
    color: '#10B981', 
    description: 'Influence des comportements pairs',
    effectiveness: 0.92,
    triggerConditions: ['Taux équipe > 90%', 'Première intervention', 'Rappel positif']
  },
  { 
    type: 'Timing opportun', 
    icon: 'Clock', 
    color: '#F59E0B', 
    description: 'Intervention au moment critique',
    effectiveness: 0.88,
    triggerConditions: ['30s avant zone', 'Pic risque prédit', 'Pause terminée']
  },
];

export const RISK_LEVELS = {
  vert: { min: 0, max: 25, label: 'Faible', action: 'Rappel visuel standard' },
  jaune: { min: 26, max: 50, label: 'Modéré', action: 'Nudge renforcé + notification superviseur' },
  orange: { min: 51, max: 75, label: 'Élevé', action: 'Alerte intrusive + pause suggérée + HSE' },
  rouge: { min: 76, max: 100, label: 'Critique', action: 'Stop-work automatique + HITL obligatoire' },
};

export const PREDICTIONS_72H = [
  { 
    day: 'Lundi', 
    time: '10h-11h', 
    zone: 'B', 
    risk: 62, 
    reason: 'Pic historique + charge production élevée',
    recommendation: 'Renforcer présence superviseur, pré-positionner EPI'
  },
  { 
    day: 'Mardi', 
    time: '14h-16h', 
    zone: 'C', 
    risk: 78, 
    reason: 'Fatigue post-pause + température atelier élevée',
    recommendation: 'Pauses supplémentaires, hydratation, nudges renforcés'
  },
  { 
    day: 'Mercredi', 
    time: '09h-10h', 
    zone: 'A', 
    risk: 45, 
    reason: 'Nouveaux travailleurs (< 1 an ancienneté)',
    recommendation: 'Accompagnement renforcé, nudges didactiques'
  },
];

export const AGENT_STATUS = [
  { name: 'NudgeOrchestrator', status: 'active', latency: '127ms', lastAction: 'Nudge émis Zone C' },
  { name: 'HandRiskPredictor', status: 'active', latency: '2.3s', lastAction: 'Prédiction mise à jour' },
  { name: 'NudgeEffectivenessTracker', status: 'active', latency: '45ms', lastAction: 'Log enregistré' },
  { name: 'ComplianceReporter', status: 'idle', latency: '-', lastAction: 'Rapport mensuel généré' },
];

export const COMPLIANCE_STANDARDS = [
  { name: 'ISO 45001:2018', status: 'conforme', lastAudit: '2025-01-15', nextAudit: '2025-04-15' },
  { name: 'CNESST RSST', status: 'conforme', lastAudit: '2025-01-20', nextAudit: '2025-07-20' },
  { name: 'OSHA 1910.138', status: 'conforme', lastAudit: '2025-01-10', nextAudit: '2025-07-10' },
  { name: 'Loi 25 / RGPD', status: 'conforme', lastAudit: '2025-01-25', nextAudit: '2025-01-25' },
];

// Fonctions utilitaires pour générer des données dynamiques

export function generateZoneData() {
  return ZONE_TEMPLATES.map(zone => ({
    ...zone,
    score: Math.floor(Math.random() * 30) + zone.baseScore - 15,
    workers: zone.baseWorkers + Math.floor(Math.random() * 4) - 2,
    glovesRate: Math.min(100, zone.baseGlovesRate + Math.floor(Math.random() * 6) - 3),
    nudges: Math.floor(Math.random() * 10) + 2,
    incidents: zone.level === 'orange' ? (Math.random() > 0.7 ? 1 : 0) : 0,
    level: calculateRiskLevel(Math.floor(Math.random() * 30) + zone.baseScore - 15)
  }));
}

export function calculateRiskLevel(score) {
  if (score >= 76) return 'rouge';
  if (score >= 51) return 'orange';
  if (score >= 26) return 'jaune';
  return 'vert';
}

export function generateRecentNudges() {
  const workers = ['#47', '#23', '#12', '#08', '#31', '#55', '#19', '#42'];
  const messages = [
    { type: 'Preuve sociale', message: '94% de vos collègues portent des gants A4' },
    { type: 'Direction visuelle', message: 'Gant requis: A2 anti-écrasement' },
    { type: 'Feedback sonore', message: 'Alerte zone orange - EPI manquant' },
    { type: 'Timing opportun', message: 'Rappel avant entrée zone risque' },
    { type: 'Preuve sociale', message: 'Votre équipe maintient 98% de conformité' },
    { type: 'Direction visuelle', message: 'Zone brûlure - gants thermiques obligatoires' },
  ];
  
  return Array.from({ length: 4 }, (_, i) => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return {
      time: new Date(Date.now() - i * 45000).toLocaleTimeString('fr-CA'),
      zone: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      worker: `Anonyme ${workers[Math.floor(Math.random() * workers.length)]}`,
      type: msg.type,
      message: msg.message,
      status: Math.random() > 0.2 ? 'success' : 'pending'
    };
  });
}

export const KPI_TARGETS = {
  handInjuriesReduction: { target: -40, unit: '%', current: -32 },
  glovesComplianceRedZone: { target: 98, unit: '%', current: 96.5 },
  nudgeEffectiveness: { target: 85, unit: '%', current: 89 },
  roiPrevention: { target: 4, unit: ':1', current: 3.8 },
  workerSatisfaction: { target: 70, unit: '%', current: 74 },
  surveillancePerception: { target: 20, unit: '%', current: 18 },
  appealRate: { target: 5, unit: '%', current: 3.2 },
};
