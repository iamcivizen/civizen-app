import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { CATEGORIES, STATUS_CONFIG } from '../data/categories.js';
import UniversalMap from '../components/UniversalMap.jsx';
import './IssueMap.css';

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

export default function IssueMap() {
  const { state } = useApp();
  const { issues } = state;
  const t = useTranslation();

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapStyle, setMapStyle] = useState(state.theme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    setMapStyle(state.theme === 'light' ? 'light' : 'dark');
  }, [state.theme]);

  const filteredIssues = issues.filter(i => {
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const statsForMap = {
    total: filteredIssues.length,
    critical: filteredIssues.filter(i => i.priority === 'critical').length,
    resolved: filteredIssues.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="map-page">
      {/* Controls Panel */}
      <div className="map-controls">
        <div className="map-controls-header">
          <h2 className="font-semibold">🗺️ Issue Map</h2>
          <div className="map-mini-stats">
            <span className="mini-stat">{statsForMap.total} shown</span>
            <span className="mini-stat critical">🚨 {statsForMap.critical} critical</span>
            <span className="mini-stat resolved">✅ {statsForMap.resolved} resolved</span>
          </div>
        </div>

        {/* Filters */}
        <div className="map-filters">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              id="map-cat-filter"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">{t("All Categories")}</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {t(c.label)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t("Status")}</label>
            <select
              id="map-status-filter"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">{t("All Statuses")}</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.icon} {t(val.label)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Map Style</label>
            <select
              id="map-style-selector"
              value={mapStyle}
              onChange={e => setMapStyle(e.target.value)}
              className="input-field"
            >
              <option value="dark">🌙 Dark</option>
              <option value="light">☀️ Light</option>
              <option value="satellite">🛰️ Satellite</option>
            </select>
          </div>
        </div>

        {/* Toggle heatmap */}
        <div className="map-toggle">
          <label className="toggle-wrap">
            <input
              type="checkbox"
              id="heatmap-toggle"
              checked={showHeatmap}
              onChange={() => setShowHeatmap(!showHeatmap)}
            />
            <span className="toggle-slider"></span>
            <span className="text-sm">Show Heat Zones</span>
          </label>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>Priority Legend</div>
          {Object.entries(PRIORITY_COLORS).map(([p, color]) => (
            <div key={p} className="legend-item">
              <div className="legend-dot" style={{ background: color }} />
              <span className="text-xs text-muted capitalize">{p}</span>
            </div>
          ))}
        </div>

        {/* Issue list panel */}
        <div className="map-issue-list">
          <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>Issues on Map</div>
          {filteredIssues.map(issue => {
            const cat = CATEGORIES.find(c => c.id === issue.category);
            return (
              <div
                key={issue.id}
                className={`map-issue-item ${selectedIssue?.id === issue.id ? 'active' : ''}`}
                onClick={() => setSelectedIssue(issue)}
              >
                <span style={{ fontSize: '1rem' }}>{cat?.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{issue.title}</div>
                  <div className="text-xs text-muted truncate">{issue.location.split(',')[0]}</div>
                </div>
                <div className="priority-dot" style={{ background: PRIORITY_COLORS[issue.priority] }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="map-view">
        <UniversalMap
          center={[12.9716, 77.5946]}
          zoom={12}
          issues={filteredIssues}
          onMarkerClick={(issue) => setSelectedIssue(issue)}
          mapStyle={mapStyle}
          showHeatmap={showHeatmap}
        />
      </div>

      {/* Selected Issue Detail Panel */}
      {selectedIssue && (
        <div className="map-detail-panel">
          <button
            className="detail-close"
            onClick={() => setSelectedIssue(null)}
          >✕</button>
          <div className="detail-cat">
            {CATEGORIES.find(c => c.id === selectedIssue.category)?.icon}
            {t(selectedIssue.subcategory)}
          </div>
          <h3 className="detail-title">{selectedIssue.title}</h3>
          <div className="detail-info">
            <span className={`badge badge-${selectedIssue.status}`}>{t(STATUS_CONFIG[selectedIssue.status]?.label)}</span>
            <span style={{ color: PRIORITY_COLORS[selectedIssue.priority], fontSize: '0.8rem', fontWeight: 700 }}>
              {t(selectedIssue.priority).toUpperCase()}
            </span>
          </div>
          <p className="detail-desc text-sm text-muted">{selectedIssue.description.slice(0, 150)}...</p>
          <div className="detail-actions">
            <div className="detail-votes">▲ {selectedIssue.votes} upvotes</div>
            <Link to={`/issue/${selectedIssue.id}`} className="btn btn-primary btn-sm">Full Details</Link>
          </div>
        </div>
      )}
    </div>
  );
}
