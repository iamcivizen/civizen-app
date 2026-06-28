// ===== CATEGORIES =====
export const CATEGORIES = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: '🏗️',
    color: '#f59e0b',
    subcategories: ['Pothole', 'Road Damage', 'Bridge', 'Footpath', 'Signage'],
    keywords: ['pothole', 'road', 'crack', 'bridge', 'pavement', 'sidewalk', 'footpath', 'sign', 'broken road', 'damaged']
  },
  {
    id: 'utilities',
    label: 'Utilities',
    icon: '⚡',
    color: '#3b82f6',
    subcategories: ['Water Leakage', 'Power Outage', 'Gas Leak', 'Internet', 'Water Supply'],
    keywords: ['water', 'leak', 'pipe', 'electric', 'power', 'outage', 'gas', 'internet', 'cable', 'supply', 'electricity']
  },
  {
    id: 'sanitation',
    label: 'Sanitation',
    icon: '🗑️',
    color: '#10b981',
    subcategories: ['Garbage', 'Drainage', 'Sewage', 'Littering', 'Illegal Dumping'],
    keywords: ['garbage', 'trash', 'waste', 'drain', 'sewer', 'litter', 'dump', 'dirty', 'smell', 'overflow', 'compost']
  },
  {
    id: 'public_safety',
    label: 'Public Safety',
    icon: '🚦',
    color: '#ef4444',
    subcategories: ['Streetlight', 'Traffic Signal', 'Abandoned Vehicle', 'Vandalism', 'Unsafe Building'],
    keywords: ['light', 'streetlight', 'dark', 'traffic', 'signal', 'car', 'vehicle', 'vandal', 'graffiti', 'unsafe', 'danger']
  },
  {
    id: 'environment',
    label: 'Environment',
    icon: '🌳',
    color: '#22c55e',
    subcategories: ['Fallen Tree', 'Air Pollution', 'Noise Pollution', 'Water Pollution', 'Park Damage'],
    keywords: ['tree', 'plant', 'air', 'pollution', 'noise', 'smoke', 'park', 'garden', 'environment', 'nature', 'fallen']
  },
  {
    id: 'public_property',
    label: 'Public Property',
    icon: '🏛️',
    color: '#8b5cf6',
    subcategories: ['School Damage', 'Hospital Issue', 'Library', 'Community Centre', 'Government Building'],
    keywords: ['school', 'hospital', 'library', 'community', 'government', 'public', 'building', 'property', 'centre']
  }
];

export const STATUS_CONFIG = {
  reported: { label: 'Reported', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '📋' },
  verified: { label: 'Verified', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '✅' },
  in_progress: { label: 'In Progress', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '🔧' },
  resolved: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '❌' }
};

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#22c55e' },
  medium: { label: 'Medium', color: '#f59e0b' },
  high: { label: 'High', color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' }
};

export const BADGES = [
  { id: 'first_report', name: 'First Reporter', icon: '🌟', desc: 'Reported your first issue', points: 10 },
  { id: 'five_reports', name: 'Active Citizen', icon: '🏅', desc: 'Reported 5 issues', points: 50 },
  { id: 'ten_reports', name: 'Community Watchdog', icon: '🦸', desc: 'Reported 10 issues', points: 100 },
  { id: 'first_resolved', name: 'Problem Solver', icon: '✅', desc: 'Had your first issue resolved', points: 25 },
  { id: 'verified_user', name: 'Verified Hero', icon: '🛡️', desc: 'Verified by community', points: 15 },
  { id: 'top_voter', name: 'Democracy Advocate', icon: '🗳️', desc: 'Cast 20 community votes', points: 30 },
  { id: 'streak_7', name: 'Streak Master', icon: '🔥', desc: '7-day reporting streak', points: 70 },
  { id: 'photo_pro', name: 'Photo Pro', icon: '📸', desc: 'Uploaded 10 photos', points: 20 }
];
