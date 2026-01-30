import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, TrendingUp, Users, Eye, Bell, Activity, 
  Clock, ChevronRight, Hand, Zap, BarChart3, Settings, 
  CheckCircle2, Volume2, Play, Pause, Maximize2, X,
  ArrowLeft, MapPin, Sliders, FileText
} from 'lucide-react';

// ============================================
// DONNÉES SIMULÉES
// ============================================
const generateZoneData = () => [
  { id: 'A', name: 'Zone A - Découpe', score: Math.floor(Math.random() * 30) + 70, level: 'vert', workers: 12, glovesRate: 98, nudges: 3, incidents: 0, risk: 'Coupure' },
  { id: 'B', name: 'Zone B - Assemblage', score: Math.floor(Math.random() * 25) + 55, level: 'jaune', workers: 18, glovesRate: 94, nudges: 7, incidents: 0, risk: 'Écrasement' },
  { id: 'C', name: 'Zone C - Soudure', score: Math.floor(Math.random() * 20) + 35, level: 'orange', workers: 8, glovesRate: 87, nudges: 12, incidents: 1, risk: 'Brûlure' },
  { id: 'D', name: 'Zone D - Chimie', score: Math.floor(Math.random() * 15) + 60, level: 'jaune', workers: 6, glovesRate: 96, nudges: 4, incidents: 0, risk: 'Chimique' },
];

const nudgeTypes = [
  { type: 'Direction visuelle', icon: Eye, color: '#3B82F6', description: 'Icônes et symboles universels' },
  { type: 'Feedback sonore', icon: Volume2, color: '#8B5CF6', description: 'Alertes audio contextuelles' },
  { type: 'Preuve sociale', icon: Users, color: '#10B981', description: 'Influence des comportements pairs' },
  { type: 'Timing opportun', icon: Clock, color: '#F59E0B', description: 'Intervention au moment critique' },
];

const generateRecentNudges = () => [
  { time: new Date().toLocaleTimeString('fr-CA'), zone: 'C', worker: 'Anonyme #47', type: 'Preuve sociale', message: '94% de vos collègues portent des gants A4', status: 'success' },
  { time: new Date(Date.now() - 33000).toLocaleTimeString('fr-CA'), zone: 'B', worker: 'Anonyme #23', type: 'Direction visuelle', message: 'Gant requis: A2 anti-écrasement', status: 'success' },
  { time: new Date(Date.now() - 77000).toLocaleTimeString('fr-CA'), zone: 'C', worker: 'Anonyme #12', type: 'Feedback sonore', message: 'Alerte zone orange - EPI manquant', status: 'pending' },
  { time: new Date(Date.now() - 162000).toLocaleTimeString('fr-CA'), zone: 'A', worker: 'Anonyme #08', type: 'Timing opportun', message: 'Rappel avant entrée zone risque', status: 'success' },
];

const predictions = [
  { day: 'Lundi', time: '10h-11h', zone: 'B', risk: 62, reason: 'Pic historique + charge production' },
  { day: 'Mardi', time: '14h-16h', zone: 'C', risk: 78, reason: 'Fatigue post-pause + température' },
  { day: 'Mercredi', time: '09h-10h', zone: 'A', risk: 45, reason: 'Nouveaux travailleurs (< 1 an)' },
];

const zoneDetails = {
  A: { gantRequis: 'A4 Anti-coupure', couleur: '#10B981', compliance: 98, distributeur: '3m à droite' },
  B: { gantRequis: 'A2 Anti-écrasement', couleur: '#F59E0B', compliance: 94, distributeur: '5m devant' },
  C: { gantRequis: 'Thermique 500°C', couleur: '#F97316', compliance: 87, distributeur: '2m à gauche' },
  D: { gantRequis: 'Nitrile Chimique', couleur: '#F59E0B', compliance: 96, distributeur: '4m à droite' },
};

