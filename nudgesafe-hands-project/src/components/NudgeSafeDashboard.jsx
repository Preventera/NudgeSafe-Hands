import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, TrendingUp, Users, Eye, Bell, Activity, 
  Clock, ChevronRight, Hand, Zap, BarChart3, Settings, FileText, 
  CheckCircle2, XCircle, Volume2, Play, Pause, RefreshCw
} from 'lucide-react';

// Données simulées temps réel
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

export default function NudgeSafeDashboard() {
  const [zones, setZones] = useState(generateZoneData());
  const [recentNudges, setRecentNudges] = useState(generateRecentNudges());
  const [selectedZone, setSelectedZone] = useState(null);
  const [showNudgeDemo, setShowNudgeDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Mise à jour de l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation données temps réel
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

  const getLevelColor = (level) => {
    const colors = {
      vert: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10B981', text: '#10B981' },
      jaune: { bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', text: '#F59E0B' },
      orange: { bg: 'rgba(249, 115, 22, 0.15)', border: '#F97316', text: '#F97316' },
      rouge: { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#EF4444' },
    };
    return colors[level] || colors.vert;
  };

  const runNudgeDemo = () => {
    setShowNudgeDemo(true);
    setDemoStep(0);
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((step, i) => {
      setTimeout(() => setDemoStep(step), (i + 1) * 1500);
    });
    setTimeout(() => setShowNudgeDemo(false), 9000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      color: '#E2E8F0',
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grille animée en arrière-plan */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />

      {/* Header */}
      <header style={{
        position: 'relative',
        padding: '20px 32px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
          }}>
            <Hand size={28} color="white" />
          </div>
          <div>
            <div style={{ 
              fontSize: '10px', 
              letterSpacing: '3px', 
              color: '#64748B',
              marginBottom: '2px'
            }}>
              BEHAVIORX × AGENTICX5
            </div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              background: 'linear-gradient(90deg, #E2E8F0, #94A3B8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              NudgeSafe Hands
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Toggle Live/Pause */}
          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: isLive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${isLive ? '#10B981' : '#EF4444'}`,
              borderRadius: '8px',
              color: isLive ? '#10B981' : '#EF4444',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {isLive ? <Play size={14} /> : <Pause size={14} />}
            {isLive ? 'LIVE' : 'PAUSE'}
          </button>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748B' }}>SYSTÈME ACTIF</div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {currentTime.toLocaleTimeString('fr-CA')}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Bell size={24} style={{ cursor: 'pointer' }} />
            {notifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#EF4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                {notifications}
              </span>
            )}
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', padding: '24px 32px' }}>
        {/* Statistiques globales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Score Global Sécurité', value: globalScore, suffix: '/100', icon: Shield, color: globalScore > 70 ? '#10B981' : globalScore > 50 ? '#F59E0B' : '#EF4444' },
            { label: 'Nudges Dernières 24h', value: totalNudges * 8, suffix: '', icon: Zap, color: '#3B82F6' },
            { label: 'Taux Port Gants', value: avgGlovesRate, suffix: '%', icon: Hand, color: '#8B5CF6' },
            { label: 'Efficacité Nudges', value: 89, suffix: '%', icon: TrendingUp, color: '#10B981' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle at top right, ${stat.color}20, transparent 70%)`,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>
                    {stat.label.toUpperCase()}
                  </div>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700',
                    color: stat.color,
                    lineHeight: 1
                  }}>
                    {stat.value}<span style={{ fontSize: '18px', color: '#64748B' }}>{stat.suffix}</span>
                  </div>
                </div>
                <stat.icon size={24} color={stat.color} style={{ opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Grille principale */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Colonne gauche - Zones */}
          <div>
            {/* Cartes des zones */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: 0 }}>
                  SURVEILLANCE ZONES EN TEMPS RÉEL
                </h2>
                <button
                  onClick={runNudgeDemo}
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Activity size={16} />
                  LANCER DÉMO NUDGE
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {zones.map((zone) => {
                  const colors = getLevelColor(zone.level);
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                      style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 0 30px ${colors.border}40`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Effet de ligne de scan */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
                        animation: 'scanline 3s linear infinite',
                        opacity: 0.5
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#E2E8F0' }}>
                            {zone.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                            Risque: {zone.risk}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '28px',
                          fontWeight: '700',
                          color: colors.text
                        }}>
                          {zone.score}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ color: '#64748B' }}>Travailleurs</div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{zone.workers}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ color: '#64748B' }}>Port gants</div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: zone.glovesRate >= 95 ? '#10B981' : '#F59E0B' }}>
                            {zone.glovesRate}%
                          </div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ color: '#64748B' }}>Nudges</div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{zone.nudges}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prédictions 72h */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 20px 0' }}>
                ⚠️ PRÉDICTIONS RISQUE 72H — Agent HandRiskPredictor
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {predictions.map((pred, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: pred.risk > 70 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${pred.risk > 70 ? '#F97316' : '#F59E0B'}40`,
                    borderRadius: '10px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '10px',
                      background: pred.risk > 70 ? '#F97316' : '#F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '18px'
                    }}>
                      {pred.risk}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {pred.day} {pred.time} — {pred.zone}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {pred.reason}
                      </div>
                    </div>
                    <ChevronRight size={20} color="#64748B" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - Feed d'activité */}
          <div>
            {/* Types de nudges */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 16px 0' }}>
                STRATÉGIES NUDGE ACTIVES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {nudgeTypes.map((nudge, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: `${nudge.color}15`,
                    border: `1px solid ${nudge.color}40`,
                    borderRadius: '8px'
                  }}>
                    <nudge.icon size={20} color={nudge.color} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{nudge.type}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{nudge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed des nudges récents */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94A3B8', margin: '0 0 16px 0' }}>
                NUDGES RÉCENTS — TEMPS RÉEL
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentNudges.map((nudge, i) => (
                  <div key={i} style={{
                    padding: '14px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    borderLeft: `3px solid ${nudge.status === 'success' ? '#10B981' : '#F59E0B'}`,
                    animation: i === 0 ? 'slideIn 0.5s ease' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontVariantNumeric: 'tabular-nums',
                          color: '#64748B'
                        }}>
                          {nudge.time}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          background: '#3B82F620',
                          borderRadius: '4px',
                          color: '#3B82F6'
                        }}>
                          Zone {nudge.zone}
                        </span>
                      </div>
                      {nudge.status === 'success' ? (
                        <CheckCircle2 size={16} color="#10B981" />
                      ) : (
                        <Clock size={16} color="#F59E0B" />
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                      {nudge.type} → {nudge.worker}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      "{nudge.message}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de démo Nudge */}
        {showNudgeDemo && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1E293B, #0F172A)',
              border: '2px solid #3B82F6',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '600px',
              textAlign: 'center',
              animation: 'glow 2s infinite'
            }}>
              <div style={{ fontSize: '12px', letterSpacing: '3px', color: '#64748B', marginBottom: '16px' }}>
                SIMULATION SÉQUENCE NUDGE
              </div>
              
              {/* Indicateur de progression */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} style={{
                    width: '40px',
                    height: '4px',
                    borderRadius: '2px',
                    background: demoStep >= step ? '#3B82F6' : '#334155',
                    transition: 'background 0.3s'
                  }} />
                ))}
              </div>

              {/* Contenu des étapes */}
              <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {demoStep === 0 && (
                  <div style={{ animation: 'pulse 1s infinite' }}>
                    <Activity size={64} color="#3B82F6" />
                    <p style={{ marginTop: '16px', color: '#94A3B8' }}>Initialisation...</p>
                  </div>
                )}
                {demoStep === 1 && (
                  <>
                    <Eye size={64} color="#F97316" />
                    <h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>📹 Détection Vision IA</h3>
                    <p style={{ color: '#94A3B8' }}>Travailleur sans gants détecté en Zone C (Orange)</p>
                  </>
                )}
                {demoStep === 2 && (
                  <>
                    <BarChart3 size={64} color="#8B5CF6" />
                    <h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>🧠 Agent HandRiskPredictor</h3>
                    <p style={{ color: '#94A3B8' }}>Score zone calculé: 68/100 — Niveau ORANGE</p>
                  </>
                )}
                {demoStep === 3 && (
                  <>
                    <Zap size={64} color="#3B82F6" />
                    <h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>⚡ Agent NudgeOrchestrator</h3>
                    <p style={{ color: '#94A3B8' }}>Sélection: Feedback visuel + Preuve sociale</p>
                  </>
                )}
                {demoStep === 4 && (
                  <div style={{
                    background: '#F9731620',
                    border: '2px solid #F97316',
                    borderRadius: '16px',
                    padding: '24px',
                    width: '100%'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧤</div>
                    <h3 style={{ fontSize: '20px', margin: '0 0 8px' }}>ZONE RISQUE COUPURE</h3>
                    <p style={{ color: '#F97316', fontWeight: '600' }}>Gant requis: A4 anti-coupure</p>
                    <p style={{ color: '#10B981', marginTop: '8px' }}>📊 94% de vos collègues sont protégés</p>
                  </div>
                )}
                {demoStep === 5 && (
                  <>
                    <CheckCircle2 size={64} color="#10B981" />
                    <h3 style={{ fontSize: '24px', margin: '16px 0 8px' }}>✅ Nudge Efficace</h3>
                    <p style={{ color: '#94A3B8' }}>Compliance en 12 secondes — Log archivé pour audit</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        padding: '16px 32px',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#64748B'
      }}>
        <div>
          AgenticX5 Ecosystem v1.0 — Conforme ISO 45001 • CNESST • OSHA • Loi 25/RGPD
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
            4 Agents Actifs
          </span>
          <span>Latence: 127ms</span>
          <span>Human-in-the-Loop: Activé</span>
        </div>
      </footer>
    </div>
  );
}
