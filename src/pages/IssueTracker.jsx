import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import IssueCard from '../components/IssueCard.jsx';
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '../data/categories.js';
import './IssueTracker.css';

const SORT_OPTIONS = [
  { value: 'newest', label: '🕐 Newest First' },
  { value: 'oldest', label: '📅 Oldest First' },
  { value: 'votes', label: '▲ Most Votes' },
  { value: 'priority', label: '🚨 Highest Priority' },
];

const PRIORITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };

export default function IssueTracker() {
  const { state, dispatch } = useApp();
  const { issues, searchQuery } = state;
  const [searchParams] = useSearchParams();
  const t = useTranslation();

  const [trackerScope, setTrackerScope] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('cat') || 'all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const scopeIssues = useMemo(() => {
    if (trackerScope === 'my_issues') {
      return issues.filter(i => i.reportedBy === state.currentUser?.id);
    }
    return issues;
  }, [issues, trackerScope, state.currentUser]);

  const filteredAndSorted = useMemo(() => {
    let result = [...scopeIssues];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.tags?.some(t => t.includes(q))
      );
    }

    // Filters
    if (filterStatus !== 'all') result = result.filter(i => i.status === filterStatus);
    if (filterCategory !== 'all') result = result.filter(i => i.category === filterCategory);
    if (filterPriority !== 'all') result = result.filter(i => i.priority === filterPriority);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.reportedAt) - new Date(a.reportedAt);
        case 'oldest': return new Date(a.reportedAt) - new Date(b.reportedAt);
        case 'votes': return b.votes - a.votes;
        case 'priority': return (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        default: return 0;
      }
    });

    return result;
  }, [scopeIssues, searchQuery, filterStatus, filterCategory, filterPriority, sortBy]);

  const statusCounts = useMemo(() => {
    const counts = { all: scopeIssues.length };
    Object.keys(STATUS_CONFIG).forEach(s => {
      counts[s] = scopeIssues.filter(i => i.status === s).length;
    });
    return counts;
  }, [scopeIssues]);

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterPriority('all');
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  const hasActiveFilters = filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all' || searchQuery;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t("Issue Tracker")}</h1>
        <p className="page-subtitle">{t("Real-time tracking of all community issues · {issues.length} total reports / dೂರುಗಳ ಪ್ರಗತಿ").replace('{issues.length}', issues.length)}</p>
      </div>

      {/* Scope Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        borderBottom: '1px solid var(--border-primary)',
        marginBottom: '1.5rem',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => {
            setTrackerScope('all');
            setFilterStatus('all');
          }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: trackerScope === 'all' ? '3px solid var(--accent-purple)' : '3px solid transparent',
            color: trackerScope === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.95rem',
            paddingBottom: '0.65rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>🌐</span> {t("City Feed")}
        </button>
        <button
          onClick={() => {
            setTrackerScope('my_issues');
            setFilterStatus('all');
          }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: trackerScope === 'my_issues' ? '3px solid var(--accent-purple)' : '3px solid transparent',
            color: trackerScope === 'my_issues' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.95rem',
            paddingBottom: '0.65rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          id="tab-my-issues"
        >
          <span>🦸</span> {t("My Reported Issues")}
        </button>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button
          id="tab-all"
          className={`status-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          {t("All")} <span className="tab-count">{statusCounts.all}</span>
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
          <button
            key={key}
            id={`tab-${key}`}
            className={`status-tab ${filterStatus === key ? 'active' : ''}`}
            onClick={() => setFilterStatus(key)}
            style={filterStatus === key ? { color: val.color, borderColor: val.color, background: val.bg } : {}}
          >
            {val.icon} {t(val.label)}
            <span className="tab-count">{statusCounts[key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="tracker-filters">
        <div className="filters-left">
          <select
            id="filter-category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="input-field filter-select"
          >
            <option value="all">📂 {t("All Categories / ಎಲ್ಲಾ ವಿಭಾಗಗಳು")}</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {t(c.label)}</option>
            ))}
          </select>

          <select
            id="filter-priority"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="input-field filter-select"
          >
            <option value="all">⚠️ {t("All Priorities / ಎಲ್ಲಾ ಆದ್ಯತೆಗಳು")}</option>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{t(v.label)}</option>
            ))}
          </select>

          <select
            id="sort-by"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field filter-select"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{t(o.label)}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              id="clear-filters-btn"
              className="btn btn-secondary btn-sm"
              onClick={clearFilters}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        <div className="filters-right">
          <span className="results-count">{filteredAndSorted.length} results</span>

          <div className="view-toggle">
            <button
              id="view-grid"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >⊞</button>
            <button
              id="view-list"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >≡</button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No issues found</h3>
          <p className="text-muted">Try adjusting your filters or search query</p>
          <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: '1rem' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={`issues-${viewMode}`}>
          {filteredAndSorted.map(issue => (
            <IssueCard key={issue.id} issue={issue} compact={viewMode === 'list'} />
          ))}
        </div>
      )}
    </div>
  );
}