// ============================================
// COMPOSANT: ZONE KIOSK (Écran terrain plein écran)
// ============================================
function ZoneKiosk({ zoneId, onClose }) {
  const [showAlert, setShowAlert] = useState(false);
  const zone = zoneDetails[zoneId] || zoneDetails.C;
  const zoneData = generateZoneData().find(z => z.id === zoneId) || generateZoneData()[2];

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '20px', right: '20px',
        background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444',
        borderRadius: '50%', width: '50px', height: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#EF4444'
      }}>
        <X size={24} />
      </button>

      <div style={{
        background: `${zone.couleur}15`, border: `3px solid ${zone.couleur}`,
        borderRadius: '32px', padding: '60px 80px', textAlign: 'center', maxWidth: '600px'
      }}>
        <div style={{ fontSize: '120px', marginBottom: '20px' }}>🧤</div>
        <div style={{ fontSize: '18px', color: '#64748B', letterSpacing: '3px', marginBottom: '10px' }}>
          ZONE RISQUE {zoneData.risk.toUpperCase()}
        </div>
        <h1 style={{ fontSize: '36px', color: '#E2E8F0', margin: '0 0 30px 0' }}>
          Gant requis : <span style={{ color: zone.couleur }}>{zone.gantRequis}</span>
        </h1>

        <div style={{
          background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981',
          borderRadius: '16px', padding: '20px', marginBottom: '30px'
        }}>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#10B981' }}>{zone.compliance}%</div>
          <div style={{ color: '#94A3B8', fontSize: '16px' }}>de votre équipe est protégée</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94A3B8', marginBottom: '30px' }}>
          <MapPin size={24} />
          <span style={{ fontSize: '18px' }}>Distributeur → {zone.distributeur}</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button style={{
            padding: '16px 32px', background: zone.couleur, border: 'none',
            borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer'
          }}>✓ J'AI MES GANTS</button>
          <button style={{
            padding: '16px 32px', background: 'transparent', border: `2px solid ${zone.couleur}`,
            borderRadius: '12px', color: zone.couleur, fontSize: '16px', fontWeight: '700', cursor: 'pointer'
          }}>DEMANDER ASSISTANCE</button>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', color: '#64748B', fontSize: '12px' }}>
        NudgeSafe Hands — AgenticX5 Ecosystem
      </div>

      {showAlert && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(249, 115, 22, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowAlert(false)}>
          <div style={{
            background: '#F97316', padding: '30px 50px', borderRadius: '20px',
            fontSize: '24px', fontWeight: '700', color: 'white'
          }}>⚠️ ATTENTION — Vérifiez vos gants avant d'entrer</div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT: ZONE DETAIL (Page historique)
// ============================================
function ZoneDetail({ zoneId, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('24h');
  const zone = generateZoneData().find(z => z.id === zoneId) || generateZoneData()[0];
  const detail = zoneDetails[zoneId] || zoneDetails.A;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'nudges', label: 'Historique Nudges', icon: Zap },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'workers', label: 'Travailleurs', icon: Users },
  ];

  const mockNudgesHistory = [
    { time: '14:32:15', type: 'Preuve sociale', message: '94% portent des gants', worker: 'Anonyme #47', response: '8s', status: 'success' },
    { time: '14:28:03', type: 'Direction visuelle', message: 'Gant A4 requis', worker: 'Anonyme #12', response: '15s', status: 'success' },
    { time: '14:15:42', type: 'Feedback sonore', message: 'Zone orange', worker: 'Anonyme #31', response: '45s', status: 'escalated' },
  ];

  const mockIncidents = [
    { date: '2026-01-28', type: 'Quasi-accident', severity: 'medium', description: 'Approche machine sans gants', resolved: true },
    { date: '2026-01-15', type: 'Brûlure mineure', severity: 'low', description: 'Contact bref surface chaude', resolved: true },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      fontFamily: "'JetBrains Mono', monospace", overflow: 'auto'
    }}>
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6',
            borderRadius: '8px', padding: '8px 16px', color: '#3B82F6', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}><ArrowLeft size={16} /> Retour</button>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', letterSpacing: '2px' }}>DÉTAIL ZONE</div>
            <h1 style={{ fontSize: '24px', color: '#E2E8F0', margin: 0 }}>{zone.name}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['1h', '24h', '7j', '30j'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '8px 16px', borderRadius: '6px', border: 'none',
              background: period === p ? '#3B82F6' : 'rgba(59, 130, 246, 0.2)',
              color: period === p ? 'white' : '#3B82F6', cursor: 'pointer', fontSize: '12px'
            }}>{p}</button>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '4px', padding: '16px 32px', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '12px 20px', borderRadius: '8px', border: 'none',
            background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            color: activeTab === tab.id ? '#3B82F6' : '#64748B',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px'
          }}><tab.icon size={16} /> {tab.label}</button>
        ))}
      </div>

      <main style={{ padding: '24px 32px' }}>
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Score actuel', value: zone.score, color: detail.couleur },
                { label: 'Taux port gants', value: `${zone.glovesRate}%`, color: '#10B981' },
                { label: 'Nudges aujourd\'hui', value: zone.nudges, color: '#3B82F6' },
                { label: 'Incidents (30j)', value: zone.incidents, color: '#EF4444' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px', padding: '20px'
                }}>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#94A3B8', fontSize: '14px' }}>ÉVOLUTION DU SCORE</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px' }}>
                {[65, 72, 68, 75, 71, 78, 74, 80, 76, zone.score].map((val, i) => (
                  <div key={i} style={{
                    flex: 1, background: val > 60 ? '#10B981' : val > 40 ? '#F59E0B' : '#EF4444',
                    height: `${val}%`, borderRadius: '4px 4px 0 0', opacity: i === 9 ? 1 : 0.6
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nudges' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {['Heure', 'Type', 'Message', 'Travailleur', 'Réponse', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockNudgesHistory.map((nudge, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{nudge.time}</td>
                    <td style={{ padding: '12px 16px', color: '#E2E8F0' }}>{nudge.type}</td>
                    <td style={{ padding: '12px 16px', color: '#E2E8F0' }}>{nudge.message}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{nudge.worker}</td>
                    <td style={{ padding: '12px 16px', color: '#10B981' }}>{nudge.response}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px',
                        background: nudge.status === 'success' ? '#10B98120' : '#EF444420',
                        color: nudge.status === 'success' ? '#10B981' : '#EF4444'
                      }}>{nudge.status === 'success' ? '✓ Efficace' : '⚠ Escaladé'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockIncidents.map((incident, i) => (
              <div key={i} style={{
                background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${incident.severity === 'medium' ? '#F59E0B' : '#10B981'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#E2E8F0' }}>{incident.type}</span>
                  <span style={{ color: '#64748B', fontSize: '12px' }}>{incident.date}</span>
                </div>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>{incident.description}</p>
                {incident.resolved && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '12px' }}>
                    <CheckCircle2 size={14} /> Résolu
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workers' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {['ID', 'Ancienneté', 'Compliance', 'Nudges', 'Dernier'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '#47', tenure: '3 ans', compliance: 98, nudges: 2, last: 'il y a 2h' },
                  { id: '#12', tenure: '8 mois', compliance: 85, nudges: 8, last: 'il y a 30min' },
                  { id: '#31', tenure: '2 ans', compliance: 94, nudges: 4, last: 'il y a 4h' },
                ].map((w, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <td style={{ padding: '12px 16px', color: '#E2E8F0' }}>Anonyme {w.id}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{w.tenure}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: '#334155', borderRadius: '3px' }}>
                          <div style={{ width: `${w.compliance}%`, height: '100%', background: w.compliance >= 95 ? '#10B981' : '#F59E0B', borderRadius: '3px' }} />
                        </div>
                        <span style={{ color: w.compliance >= 95 ? '#10B981' : '#F59E0B' }}>{w.compliance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{w.nudges}</td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>{w.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// COMPOSANT: NUDGE CONFIG (Panneau configuration)
// ============================================
function NudgeConfig({ onBack, onSave }) {
  const [activeSection, setActiveSection] = useState('strategies');
  const [config, setConfig] = useState({
    strategies: { visual: { enabled: true, intensity: 80 }, audio: { enabled: true, intensity: 60 }, social: { enabled: true, intensity: 90 }, timing: { enabled: true, intensity: 70 } },
    thresholds: { green: { autoAction: true, escalate: false, stopWork: false }, yellow: { autoAction: true, escalate: true, stopWork: false }, orange: { autoAction: true, escalate: true, stopWork: false }, red: { autoAction: true, escalate: true, stopWork: true } },
    timing: { firstNudge: 0, escalation: 30, repeat: 60, cooldown: 300 },
    advanced: { hitl: true, anonymize: true, logging: true, abTesting: true, prediction: true },
  });
  const [hasChanges, setHasChanges] = useState(false);

  const sections = [
    { id: 'strategies', label: 'Stratégies Nudge', icon: Zap },
    { id: 'thresholds', label: 'Seuils & Niveaux', icon: Sliders },
    { id: 'timing', label: 'Délais & Timing', icon: Clock },
    { id: 'advanced', label: 'Options Avancées', icon: Settings },
  ];

  const updateConfig = (path, value) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = newConfig;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return newConfig;
    });
    setHasChanges(true);
  };

  const Toggle = ({ checked, onChange }) => (
    <div onClick={() => onChange(!checked)} style={{
      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
      background: checked ? '#10B981' : '#334155', position: 'relative', transition: 'background 0.2s'
    }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: 'left 0.2s'
      }} />
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      fontFamily: "'JetBrains Mono', monospace", display: 'flex'
    }}>
      <aside style={{
        width: '280px', background: 'rgba(15, 23, 42, 0.8)', borderRight: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '24px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6',
            borderRadius: '8px', padding: '8px', color: '#3B82F6', cursor: 'pointer'
          }}><ArrowLeft size={16} /></button>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', letterSpacing: '2px' }}>CONFIGURATION</div>
            <h2 style={{ fontSize: '18px', color: '#E2E8F0', margin: 0 }}>Système Nudge</h2>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sections.map(section => (
            <button key={section.id} onClick={() => setActiveSection(section.id)} style={{
              padding: '12px 16px', borderRadius: '8px', border: 'none', textAlign: 'left',
              background: activeSection === section.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeSection === section.id ? '#3B82F6' : '#94A3B8',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px'
            }}><section.icon size={18} /> {section.label}</button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => onSave(config)} style={{
            width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
            background: hasChanges ? '#10B981' : '#334155', color: 'white',
            cursor: hasChanges ? 'pointer' : 'default', fontWeight: '600', fontSize: '14px'
          }}>{hasChanges ? '💾 SAUVEGARDER' : 'Aucun changement'}</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {activeSection === 'strategies' && (
          <div>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', letterSpacing: '2px', marginBottom: '24px' }}>STRATÉGIES NUDGE ACTIVES</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { key: 'visual', label: 'Direction visuelle', icon: Eye, color: '#3B82F6', desc: 'Icônes et symboles' },
                { key: 'audio', label: 'Feedback sonore', icon: Volume2, color: '#8B5CF6', desc: 'Alertes audio' },
                { key: 'social', label: 'Preuve sociale', icon: Users, color: '#10B981', desc: 'Comportements pairs' },
                { key: 'timing', label: 'Timing opportun', icon: Clock, color: '#F59E0B', desc: 'Moment critique' },
              ].map(s => (
                <div key={s.key} style={{ background: 'rgba(30, 41, 59, 0.6)', border: `1px solid ${s.color}40`, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <s.icon size={24} color={s.color} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#E2E8F0' }}>{s.label}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{s.desc}</div>
                      </div>
                    </div>
                    <Toggle checked={config.strategies[s.key].enabled} onChange={(v) => updateConfig(`strategies.${s.key}.enabled`, v)} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Intensité</span>
                      <span style={{ fontSize: '11px', color: s.color }}>{config.strategies[s.key].intensity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={config.strategies[s.key].intensity}
                      onChange={(e) => updateConfig(`strategies.${s.key}.intensity`, parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'thresholds' && (
          <div>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', letterSpacing: '2px', marginBottom: '24px' }}>SEUILS & NIVEAUX</h3>
            {[
              { key: 'green', label: 'Vert (0-25)', color: '#10B981' },
              { key: 'yellow', label: 'Jaune (26-50)', color: '#F59E0B' },
              { key: 'orange', label: 'Orange (51-75)', color: '#F97316' },
              { key: 'red', label: 'Rouge (76-100)', color: '#EF4444' },
            ].map(level => (
              <div key={level.key} style={{ background: `${level.color}10`, border: `1px solid ${level.color}40`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 16px 0', color: level.color }}>{level.label}</h4>
                <div style={{ display: 'flex', gap: '32px' }}>
                  {[{ key: 'autoAction', label: 'Action auto' }, { key: 'escalate', label: 'Escalade' }, { key: 'stopWork', label: 'Stop-work' }].map(opt => (
                    <div key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Toggle checked={config.thresholds[level.key][opt.key]} onChange={(v) => updateConfig(`thresholds.${level.key}.${opt.key}`, v)} />
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'timing' && (
          <div>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', letterSpacing: '2px', marginBottom: '24px' }}>DÉLAIS & TIMING</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { key: 'firstNudge', label: 'Délai premier nudge', max: 60 },
                { key: 'escalation', label: 'Délai escalade', max: 120 },
                { key: 'repeat', label: 'Intervalle répétition', max: 180 },
                { key: 'cooldown', label: 'Cooldown', max: 600 },
              ].map(t => (
                <div key={t.key} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', color: '#E2E8F0', fontSize: '14px' }}>{t.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" min="0" max={t.max} value={config.timing[t.key]}
                      onChange={(e) => updateConfig(`timing.${t.key}`, parseInt(e.target.value) || 0)}
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0F172A', color: '#E2E8F0', fontSize: '16px' }} />
                    <span style={{ color: '#64748B', fontSize: '12px' }}>sec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'advanced' && (
          <div>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', letterSpacing: '2px', marginBottom: '24px' }}>OPTIONS AVANCÉES</h3>
            {[
              { key: 'hitl', label: 'Human-in-the-Loop', desc: 'Validation humaine obligatoire', icon: Shield, critical: true },
              { key: 'anonymize', label: 'Anonymisation', desc: 'Pas d\'identification individuelle', icon: Users },
              { key: 'logging', label: 'Journalisation complète', desc: 'Logs pour audit', icon: FileText },
              { key: 'abTesting', label: 'A/B Testing', desc: 'Tests d\'efficacité', icon: BarChart3 },
              { key: 'prediction', label: 'Prédiction 72h', desc: 'Agent HandRiskPredictor', icon: Zap },
            ].map(opt => (
              <div key={opt.key} style={{
                background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px', padding: '20px', marginBottom: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <opt.icon size={24} color={opt.critical ? '#EF4444' : '#3B82F6'} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#E2E8F0' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{opt.desc}</div>
                  </div>
                </div>
                <Toggle checked={config.advanced[opt.key]} onChange={(v) => updateConfig(`advanced.${opt.key}`, v)} />
              </div>
            ))}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #F59E0B', borderRadius: '8px' }}>
              <div style={{ color: '#F59E0B', fontWeight: '600', marginBottom: '8px' }}>⚠️ Note de conformité</div>
              <div style={{ color: '#94A3B8', fontSize: '12px' }}>Certaines options sont requises pour ISO 45001, CNESST et Loi 25.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL: DASHBOARD
// ============================================
export default function NudgeSafeDashboard() {
  const [zones, setZones] = useState(generateZoneData());
  const [recentNudges, setRecentNudges] = useState(generateRecentNudges());
  const [showNudgeDemo, setShowNudgeDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [showKiosk, setShowKiosk] = useState(null);
  const [showZoneDetail, setShowZoneDetail] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setZones(generateZoneData());
      setRecentNudges(generateRecentNudges());
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const globalScore = Math.round(zones.reduce((acc, z) => acc + z.score, 0) / zones.length);
  const totalNudges = zones.reduce((acc, z) => acc + z.nudges, 0);
  const avgGlovesRate = Math.round(zones.reduce((acc, z) => acc + z.glovesRate, 0) / zones.length);

  const getLevelColor = (level) => ({
    vert: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10B981', text: '#10B981' },
    jaune: { bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', text: '#F59E0B' },
    orange: { bg: 'rgba(249, 115, 22, 0.15)', border: '#F97316', text: '#F97316' },
    rouge: { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#EF4444' },
  }[level] || { bg: 'rgba(16, 185, 129, 0.15)', border: '#10B981', text: '#10B981' });

  const runNudgeDemo = () => {
    setShowNudgeDemo(true);
    setDemoStep(0);
    [1, 2, 3, 4, 5].forEach((step, i) => setTimeout(() => setDemoStep(step), (i + 1) * 1500));
    setTimeout(() => setShowNudgeDemo(false), 9000);
  };

  const formatUptime = () => {
    const h = currentTime.getHours().toString().padStart(2, '0');
    const m = currentTime.getMinutes().toString().padStart(2, '0');
    const s = currentTime.getSeconds().toString().padStart(2, '0');
    return `${h} h ${m} min ${s} s`;
  };

  if (showKiosk) return <ZoneKiosk zoneId={showKiosk} onClose={() => setShowKiosk(null)} />;
  if (showZoneDetail) return <ZoneDetail zoneId={showZoneDetail} onBack={() => setShowZoneDetail(null)} />;
  if (showConfig) return <NudgeConfig onBack={() => setShowConfig(false)} onSave={(c) => { console.log('Config:', c); setShowConfig(false); }} />;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)', color: '#E2E8F0', fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); } }`}</style>

      <header style={{ padding: '20px 32px', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hand size={28} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#64748B' }}>BEHAVIORX × AGENTICX5</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#E2E8F0', margin: 0 }}>NudgeSafe Hands</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setShowConfig(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8B5CF6', borderRadius: '8px', color: '#8B5CF6', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}><Settings size={14} /> CONFIG</button>
          <button onClick={() => setIsLive(!isLive)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: isLive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: `1px solid ${isLive ? '#EF4444' : '#10B981'}`, borderRadius: '8px', color: isLive ? '#EF4444' : '#10B981', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{isLive ? <><Pause size={14} /> PAUSE</> : <><Play size={14} /> LIVE</>}</button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748B' }}>SYSTÈME ACTIF</div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatUptime()}</div>
          </div>
          <div style={{ position: 'relative' }}>
            <Bell size={24} style={{ cursor: 'pointer' }} />
            {notifications > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#EF4444', color: 'white', fontSize: '10px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications}</span>}
          </div>
        </div>
      </header>

      <main style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {[
            { label: 'Score Global Sécurité', value: globalScore, suffix: '/100', icon: Shield, color: globalScore > 70 ? '#10B981' : globalScore > 50 ? '#F59E0B' : '#EF4444' },
            { label: 'Nudges Dernières 24h', value: totalNudges * 8, suffix: '', icon: Zap, color: '#3B82F6' },
            { label: 'Taux Port Gants', value: avgGlovesRate, suffix: '%', icon: Hand, color: '#8B5CF6' },
            { label: 'Efficacité Nudges', value: 89, suffix: '%', icon: TrendingUp, color: '#10B981' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}<span style={{ fontSize: '18px', color: '#64748B' }}>{stat.suffix}</span></div>
                </div>
                <stat.icon size={24} color={stat.color} style={{ opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: 0 }}>SURVEILLANCE ZONES EN TEMPS RÉEL</h2>
                <button onClick={runNudgeDemo} style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none', borderRadius: '8px', padding: '10px 20px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> LANCER DÉMO NUDGE</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {zones.map((zone) => {
                  const colors = getLevelColor(zone.level);
                  return (
                    <div key={zone.id} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#E2E8F0' }}>{zone.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>Risque: {zone.risk}</div>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: colors.text }}>{zone.score}</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
                        {[{ label: 'Travailleurs', value: zone.workers }, { label: 'Port gants', value: `${zone.glovesRate}%`, color: zone.glovesRate >= 95 ? '#10B981' : '#F59E0B' }, { label: 'Nudges', value: zone.nudges }].map((s, i) => (
                          <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ color: '#64748B' }}>{s.label}</div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: s.color || '#E2E8F0' }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowZoneDetail(zone.id)} style={{ flex: 1, padding: '8px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F640', borderRadius: '6px', color: '#3B82F6', cursor: 'pointer', fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><BarChart3 size={12} /> DÉTAIL</button>
                        <button onClick={() => setShowKiosk(zone.id)} style={{ flex: 1, padding: '8px', background: `${colors.border}20`, border: `1px solid ${colors.border}40`, borderRadius: '6px', color: colors.text, cursor: 'pointer', fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><Maximize2 size={12} /> KIOSK</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 20px 0' }}>⚠️ PRÉDICTIONS RISQUE 72H — Agent HandRiskPredictor</h2>
              {predictions.map((pred, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', marginBottom: '12px', background: pred.risk > 70 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${pred.risk > 70 ? '#F97316' : '#F59E0B'}40`, borderRadius: '10px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: pred.risk > 70 ? '#F97316' : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px' }}>{pred.risk}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{pred.day} {pred.time} — {pred.zone}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{pred.reason}</div>
                  </div>
                  <ChevronRight size={20} color="#64748B" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 16px 0' }}>STRATÉGIES NUDGE ACTIVES</h2>
              {nudgeTypes.map((nudge, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '8px', background: `${nudge.color}15`, border: `1px solid ${nudge.color}40`, borderRadius: '8px' }}>
                  <nudge.icon size={20} color={nudge.color} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#E2E8F0' }}>{nudge.type}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{nudge.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 16px 0' }}>NUDGES RÉCENTS — TEMPS RÉEL</h2>
              {recentNudges.map((nudge, i) => (
                <div key={i} style={{ padding: '14px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', borderLeft: `3px solid ${nudge.status === 'success' ? '#10B981' : '#F59E0B'}`, marginBottom: '12px', animation: i === 0 ? 'slideIn 0.5s ease' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{nudge.time}</span>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: '#3B82F620', borderRadius: '4px', color: '#3B82F6' }}>Zone {nudge.zone}</span>
                    </div>
                    {nudge.status === 'success' ? <CheckCircle2 size={16} color="#10B981" /> : <Clock size={16} color="#F59E0B" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>{nudge.type} → {nudge.worker}</div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>"{nudge.message}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: '16px 32px', borderTop: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
        <div>AgenticX5 Ecosystem v1.0 — Conforme ISO 45001 • CNESST • OSHA • Loi 25/RGPD</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />4 Agents Actifs</span>
          <span>Latence: 127ms</span>
          <span>Human-in-the-Loop: Activé</span>
        </div>
      </footer>

      {showNudgeDemo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: '2px solid #3B82F6', borderRadius: '24px', padding: '48px', maxWidth: '600px', textAlign: 'center', animation: 'glow 2s infinite' }}>
            <div style={{ fontSize: '12px', letterSpacing: '3px', color: '#64748B', marginBottom: '16px' }}>SIMULATION SÉQUENCE NUDGE</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {[1, 2, 3, 4, 5].map((step) => (<div key={step} style={{ width: '40px', height: '4px', borderRadius: '2px', background: demoStep >= step ? '#3B82F6' : '#334155' }} />))}
            </div>
            <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {demoStep === 0 && <><Activity size={64} color="#3B82F6" /><p style={{ marginTop: '16px', color: '#94A3B8' }}>Initialisation...</p></>}
              {demoStep === 1 && <><Eye size={64} color="#F97316" /><h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>📹 Détection Vision IA</h3><p style={{ color: '#94A3B8' }}>Travailleur sans gants détecté en Zone C</p></>}
              {demoStep === 2 && <><BarChart3 size={64} color="#8B5CF6" /><h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>🧠 Agent HandRiskPredictor</h3><p style={{ color: '#94A3B8' }}>Score zone: 68/100 — Niveau ORANGE</p></>}
              {demoStep === 3 && <><Zap size={64} color="#3B82F6" /><h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>⚡ Agent NudgeOrchestrator</h3><p style={{ color: '#94A3B8' }}>Sélection: Feedback visuel + Preuve sociale</p></>}
              {demoStep === 4 && <div style={{ background: '#F9731620', border: '2px solid #F97316', borderRadius: '16px', padding: '24px', width: '100%' }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🧤</div><h3 style={{ fontSize: '20px', margin: '0 0 8px' }}>ZONE RISQUE COUPURE</h3><p style={{ color: '#F97316', fontWeight: '600' }}>Gant requis: A4 anti-coupure</p><p style={{ color: '#10B981', marginTop: '8px' }}>📊 94% de vos collègues sont protégés</p></div>}
              {demoStep === 5 && <><CheckCircle2 size={64} color="#10B981" /><h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>✅ Nudge Efficace</h3><p style={{ color: '#94A3B8' }}>Compliance en 12 secondes — Log archivé</p></>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
