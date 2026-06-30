import { createContext, useContext, useReducer, useEffect } from 'react';
import { MOCK_ISSUES, CURRENT_USER, MOCK_USERS } from '../data/mockData.js';
import { BADGES } from '../data/categories.js';

const AppContext = createContext(null);

const initialState = {
  issues: MOCK_ISSUES,
  currentUser: CURRENT_USER,
  users: MOCK_USERS,
  userVotes: new Set(),
  notifications: [],
  activeFilter: 'all',
  searchQuery: '',
  loading: false,
  language: 'en',
  theme: 'dark',
  isLoggedIn: false,
  showLoginModal: false,
  demoMode: false,
  sidebarOpen: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_ISSUE': {
      const newIssue = { 
        ...action.payload, 
        id: `iss${Date.now()}`,
        verificationCount: 0,
        verifiedBy: []
      };
      const updatedUser = {
        ...state.currentUser,
        issuesReported: state.currentUser.issuesReported + 1
      };
      // Award badge
      let badges = [...updatedUser.badges];
      if (updatedUser.issuesReported === 1 && !badges.includes('first_report')) {
        badges.push('first_report');
      }
      if (updatedUser.issuesReported >= 5 && !badges.includes('five_reports')) {
        badges.push('five_reports');
      }
      if (updatedUser.issuesReported >= 10 && !badges.includes('ten_reports')) {
        badges.push('ten_reports');
      }
      return {
        ...state,
        issues: [newIssue, ...state.issues],
        currentUser: { ...updatedUser, badges },
        notifications: [
          { id: Date.now(), type: 'success', message: '🎉 Issue reported! Points (+100 XP) will be awarded once verified by the community.', time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'VERIFY_ISSUE': {
      const { id, userId } = action.payload;
      const issue = state.issues.find(i => i.id === id);
      if (!issue) return state;
      
      const verifiedBy = issue.verifiedBy || [];
      if (verifiedBy.includes(userId)) return state;
      
      const newVerifiedBy = [...verifiedBy, userId];
      const newCount = (issue.verificationCount || 0) + 1;
      
      let newStatus = issue.status;
      let newTimeline = issue.timeline || [];
      let reporterPointsEarned = 0;
      
      // Transition status to verified if 3 citizens back the report
      if (newCount >= 3 && issue.status === 'reported') {
        newStatus = 'verified';
        newTimeline = [
          ...newTimeline,
          { status: 'verified', time: new Date().toISOString(), note: 'Verified by 3 community members' }
        ];
        reporterPointsEarned = 100;
      }
      
      const updatedIssues = state.issues.map(i =>
        i.id === id
          ? {
              ...i,
              status: newStatus,
              verificationCount: newCount,
              verifiedBy: newVerifiedBy,
              timeline: newTimeline,
              updatedAt: new Date().toISOString()
            }
          : i
      );
      
      let updatedCurrentUser = { ...state.currentUser };
      let updatedUsers = [...state.users];
      
      // Award +25 points to the verifier
      if (userId === 'cu1') {
        updatedCurrentUser.points = (updatedCurrentUser.points || 0) + 25;
        updatedCurrentUser.issuesVerified = (updatedCurrentUser.issuesVerified || 0) + 1;
        
        // Award badge for active citizen validator
        if (updatedCurrentUser.issuesVerified >= 3 && !updatedCurrentUser.badges.includes('verified_user')) {
          updatedCurrentUser.badges = [...updatedCurrentUser.badges, 'verified_user'];
        }
      }
      
      // Award +100 points to the original reporter upon successful verification transition
      if (reporterPointsEarned > 0) {
        if (issue.reportedBy === 'cu1') {
          updatedCurrentUser.points = (updatedCurrentUser.points || 0) + 100;
        } else {
          updatedUsers = updatedUsers.map(u =>
            u.id === issue.reportedBy
              ? { ...u, points: (u.points || 0) + 100 }
              : u
          );
        }
      }
      
      let successMsg = `Verified issue! +25 Points Earned.`;
      if (newStatus === 'verified' && issue.status === 'reported') {
        successMsg = `Issue verified! Reporter gets +100 points, you earned +25 points.`;
      }
      
      return {
        ...state,
        issues: updatedIssues,
        currentUser: updatedCurrentUser,
        users: updatedUsers,
        notifications: [
          { id: Date.now(), type: 'success', message: successMsg, time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'REDEEM_POINTS': {
      const { cost, rewardLabel, details } = action.payload;
      if (state.currentUser.points < cost) return state;
      
      const newVouchers = state.currentUser.vouchers || [];
      const code = `CH-${rewardLabel.replace(/\s+/g, '').slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const updatedUser = {
        ...state.currentUser,
        points: state.currentUser.points - cost,
        vouchers: [...newVouchers, { code, rewardLabel, cost, redeemedAt: new Date().toISOString(), ...(details || {}) }]
      };
      
      return {
        ...state,
        currentUser: updatedUser,
        notifications: [
          { id: Date.now(), type: 'success', message: `🎟️ Redeemed: ${rewardLabel}! Code: ${code}`, time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'UPVOTE_ISSUE': {
      const issueId = action.payload;
      const hasVoted = state.userVotes.has(issueId);
      const newVotes = new Set(state.userVotes);
      
      if (hasVoted) {
        newVotes.delete(issueId);
        return {
          ...state,
          issues: state.issues.map(i =>
            i.id === issueId ? { ...i, votes: Math.max(0, i.votes - 1) } : i
          ),
          userVotes: newVotes,
          currentUser: { 
            ...state.currentUser, 
            points: Math.max(0, state.currentUser.points - 5), 
            totalVotes: Math.max(0, (state.currentUser.totalVotes || 0) - 1) 
          }
        };
      } else {
        newVotes.add(issueId);
        return {
          ...state,
          issues: state.issues.map(i =>
            i.id === issueId ? { ...i, votes: i.votes + 1 } : i
          ),
          userVotes: newVotes,
          currentUser: { 
            ...state.currentUser, 
            points: state.currentUser.points + 5, 
            totalVotes: (state.currentUser.totalVotes || 0) + 1 
          }
        };
      }
    }

    case 'ADD_COMMENT': {
      return {
        ...state,
        issues: state.issues.map(i =>
          i.id === action.payload.issueId
            ? { ...i, comments: [...i.comments, action.payload.comment] }
            : i
        )
      };
    }

    case 'EDIT_COMMENT': {
      const { issueId, commentId, text } = action.payload;
      return {
        ...state,
        issues: state.issues.map(i =>
          i.id === issueId
            ? {
                ...i,
                comments: i.comments.map(c =>
                  c.id === commentId
                    ? { ...c, text, editedAt: new Date().toISOString() }
                    : c
                )
              }
            : i
        )
      };
    }

    case 'UPDATE_ISSUE_STATUS': {
      const isResolved = action.payload.status === 'resolved';
      const notificationMsg = isResolved
        ? `🤖 AI Audit Approved: Geotag matches. Computer vision confirms issue resolved! +150 XP awarded.`
        : `📋 Issue status updated to ${action.payload.status}`;
      return {
        ...state,
        issues: state.issues.map(i =>
          i.id === action.payload.id
            ? {
                ...i,
                status: action.payload.status,
                updatedAt: new Date().toISOString(),
                resolvedAt: isResolved ? new Date().toISOString() : i.resolvedAt,
                timeline: [...i.timeline, {
                  status: action.payload.status,
                  time: new Date().toISOString(),
                  note: action.payload.note || (isResolved ? 'Resolved by creator & verified by AI Audit' : 'Status updated')
                }]
              }
            : i
        ),
        currentUser: isResolved
          ? { ...state.currentUser, points: state.currentUser.points + 150 }
          : state.currentUser,
        notifications: [
          { id: Date.now(), type: 'success', message: notificationMsg, time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'SET_AADHAAR': {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          aadhaar: action.payload
        },
        notifications: [
          { id: Date.now(), type: 'success', message: '🔒 Aadhaar linked successfully. Account verified!', time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'GRANT_LEADERBOARD_CONSENT': {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          leaderboardConsent: true,
          leaderboardConsentDate: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        },
        notifications: [
          {
            id: Date.now(),
            type: 'success',
            message: '🏆 Welcome to the arena! Your civic profile is live—let\'s inspire others and lead the change in your community! 🚀',
            time: new Date().toISOString()
          },
          ...state.notifications
        ]
      };
    }

    case 'LINK_UTILITY_ACCOUNTS': {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          linkedAccounts: action.payload
        },
        notifications: [
          { id: Date.now(), type: 'success', message: '🔌 Utility accounts linked successfully via BBPS!', time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'UNLINK_UTILITY_ACCOUNTS': {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          linkedAccounts: null
        },
        notifications: [
          { id: Date.now(), type: 'info', message: '🔌 Utility accounts unlinked.', time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };

    case 'SET_LOGIN_MODAL':
      return {
        ...state,
        showLoginModal: action.payload
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };

    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload
      };

    case 'LOGOUT_USER':
      return {
        ...state,
        isLoggedIn: false,
        notifications: [
          { id: Date.now(), type: 'info', message: '👋 Logged out successfully. Navigation limited to Homepage.', time: new Date().toISOString() },
          ...state.notifications
        ]
      };

    case 'LOGIN_USER': {
      const { name, age, area, aadhaar, phone, gender, occupation, address } = action.payload;
      const updatedUser = {
        ...state.currentUser,
        name,
        age: Number(age),
        ward: area,
        aadhaar,
        phone,
        gender: gender || 'Male',
        occupation: occupation || 'Salaried Professional',
        address: address || '',
        leaderboardConsent: true,
        leaderboardConsentDate: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      };
      return {
        ...state,
        isLoggedIn: true,
        showLoginModal: false,
        currentUser: updatedUser,
        notifications: [
          { id: Date.now(), type: 'success', message: `🔓 Welcome back, ${name}! Logged in successfully.`, time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    case 'UPDATE_PROFILE': {
      const updatedUser = {
        ...state.currentUser,
        ...action.payload
      };
      return {
        ...state,
        currentUser: updatedUser,
        notifications: [
          { id: Date.now(), type: 'success', message: '👤 Profile settings updated successfully.', time: new Date().toISOString() },
          ...state.notifications
        ]
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
