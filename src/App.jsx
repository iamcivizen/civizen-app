import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import IssueMap from './pages/IssueMap.jsx';
import IssueTracker from './pages/IssueTracker.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import WardOfficials from './pages/WardOfficials.jsx';
import RedeemSubsidies from './pages/RedeemSubsidies.jsx';
import DpdpaBanner from './components/DpdpaBanner.jsx';
import ZenithChatbot from './components/ZenithChatbot.jsx';
import BottomNav from './components/BottomNav.jsx';

function AppContent() {
  const { state } = useApp();
  const { isLoggedIn } = state;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn ? (
            <>
              <Route path="/report" element={<ReportIssue />} />
              <Route path="/map" element={<IssueMap />} />
              <Route path="/tracker" element={<IssueTracker />} />
              <Route path="/issue/:id" element={<IssueDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/subsidies" element={<RedeemSubsidies />} />
              <Route path="/officials" element={<WardOfficials />} />
            </>
          ) : null}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DpdpaBanner />
        <ZenithChatbot />
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
