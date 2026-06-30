import { CATEGORIES } from './categories.js';

// Bangalore area coordinates for mock data
const BANGALORE_CENTER = [12.9716, 77.5946];

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomBangaloreCoord() {
  return [
    randomInRange(12.85, 13.08),
    randomInRange(77.48, 77.72)
  ];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_USERS = [
  { id: 'u1', name: 'Priya Sharma', avatar: '👩', points: 1250, level: 8, issuesReported: 23, issuesVerified: 15, badges: ['first_report','five_reports','ten_reports','first_resolved','top_voter'], rank: 1 },
  { id: 'u2', name: 'Rahul Verma', avatar: '👨', points: 980, level: 6, issuesReported: 18, issuesVerified: 10, badges: ['first_report','five_reports','photo_pro'], rank: 2 },
  { id: 'u3', name: 'Anita Nair', avatar: '🧑', points: 760, level: 5, issuesReported: 14, issuesVerified: 8, badges: ['first_report','verified_user','first_resolved'], rank: 3 },
  { id: 'u4', name: 'Vikram Patel', avatar: '👦', points: 640, level: 4, issuesReported: 11, issuesVerified: 5, badges: ['first_report','five_reports'], rank: 4 },
  { id: 'u5', name: 'Meena Krishnan', avatar: '👧', points: 520, level: 3, issuesReported: 9, issuesVerified: 4, badges: ['first_report','top_voter'], rank: 5 },
  { id: 'u6', name: 'Arjun Singh', avatar: '🧔', points: 410, level: 3, issuesReported: 7, issuesVerified: 3, badges: ['first_report'], rank: 6 },
  { id: 'u7', name: 'Sunita Reddy', avatar: '👱', points: 310, level: 2, issuesReported: 5, issuesVerified: 2, badges: ['first_report'], rank: 7 },
  { id: 'u8', name: 'Karan Mehta', avatar: '🧑‍🦱', points: 205, level: 2, issuesReported: 4, issuesVerified: 1, badges: ['first_report'], rank: 8 },
];

export const CURRENT_USER = {
  id: 'cu1', name: 'You (Hero)', avatar: '🦸', points: 580, level: 4,
  issuesReported: 6, issuesVerified: 3,
  badges: ['first_report', 'five_reports', 'verified_user'],
  rank: 5, streak: 3, totalVotes: 12,
  age: 28,
  phone: '9876543210',
  address: 'Flat 402, Shanti Niketan Apartments, 5th Main Road, Koramangala',
  gender: 'Male',
  occupation: 'Salaried Professional',
  ward: 'Ward 150 - Bellandur',
  aadhaar: '123456789012',
  leaderboardConsent: true,
  leaderboardConsentDate: 'Jun 28, 2026'
};

export const MOCK_ISSUES = [
  {
    id: 'iss001',
    title: 'Large pothole causing accidents near MG Road',
    description: 'A massive pothole has developed at the junction of MG Road and Brigade Road. Multiple two-wheelers have been affected. The pothole is approximately 2 feet wide and 6 inches deep. It is particularly dangerous at night as there is no warning sign.',
    category: 'infrastructure',
    subcategory: 'Pothole',
    status: 'in_progress',
    priority: 'high',
    location: 'MG Road, Bangalore',
    coordinates: [12.9756, 77.6040],
    images: [],
    reportedBy: 'u1',
    reportedAt: daysAgo(5),
    updatedAt: daysAgo(2),
    votes: 47,
    comments: [
      { id: 'c1', user: 'u2', text: 'I almost fell here yesterday morning!', time: daysAgo(4) },
      { id: 'c2', user: 'u3', text: 'The BBMP team has been informed, they said they will fix it this week.', time: daysAgo(3) },
    ],
    aiConfidence: 0.94,
    tags: ['pothole', 'road', 'accident-prone', 'urgent'],
    ward: 'Shivajinagar Ward',
    department: 'BBMP Roads',
    timeline: [
      { status: 'reported', time: daysAgo(5), note: 'Issue reported by community member' },
      { status: 'verified', time: daysAgo(4), note: 'Verified by 12 community members' },
      { status: 'in_progress', time: daysAgo(2), note: 'BBMP Roads department assigned' },
    ]
  },
  {
    id: 'iss002',
    title: 'Broken streetlight on Indiranagar 100 Feet Road',
    description: 'Streetlight at the intersection near CMH Road has been non-functional for 3 weeks. The area becomes completely dark after 8 PM creating safety hazards for pedestrians and cyclists.',
    category: 'public_safety',
    subcategory: 'Streetlight',
    status: 'verified',
    priority: 'medium',
    location: 'Indiranagar 100 Feet Road, Bangalore',
    coordinates: [12.9783, 77.6408],
    images: [],
    reportedBy: 'cu1',
    reportedAt: daysAgo(8),
    updatedAt: daysAgo(6),
    votes: 32,
    comments: [
      { id: 'c3', user: 'u4', text: 'Yes confirmed, been walking carefully here for weeks', time: daysAgo(7) },
    ],
    aiConfidence: 0.91,
    tags: ['streetlight', 'dark', 'safety', 'pedestrian'],
    ward: 'Indiranagar Ward',
    department: 'BESCOM',
    timeline: [
      { status: 'reported', time: daysAgo(8), note: 'Issue reported' },
      { status: 'verified', time: daysAgo(6), note: 'Verified by 8 community members' },
    ]
  },
  {
    id: 'iss003',
    title: 'Water pipe leakage flooding Koramangala Street',
    description: 'A major water pipe has burst near the Koramangala 7th Block. Water is flowing continuously on the road causing waterlogging, traffic disruption, and wastage of thousands of liters daily.',
    category: 'utilities',
    subcategory: 'Water Leakage',
    status: 'reported',
    priority: 'critical',
    location: 'Koramangala 7th Block, Bangalore',
    coordinates: [12.9352, 77.6245],
    images: [],
    reportedBy: 'u3',
    reportedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    votes: 89,
    comments: [],
    aiConfidence: 0.97,
    tags: ['water', 'pipe', 'leakage', 'critical', 'flooding'],
    ward: 'Koramangala Ward',
    department: 'BWSSB',
    timeline: [
      { status: 'reported', time: daysAgo(1), note: 'Issue reported - CRITICAL' },
    ]
  },
  {
    id: 'iss004',
    title: 'Garbage dump not cleared for 10 days - Jayanagar',
    description: 'The garbage collection point near Jayanagar 4th Block main market has not been cleared in 10 days. It is overflowing onto the street and causing severe odor and hygiene issues. Stray animals are scattering waste.',
    category: 'sanitation',
    subcategory: 'Garbage',
    status: 'resolved',
    priority: 'high',
    location: 'Jayanagar 4th Block, Bangalore',
    coordinates: [12.9308, 77.5832],
    images: [],
    reportedBy: 'cu1',
    reportedAt: daysAgo(12),
    updatedAt: daysAgo(2),
    votes: 28,
    comments: [
      { id: 'c4', user: 'u5', text: 'Finally cleared! Thanks to everyone who reported.', time: daysAgo(2) },
    ],
    aiConfidence: 0.88,
    tags: ['garbage', 'sanitation', 'hygiene', 'overflowing'],
    ward: 'Jayanagar Ward',
    department: 'BBMP Sanitation',
    resolvedAt: daysAgo(2),
    timeline: [
      { status: 'reported', time: daysAgo(12), note: 'Issue reported' },
      { status: 'verified', time: daysAgo(11), note: 'Verified by 6 members' },
      { status: 'in_progress', time: daysAgo(5), note: 'BBMP Sanitation assigned' },
      { status: 'resolved', time: daysAgo(2), note: 'Garbage cleared and area cleaned' },
    ]
  },
  {
    id: 'iss005',
    title: 'Fallen tree blocking road in Rajajinagar',
    description: 'A large tree fell during last night\'s storm and is blocking the main road in Rajajinagar 2nd Block. Emergency vehicles cannot pass. Immediate removal required.',
    category: 'environment',
    subcategory: 'Fallen Tree',
    status: 'resolved',
    priority: 'critical',
    location: 'Rajajinagar 2nd Block, Bangalore',
    coordinates: [12.9891, 77.5540],
    images: [],
    reportedBy: 'u5',
    reportedAt: daysAgo(3),
    updatedAt: daysAgo(3),
    votes: 63,
    comments: [],
    aiConfidence: 0.96,
    tags: ['tree', 'fallen', 'road-block', 'storm', 'emergency'],
    ward: 'Rajajinagar Ward',
    department: 'Forest Department',
    resolvedAt: daysAgo(3),
    timeline: [
      { status: 'reported', time: daysAgo(3), note: 'Emergency report filed' },
      { status: 'verified', time: daysAgo(3), note: 'Immediately verified' },
      { status: 'in_progress', time: daysAgo(3), note: 'Emergency crew dispatched' },
      { status: 'resolved', time: daysAgo(3), note: 'Tree removed within 4 hours' },
    ]
  },
  {
    id: 'iss006',
    title: 'Drainage overflow near HSR Layout market',
    description: 'The drainage channel near HSR Layout Sector 2 market is completely blocked with debris and plastic. During rains, sewage overflows onto the pedestrian path creating health hazards.',
    category: 'sanitation',
    subcategory: 'Drainage',
    status: 'in_progress',
    priority: 'high',
    location: 'HSR Layout Sector 2, Bangalore',
    coordinates: [12.9116, 77.6473],
    images: [],
    reportedBy: 'u6',
    reportedAt: daysAgo(7),
    updatedAt: daysAgo(3),
    votes: 41,
    comments: [
      { id: 'c5', user: 'u7', text: 'Happens every rainy season here.', time: daysAgo(6) },
    ],
    aiConfidence: 0.90,
    tags: ['drainage', 'overflow', 'sewage', 'health-hazard'],
    ward: 'HSR Layout Ward',
    department: 'BBMP Drainage',
    timeline: [
      { status: 'reported', time: daysAgo(7), note: 'Issue reported' },
      { status: 'verified', time: daysAgo(6), note: 'Verified by community' },
      { status: 'in_progress', time: daysAgo(3), note: 'Desilting crew assigned' },
    ]
  },
  {
    id: 'iss007',
    title: 'Power outage affecting Whitefield IT corridor',
    description: 'Frequent power cuts in Whitefield EPIP Zone affecting both residents and IT companies. Load shedding is happening 3-4 times daily for 2-3 hours each. BESCOM helpline not responding.',
    category: 'utilities',
    subcategory: 'Power Outage',
    status: 'verified',
    priority: 'high',
    location: 'Whitefield EPIP Zone, Bangalore',
    coordinates: [12.9698, 77.7500],
    images: [],
    reportedBy: 'u7',
    reportedAt: daysAgo(4),
    updatedAt: daysAgo(2),
    votes: 156,
    comments: [
      { id: 'c6', user: 'u8', text: 'This has been going on for 2 weeks!', time: daysAgo(3) },
      { id: 'c7', user: 'u1', text: 'Escalated to MLA office. Awaiting response.', time: daysAgo(2) },
    ],
    aiConfidence: 0.93,
    tags: ['power', 'outage', 'BESCOM', 'frequent', 'IT-corridor'],
    ward: 'Whitefield Ward',
    department: 'BESCOM',
    timeline: [
      { status: 'reported', time: daysAgo(4), note: 'Issue reported' },
      { status: 'verified', time: daysAgo(2), note: 'Verified by 34 community members' },
    ]
  },
  {
    id: 'iss008',
    title: 'School building wall cracked - Safety concern',
    description: 'The boundary wall of Government Primary School in Malleswaram has developed major cracks after recent heavy rains. Children are at risk. The wall could collapse. Urgent structural inspection needed.',
    category: 'public_property',
    subcategory: 'School Damage',
    status: 'in_progress',
    priority: 'critical',
    location: 'Malleswaram, Bangalore',
    coordinates: [13.0035, 77.5672],
    images: [],
    reportedBy: 'u8',
    reportedAt: daysAgo(2),
    updatedAt: daysAgo(1),
    votes: 72,
    comments: [],
    aiConfidence: 0.89,
    tags: ['school', 'wall', 'crack', 'safety', 'children', 'urgent'],
    ward: 'Malleswaram Ward',
    department: 'Education Department',
    timeline: [
      { status: 'reported', time: daysAgo(2), note: 'Emergency issue reported' },
      { status: 'verified', time: daysAgo(2), note: 'Immediately verified' },
      { status: 'in_progress', time: daysAgo(1), note: 'Structural engineer inspection scheduled' },
    ]
  }
];

export const MONTHLY_STATS = [
  { month: 'Jan', reported: 45, resolved: 32, inProgress: 8 },
  { month: 'Feb', reported: 52, resolved: 41, inProgress: 7 },
  { month: 'Mar', reported: 61, resolved: 48, inProgress: 9 },
  { month: 'Apr', reported: 48, resolved: 35, inProgress: 11 },
  { month: 'May', reported: 78, resolved: 60, inProgress: 14 },
  { month: 'Jun', reported: 94, resolved: 71, inProgress: 19 },
];

export const CATEGORY_STATS = [
  { name: 'Infrastructure', value: 31, color: '#f59e0b' },
  { name: 'Utilities', value: 24, color: '#3b82f6' },
  { name: 'Sanitation', value: 19, color: '#10b981' },
  { name: 'Public Safety', value: 14, color: '#ef4444' },
  { name: 'Environment', value: 8, color: '#22c55e' },
  { name: 'Public Property', value: 4, color: '#8b5cf6' },
];

export const RESPONSE_TIME_DATA = [
  { category: 'Infrastructure', avg: 4.2, unit: 'days' },
  { category: 'Utilities', avg: 2.1, unit: 'days' },
  { category: 'Sanitation', avg: 3.5, unit: 'days' },
  { category: 'Public Safety', avg: 1.8, unit: 'days' },
  { category: 'Environment', avg: 5.0, unit: 'days' },
  { category: 'Public Property', avg: 6.3, unit: 'days' },
];

export const WARD_STATS = [
  { ward: 'Koramangala', issues: 34, resolved: 28, score: 82, officialName: 'Kiran Kumar', officialPhoto: '👨‍💼', officialRating: 4.7, email: 'kiran.kumar@bbmp.gov.in', phone: '+91-98450-12345' },
  { ward: 'Indiranagar', issues: 28, resolved: 24, score: 86, officialName: 'Meera Deshmukh', officialPhoto: '👩‍💼', officialRating: 4.2, email: 'meera.d@bbmp.gov.in', phone: '+91-98450-67890' },
  { ward: 'HSR Layout', issues: 22, resolved: 16, score: 73, officialName: 'Sanjay Deshpande', officialPhoto: '👨‍💼', officialRating: 3.6, email: 'sanjay.d@bbmp.gov.in', phone: '+91-98450-11223' },
  { ward: 'Whitefield', issues: 45, resolved: 31, score: 69, officialName: 'Ramesh Gowda', officialPhoto: '👨‍💼', officialRating: 3.2, email: 'ramesh.g@bbmp.gov.in', phone: '+91-98450-44556' },
  { ward: 'Jayanagar', issues: 18, resolved: 16, score: 89, officialName: 'Anitha Rao', officialPhoto: '👩‍💼', officialRating: 4.8, email: 'anitha.rao@bbmp.gov.in', phone: '+91-98450-77889' },
  { ward: 'Malleswaram', issues: 15, resolved: 12, score: 80, officialName: 'Vikram Hegde', officialPhoto: '👨‍💼', officialRating: 4.5, email: 'vikram.h@bbmp.gov.in', phone: '+91-98450-99001' },
];

export const PREDICTIVE_ALERTS = [
  { id: 'pa1', type: 'warning', title: 'Monsoon Drainage Risk', desc: 'Historical data suggests Koramangala and HSR Layout will face drainage overflow next week with 85% probability', icon: '🌧️', urgency: 'high' },
  { id: 'pa2', type: 'info', title: 'Infrastructure Hotspot', desc: 'MG Road corridor shows 3x higher pothole density than city average. Preventive maintenance recommended', icon: '🔮', urgency: 'medium' },
  { id: 'pa3', type: 'warning', title: 'Power Load Spike', desc: 'Summer heat expected to cause power demand spike in Whitefield zone. BESCOM pre-alert issued', icon: '⚡', urgency: 'medium' },
  { id: 'pa4', type: 'success', title: 'Resolution Trend Up', desc: 'Issue resolution rate improved 23% this month due to community participation surge', icon: '📈', urgency: 'low' },
];
