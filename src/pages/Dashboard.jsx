import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { MONTHLY_STATS, CATEGORY_STATS, RESPONSE_TIME_DATA, WARD_STATS, PREDICTIVE_ALERTS } from '../data/mockData.js';
import './Dashboard.css';

const CHART_COLORS = ['#4f6ef7', '#8b5cf6', '#06d6a0', '#f59e0b', '#ef4444', '#22c55e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-accent)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 700, fontSize: '0.875rem' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { state } = useApp();
  const { issues, currentUser } = state;
  const t = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get('tab') === 'personal' ? 'personal' : 'community';
  const setViewMode = (mode) => {
    setSearchParams({ tab: mode });
  };

  // Community view metrics
  const totalIssues = issues.length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const inProgress = issues.filter(i => i.status === 'in_progress').length;
  const critical = issues.filter(i => i.priority === 'critical').length;
  const resolutionRate = Math.round((resolved / totalIssues) * 100);
  const totalVotes = issues.reduce((sum, i) => sum + i.votes, 0);

  const radarData = CATEGORY_STATS.map(c => ({
    category: t(c.name),
    issues: c.value,
    resolved: Math.round(c.value * 0.65)
  }));

  const pipelineData = [
    { name: t('Reported'), count: issues.filter(i => i.status === 'reported').length, color: '#f59e0b' },
    { name: t('Verified'), count: issues.filter(i => i.status === 'verified').length, color: '#3b82f6' },
    { name: t('In Progress'), count: issues.filter(i => i.status === 'in_progress').length, color: '#8b5cf6' },
    { name: t('Resolved'), count: issues.filter(i => i.status === 'resolved').length, color: '#06d6a0' },
  ];

  // Personal view metrics & calculations
  const myIssues = issues.filter(i => i.reportedBy === 'cu1');
  const myResolvedCount = 3 + myIssues.filter(i => i.status === 'resolved' && i.id !== 'iss004').length;

  const personalActivityData = [
    { week: 'Week 1', xp: 100, reports: 1, verifications: 0, votes: 2 },
    { week: 'Week 2', xp: 220, reports: 2, verifications: 1, votes: 4 },
    { week: 'Week 3', xp: 295, reports: 1, verifications: 2, votes: 7 },
    { week: 'Week 4', xp: currentUser.points, reports: myIssues.length, verifications: currentUser.issuesVerified || 3, votes: currentUser.totalVotes || 12 },
  ];

  // Dynamically group personal reports by category and seed other default values
  const defaultCategoryStats = {
    'infrastructure': 2,
    'public_safety': 2,
    'sanitation': 1,
    'utilities': 1,
  };
  const combinedCategoryStats = { ...defaultCategoryStats };
  myIssues.forEach(i => {
    combinedCategoryStats[i.category] = (combinedCategoryStats[i.category] || 0) + 1;
  });

  const personalCategoryStats = Object.keys(combinedCategoryStats).map(key => {
    const colors = {
      'infrastructure': '#f59e0b',
      'utilities': '#3b82f6',
      'sanitation': '#10b981',
      'public_safety': '#ef4444',
      'environment': '#22c55e',
      'public_property': '#8b5cf6',
    };
    const labels = {
      'infrastructure': 'Infrastructure',
      'utilities': 'Utilities',
      'sanitation': 'Sanitation',
      'public_safety': 'Public Safety',
      'environment': 'Environment',
      'public_property': 'Public Property',
    };
    return {
      name: labels[key] || key,
      value: combinedCategoryStats[key],
      color: colors[key] || '#8b5cf6'
    };
  });

  // Calculate level details dynamically based on currentUser.points
  const getNextLevelInfo = (points) => {
    if (points >= 1000) return { current: 'Legend', next: 'Grand Legend', target: 2000, nextLevel: 9, prevTarget: 1000 };
    if (points >= 750) return { current: 'Champion', next: 'Legend', target: 1000, nextLevel: 8, prevTarget: 750 };
    if (points >= 500) return { current: 'Hero', next: 'Champion', target: 750, nextLevel: 5, prevTarget: 500 };
    if (points >= 250) return { current: 'Guardian', next: 'Hero', target: 500, nextLevel: 4, prevTarget: 250 };
    return { current: 'Rookie', next: 'Guardian', target: 250, nextLevel: 3, prevTarget: 0 };
  };
  const levelInfo = getNextLevelInfo(currentUser.points);
  const tierProgress = currentUser.points - levelInfo.prevTarget;
  const tierTotal = levelInfo.target - levelInfo.prevTarget;
  const tierPercentage = Math.round((tierProgress / tierTotal) * 100);

  return (
    <div className="page-container dashboard-page">
      <div className="page-header">
        <h1 className="page-title">{t("Impact Dashboard")}</h1>
        <p className="page-subtitle">{t("Real-time analytics · Community performance · AI insights")}</p>
      </div>

      {/* Segmented Control View Toggle */}
      <div className="dashboard-tabs">
        <button
          className={`dash-tab ${viewMode === 'community' ? 'active' : ''}`}
          onClick={() => setViewMode('community')}
        >
          🏙️ {t("Community Impact")}
        </button>
        <button
          className={`dash-tab ${viewMode === 'personal' ? 'active' : ''}`}
          onClick={() => setViewMode('personal')}
        >
          🦸 {t("My Personal Impact")}
        </button>
      </div>

      {viewMode === 'community' ? (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(79,110,247,0.15)', color: '#4f6ef7' }}>📋</div>
              <div className="kpi-info">
                <div className="kpi-value">{totalIssues}</div>
                <div className="kpi-label">{t("Total Issues")}</div>
                <div className="kpi-trend positive">↑ 23% this month</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(6,214,160,0.15)', color: '#06d6a0' }}>✅</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#06d6a0' }}>{resolutionRate}%</div>
                <div className="kpi-label">{t("Resolution Rate")}</div>
                <div className="kpi-trend positive">↑ 8% improvement</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⚡</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#f59e0b' }}>3.2</div>
                <div className="kpi-label">{t("Avg. Days to Resolve")}</div>
                <div className="kpi-trend positive">↓ 15% faster</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>🚨</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#ef4444' }}>{critical}</div>
                <div className="kpi-label">{t("Critical Issues")}</div>
                <div className="kpi-trend negative">Needs attention</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>▲</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#8b5cf6' }}>{totalVotes}</div>
                <div className="kpi-label">{t("Community Votes")}</div>
                <div className="kpi-trend positive">↑ Strong engagement</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>🏙️</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#22c55e' }}>6</div>
                <div className="kpi-label">{t("Wards Active")}</div>
                <div className="kpi-trend positive">Full city coverage</div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Monthly Trend */}
            <div className="chart-card wide">
              <div className="chart-header">
                <h3 className="chart-title">📈 Monthly Issue Trends</h3>
                <div className="chart-legend">
                  <span style={{ color: '#4f6ef7' }}>● Reported</span>
                  <span style={{ color: '#06d6a0' }}>● Resolved</span>
                  <span style={{ color: '#8b5cf6' }}>● In Progress</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={MONTHLY_STATS}>
                  <defs>
                    <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06d6a0" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="reported" name="Reported" stroke="#4f6ef7" strokeWidth={2.5} fill="url(#gradReported)" />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#06d6a0" strokeWidth={2.5} fill="url(#gradResolved)" />
                  <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#8b5cf6" strokeWidth={2} fill="none" strokeDasharray="5 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">📊 Issue by Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={CATEGORY_STATS}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_STATS.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {CATEGORY_STATS.map(c => (
                  <div key={c.name} className="pie-legend-item">
                    <div className="pie-dot" style={{ background: c.color }} />
                    <span className="text-xs text-muted">{t(c.name)}</span>
                    <span className="text-xs font-semibold" style={{ color: c.color }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time Bar */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">⏱️ Avg. Resolution Time (days)</h3>
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={RESPONSE_TIME_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="category" stroke="var(--text-muted)" tick={{ fontSize: 11 }} width={120} tickFormatter={(val) => t(val)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" name="Days" radius={[0, 6, 6, 0]}>
                    {RESPONSE_TIME_DATA.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-insights" style={{ marginTop: '0.85rem', borderTop: '1px solid var(--border-primary)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚡ {t("Fastest Response")}:</span>
                  <span style={{ fontWeight: 700, color: '#06d6a0' }}>{t("Public Safety")} (1.8 {t("days")})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚠️ {t("System Bottleneck")}:</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{t("Public Property")} (6.3 {t("days")})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>🎯 {t("Overall City Average")}:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>3.8 {t("days")}</span>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">🎯 {t("Category Radar")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="var(--chart-grid)" strokeWidth={1.5} />
                  <PolarAngleAxis dataKey="category" stroke="var(--text-primary)" tick={{ fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                  <Radar name="Issues" dataKey="issues" stroke="#4f6ef7" fill="#4f6ef7" fillOpacity={0.35} />
                  <Radar name="Resolved" dataKey="resolved" stroke="#06d6a0" fill="#06d6a0" fillOpacity={0.25} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Ticket Pipeline Status Bar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">📊 {t("Ticket Pipeline Status")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]}>
                    {pipelineData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ward Performance */}
            <div className="chart-card wide">
              <div className="chart-header">
                <h3 className="chart-title">🏙️ Ward Performance Scores</h3>
                <div className="text-xs text-muted">Score = (resolved / total) × 100</div>
              </div>
              <div className="ward-table">
                <div className="ward-table-header">
                  <span>Ward</span>
                  <span>Total Issues</span>
                  <span>Resolved</span>
                  <span>Score</span>
                  <span>Performance</span>
                </div>
                {WARD_STATS.sort((a,b) => b.score - a.score).map((ward, i) => {
                  const perc = ward.score;
                  const color = perc >= 85 ? '#06d6a0' : perc >= 75 ? '#22c55e' : perc >= 65 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={ward.ward} className="ward-table-row">
                      <span className="ward-name">
                        <span className="ward-rank">{i + 1}</span>
                        {ward.ward}
                      </span>
                      <span className="text-sm">{ward.issues}</span>
                      <span className="text-sm" style={{ color: '#06d6a0' }}>{ward.resolved}</span>
                      <span className="ward-score" style={{ color }}>{perc}%</span>
                      <div className="ward-bar-wrap">
                        <div className="ward-bar">
                          <div className="ward-bar-fill" style={{ width: `${perc}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Predictive Section */}
          <div className="predictive-section">
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>🔮 AI Predictive Insights</h2>
            <div className="predictive-grid">
              {PREDICTIVE_ALERTS.map(alert => (
                <div key={alert.id} className={`predictive-card alert-${alert.urgency}`}>
                  <div className="predictive-icon">{alert.icon}</div>
                  <div className="predictive-content">
                    <div className="predictive-title">{alert.title}</div>
                    <p className="predictive-desc text-sm text-muted">{alert.desc}</p>
                  </div>
                  <div className={`urgency-tag urgency-${alert.urgency}`}>{alert.urgency}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Personal KPI Grid */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(79,110,247,0.15)', color: '#4f6ef7' }}>📋</div>
              <div className="kpi-info">
                <div className="kpi-value">{currentUser.issuesReported}</div>
                <div className="kpi-label">{t("Total Reported")}</div>
                <div className="kpi-trend positive">{myIssues.length} active in system</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(6,214,160,0.15)', color: '#06d6a0' }}>🛡️</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#06d6a0' }}>{currentUser.issuesVerified || 0}</div>
                <div className="kpi-label">{t("Total Verified")}</div>
                <div className="kpi-trend positive">Contributions rewarded</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>✅</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#22c55e' }}>{myResolvedCount}</div>
                <div className="kpi-label">{t("Issues Resolved")}</div>
                <div className="kpi-trend positive">{Math.round((myResolvedCount / currentUser.issuesReported) * 100)}% resolution rate</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⭐</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#f59e0b' }}>{currentUser.points}</div>
                <div className="kpi-label">{t("Civic Wallet (XP)")}</div>
                <div className="kpi-trend positive">Level {currentUser.level} Citizen</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>🔥</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#ef4444' }}>{currentUser.streak || 0}</div>
                <div className="kpi-label">{t("Daily Streak")}</div>
                <div className="kpi-trend positive">Keep it up!</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>▲</div>
              <div className="kpi-info">
                <div className="kpi-value" style={{ color: '#8b5cf6' }}>{currentUser.totalVotes || 0}</div>
                <div className="kpi-label">{t("Votes Cast")}</div>
                <div className="kpi-trend positive">Active participant</div>
              </div>
            </div>
          </div>

          {/* Personal Charts Grid */}
          <div className="charts-grid">
            {/* XP Growth Chart */}
            <div className="chart-card wide">
              <div className="chart-header">
                <h3 className="chart-title">📈 {t("My Activity & XP Growth")}</h3>
                <div className="chart-legend">
                  <span style={{ color: '#4f6ef7' }}>● XP Points</span>
                  <span style={{ color: '#06d6a0' }}>● Votes Cast</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={personalActivityData}>
                  <defs>
                    <linearGradient id="gradPersonalXP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="week" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area yAxisId="left" type="monotone" dataKey="xp" name="XP Points" stroke="#4f6ef7" strokeWidth={2.5} fill="url(#gradPersonalXP)" />
                  <Bar yAxisId="right" dataKey="votes" name="Votes Cast" fill="#06d6a0" barSize={15} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown of my reports */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">🍕 {t("Category Breakdown of My Reports")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={personalCategoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {personalCategoryStats.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {personalCategoryStats.map(c => (
                  <div key={c.name} className="pie-legend-item">
                    <div className="pie-dot" style={{ background: c.color }} />
                    <span className="text-xs text-muted">{t(c.name)}</span>
                    <span className="text-xs font-semibold" style={{ color: c.color }}>{c.value} issues</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level progress section */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">⚡ {t("Level Progress")}</h3>
              </div>
              <div className="personal-level-progress-card">
                <div className="level-badge-large">{levelInfo.current === 'Legend' ? '👑' : levelInfo.current === 'Champion' ? '🏆' : levelInfo.current === 'Hero' ? '🦸' : levelInfo.current === 'Guardian' ? '🛡️' : '🌱'}</div>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Level {currentUser.level} Citizen ({levelInfo.current})
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                  You are currently ranked in the top 12% of your neighborhood. Earn {levelInfo.target - currentUser.points} more XP to unlock Level {levelInfo.nextLevel} ({levelInfo.next})!
                </p>
                
                <div className="progress-bar-container-large">
                  <div className="progress-bar-header">
                    <span>{currentUser.points} XP</span>
                    <span>{levelInfo.target} XP</span>
                  </div>
                  <div className="progress-bar-large">
                    <div className="progress-bar-large-fill" style={{ width: `${Math.min(100, Math.max(0, tierPercentage))}%` }} />
                  </div>
                  <span className="progress-bar-percentage">
                    {tierPercentage}% Complete
                  </span>
                </div>

                <div className="level-tip">
                  💡 <strong>Tip:</strong> Verifying other citizens' reports awards +25 XP. Find unresolved tickets on the map!
                </div>
              </div>
            </div>
          </div>

          {/* List of My Reported Issues */}
          <div className="my-reports-section" style={{ marginTop: '2rem' }}>
            <div className="chart-card wide">
              <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                <h3 className="chart-title">📋 {t("My Reported Issues")}</h3>
              </div>
              {myIssues.length === 0 ? (
                <div className="reports-empty-state">
                  <p>You haven't reported any issues yet.</p>
                </div>
              ) : (
                <div className="my-reports-table">
                  <div className="my-reports-table-header">
                    <span>Title</span>
                    <span>Category</span>
                    <span>Priority</span>
                    <span>Status</span>
                    <span>Votes</span>
                    <span>Reported At</span>
                  </div>
                  {myIssues.map(issue => {
                    const priorityColors = {
                      critical: '#ef4444',
                      high: '#f59e0b',
                      medium: '#3b82f6',
                      low: '#10b981'
                    };
                    const statusColors = {
                      reported: '#f59e0b',
                      verified: '#3b82f6',
                      in_progress: '#8b5cf6',
                      resolved: '#06d6a0'
                    };
                    const statusLabels = {
                      reported: t('Reported'),
                      verified: t('Verified'),
                      in_progress: t('In Progress'),
                      resolved: t('Resolved')
                    };
                    return (
                      <div key={issue.id} className="my-reports-table-row">
                        <span className="issue-title-cell font-semibold" style={{ color: 'var(--text-primary)' }}>{issue.title}</span>
                        <span className="text-sm text-muted">{t(issue.category)}</span>
                        <span className="text-sm font-bold" style={{ color: priorityColors[issue.priority] }}>
                          {t(issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1))}
                        </span>
                        <span>
                          <span className={`status-badge`} style={{
                            background: `${statusColors[issue.status]}18`,
                            color: statusColors[issue.status],
                            border: `1px solid ${statusColors[issue.status]}33`,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {statusLabels[issue.status] || issue.status}
                          </span>
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>▲ {issue.votes}</span>
                        <span className="text-xs text-muted">
                          {new Date(issue.reportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
