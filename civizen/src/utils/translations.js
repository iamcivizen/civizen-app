import { useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const KANNADA_TRANSLATIONS = {
  // Sidebar & Navbar navigation
  "Home": "ಮುಖಪುಟ",
  "Report Issue": "ದೂರು ಸಲ್ಲಿಸಿ",
  "Issue Map": "ನಕ್ಷೆ",
  "Issue Tracker": "ದೂರುಗಳು",
  "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌",
  "Impact Dashboard": "ಪರಿಣಾಮದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌",
  "Leaderboard": "ಸಾಧಕರು",
  "Ward Officials": "ಅಧಿಕಾರಿಗಳು",
  "Redeem Subsidies": "ಸಬ್ಸಿಡಿ ವಿನಿಮಯ",
  "Login / Sign Up": "ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್",
  "Log Out": "ಲಾಗ್ ಔಟ್",
  "Welcome, Guest": "ಸ್ವಾಗತ, ಅತಿಥಿ",
  "Log in to start contributing": "ವರದಿ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ",
  "Level Citizen": "ನಾಗರಿಕರು",
  "XP Progress": "ಎಕ್ಸ್‌ಪಿ ಪ್ರಗತಿ",
  "Navigation": "ಸಂಚರಣೆ",
  "Resolved": "ಪರಿಹರಿಸಲಾಗಿದೆ",
  "Open": "ಸಕ್ರಿಯ",
  "Badges": "ಪದಕಗಳು",
  
  // Home page text
  "Live Community Platform": "ಸಮುದಾಯ ವೇದಿಕೆ",
  "Be the Change": "ನಿಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಬದಲಾವಣೆಯಾಗಿ",
  "Your Community Needs": "ಬದಲಾವಣೆಯಾಗಿ",
  "Report, verify, and resolve local issues with the power of AI and community collaboration. Every report matters.": "ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳನ್ನು ಎಐ ಮತ್ತು ನಾಗರಿಕರ ಸಹಯೋಗದಿಂದ ವರದಿ ಮಾಡಿ ಮತ್ತು ಪರಿಹರಿಸಿ.",
  "View Map": "ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ",
  "Total Issues Reported": "ಒಟ್ಟು ದೂರುಗಳು",
  "Issues Resolved": "ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು",
  "In Progress": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
  "Critical Issues": "ಗಂಭೀರ ಸಮಸ್ಯೆಗಳು",
  "Recent Reports": "ಇತ್ತೀಚಿನ ವರದಿಗಳು",
  "View all": "ಎಲ್ಲಾ ನೋಡಿ",
  "Trending": "ಜನಪ್ರಿಯ",
  "AI Predictions": "ಎಐ ಮುನ್ಸೂಚನೆಗಳು",
  "Categories": "ವರ್ಗಗಳು",
  "About Civizen": "ಸಿವಿಜನ್ ಬಗ್ಗೆ",
  "Hyperlocal Civic Engagement Portal": "ಸ್ಥಳೀಯ ನಾಗರಿಕ ಸಹಭಾಗಿತ್ವ ವೇದಿಕೆ",
  "Who We Are": "ನಾವು ಯಾರು",
  "We are Civizen Community Champions, a network of dedicated residents, civic leaders, and local ward engineers collaborating to build cleaner, safer, and better-managed neighbourhoods.": "ನಾವು ಸಿವಿಜನ್ ಸಮುದಾಯ ಚಾಂಪಿಯನ್ಸ್, ನಮ್ಮ ವಾರ್ಡ್ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ರಸ್ತೆ, ದೀಪ ಮತ್ತು ಸ್ವಚ್ಛತೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಶ್ರಮಿಸುತ್ತಿರುವ ನಾಗರಿಕರು ಮತ್ತು ವಾರ್ಡ್ ಅಧಿಕಾರಿಗಳ ಜಾಲ.",
  "What This Does": "ಇದು ಏನು ಮಾಡುತ್ತದೆ",
  "Civizen bypasses traditional bureaucratic delays. By combining AI-powered ticket routing, community verification voting, and utility bill points incentives, we empower citizens to identify, audit, and coordinate resolution directly with officials.": "ಸಿವಿಜನ್ ದೂರುಗಳನ್ನು ಎಐ ಮೂಲಕ ವರ್ಗೀಕರಿಸಿ ನೇರವಾಗಿ ವಾರ್ಡ್ ಎಂಜಿನಿಯರ್‌ಗಳಿಗೆ ತಲುಪಿಸುತ್ತದೆ. ಸಮುದಾಯದ ಇತರ ನಾಗರಿಕರು ಸಮಸ್ಯೆಯನ್ನು ಅನುಮೋದಿಸಿದಾಗ ನಿಮ್ಮ ಖಾತೆಗೆ ರಿವಾರ್ಡ್ ಅಂಕಗಳು ಜಮೆಯಾಗುತ್ತವೆ.",
  "AI Classifier": "ಎಐ ರೂಟಿಂಗ್",
  "Automated categorisation & priority classification": "ಸ್ವಯಂಚಾಲಿತ ವರ್ಗೀಕರಣ ಮತ್ತು ಆದ್ಯತೆ ವಿಂಗಡಣೆ",
  "Community Consensus": "ಸಮುದಾಯ ಪರಿಶೀಲನೆ",
  "Decentralized validation via citizen voting": "ನಾಗರಿಕರ ಮತದಾನದ ಮೂಲಕ ವಿಕೇಂದ್ರೀಕೃತ ದೃಢೀಕರಣ",
  "Subsidies Wallet": "ಸಬ್ಸಿಡಿ ಬಹುಮಾನ",
  "Points redeemable for monthly utility discounts": "ಮಾಸಿಕ ಬಿಲ್ ರಿಯಾಯಿತಿಗಳಿಗಾಗಿ ಬಳಸಬಹುದಾದ ಅಂಕಗಳು",

  // Dashboard & Tracker
  "Real-time analytics · Community performance · AI insights": "ನೈಜ-ಸಮಯದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಒಳನೋಟಗಳು",
  "Total Issues": "ಒಟ್ಟು ದೂರುಗಳು",
  "Resolution Rate": "ಪರಿಹಾರದ ದರ",
  "Avg. Days to Resolve": "ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ",
  "Community Votes": "ಸಮುದಾಯದ ಮತಗಳು",
  "Wards Active": "ಸಕ್ರಿಯ ವಾರ್ಡ್‌ಗಳು",
  "All": "ಎಲ್ಲಾ",
  
  // Leaderboard
  "Community Champions Leaderboard": "ಸಮುದಾಯ ಸಾಧಕರ ಪಟ್ಟಿ",
  "Participate in community auditing, earn verified citizen points, and claim municipal rewards": "ಸಮುದಾಯದ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪುರಸ್ಕಾರಗಳನ್ನು ಪಡೆಯಿರಿ",
  "Rankings & Leaderboard": "ಸಾಧಕರು",
  "Redeem Civic Subsidies": "ಸಬ್ಸಿಡಿಗಳು",
  "View Personal Impact": "ವೈಯಕ್ತಿಕ ಪ್ರಭಾವ ವೀಕ್ಷಿಸಿ",

  // Report Issue
  "Issue Reported Successfully!": "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!",
  "Your report is live. Points (+100 XP) will be awarded once verified by the community.": "ನಿಮ್ಮ ದೂರು ಈಗ ಲೈವ್ ಆಗಿದೆ. ಸಮುದಾಯದಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟ ನಂತರ ಪಾಯಿಂಟ್‌ಗಳನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
  "Pending Verification": "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
  "Redirecting to tracker...": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
  "Describe the Issue": "ದೂರಿನ ವಿವರಗಳು",
  "Issue Title": "ವಿಷಯ",
  "e.g. Large pothole on Main Street": "ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ",
  "Detailed Description": "ದೂರಿನ ವಿವರಣೆ",
  "Record Voice": "ಧ್ವನಿ ರೆಕಾರ್ಡ್",
  "Provide details: when it started, severity...": "ದೂರಿನ ಬಗ್ಗೆ ವಿವರಣೆ ಬರೆಯಿರಿ...",
  "Issue Details / ವಿವರಗಳು": "விವರಗಳು",
  "Location & Media / ಸ್ಥಳ": "ಸ್ಥಳ",
  "Review / ಪರಿಶೀಲನೆ": "ಪರಿಶೀಲನೆ",
  "AI-powered categorisation · Geo-tagged · Community verified / ಎಐ ಆಧಾರಿತ ವರ್ಗೀಕರಣ": "ಎಐ ಆಧಾರಿತ ವರ್ಗೀಕರಣ",
  
  // Category / Status / Priority / Badge labels
  "Infrastructure": "ಮೂಲಸೌಕರ್ಯ",
  "Utilities": "ಉಪಯುಕ್ತತೆಗಳು",
  "Sanitation": "ನೈರ್ಮಲ್ಯ",
  "Public Safety": "ಸುರಕ್ಷತೆ",
  "Environment": "ಪರಿಸರ",
  "Public Property": "ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ",
  
  "Reported": "ವರದಿಯಾಗಿದೆ",
  "Verified": "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
  "Rejected": "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
  
  "Low": "ಕಡಿಮೆ",
  "Medium": "ಮಧ್ಯಮ",
  "High": "ಹೆಚ್ಚು",
  "Critical": "ಗಂಭೀರ",
  
  "First Reporter": "ಪ್ರಥಮ ವರದಿಗಾರ",
  "Active Citizen": "ಕ್ರಿಯಾಶೀಲ ನಾಗರಿಕ",
  "Community Watchdog": "ಸಮುದಾಯ ರಕ್ಷಕ",
  "Problem Solver": "ಸಮಸ್ಯೆ ಪರಿಹಾರಕ",
  "Verified Hero": "ದೃಢೀಕೃತ ಹೀರೊ",
  "Democracy Advocate": "ಪ್ರಜಾಪ್ರಭುತ್ವವಾದಿ",
  "Streak Master": "ನಿರಂತರ ವೀರ",
  "Photo Pro": "ಛಾಯಾಗ್ರಹಣ ಪ್ರೊ",
  
  "Points": "ಅಂಕಗಳು",
  "XP": "ಎಕ್ಸ್‌ಪಿ Progress",
  "Level": "ಮಟ್ಟ",
  "Citizen": "ನಾಗರಿಕರು",

  // Report Issue Additions
  "Detailed Address / Street": "ವಿವರವಾದ ವಿಳಾಸ / ರಸ್ತೆ",
  "Area / Locality": "ಪ್ರದೇಶ / ಇಲಾಖೆ",
  "Pincode": "ಪಿನ್‌ಕೋಡ್",
  "Geo-Tagging Coordinates": "ಜಿಯೋ-ಟ್ಯಾಗಿಂಗ್ ಕೋಆರ್ಡಿನೇಟ್ಸ್",
  "Auto Geo-Tag Location": "ಸ್ವಯಂಚಾಲಿತ ಜಿಪಿಎಸ್ ಸ್ಥಳ",
  "Acquiring GPS...": "ಜಿಪಿಎಸ್ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
  "GPS Locked": "ಜಿಪಿಎಸ್ ಲಾಕ್ ಆಗಿದೆ",
  "Click to acquire GPS from device": "ಸಾಧನದಿಂದ ಜಿಪಿಎಸ್ ಪಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  "Review & Submit": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ",
  "Title": "ವಿಷಯ",
  "Category": "ವರ್ಗ",
  "Priority": "ಆದ್ಯತೆ",
  "Location Address": "ಸ್ಥಳದ ವಿಳಾಸ",
  "Photos": "ಚಿತ್ರಗಳು",
  "attached": "ಲಗತ್ತಿಸಲಾಗಿದೆ",
  "Description": "ವಿವರಣೆ",
  "Back": "ಹಿಂದಕ್ಕೆ",
  "Submit Issue": "ದೂರು ಸಲ್ಲಿಸಿ",
  "🌟 +50 points for reporting": "🌟 ದೂರು ಸಲ್ಲಿಸಿದ್ದಕ್ಕಾಗಿ +50 ಅಂಕಗಳು",
  "🎯 Contributes to community score": "🎯 ಸಮುದಾಯದ ಸ್ಕೋರ್‌ಗೆ ಕೊಡುಗೆ ನೀಡುತ್ತದೆ",
  "📧 Get notified on updates": "📧 ನವೀಕರಣಗಳ ಬಗ್ಗೆ ಅಧಿಸೂಚನೆ ಪಡೆಯಿರಿ",
  "Select category": "ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  "Select subcategory": "ಉಪವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  "Priority Level": "ಆದ್ಯತೆಯ ಮಟ್ಟ",
  "Next: Add Location": "ಮುಂದೆ: ಸ್ಥಳ ಸೇರಿಸಿ",
  "Next: Review": "ಮುಂದೆ: ಪರಿಶೀಲನೆ",
  "Photos / Videos (optional, up to 5)": "ಚಿತ್ರಗಳು / ವೀಡಿಯೊಗಳು (ಐಚ್ಛಿಕ, 5 ರವರೆಗೆ)",
  "JPG, PNG, WEBP up to 10MB each": "ಪ್ರತಿಯೊಂದು JPG, PNG, WEBP ಗರಿಷ್ಠ 10MB",
  "Leaderboard Profile": "ಸಾಧಕರ ಪ್ರೊಫೈಲ್",
  "Your stats are public. You can see others' ranks.": "ನಿಮ್ಮ ಅಂಕಿಅಂಶಗಳು ಸಾರ್ವಜನಿಕವಾಗಿವೆ. ನೀವು ಇತರರ ಶ್ರೇಣಿಯನ್ನು ನೋಡಬಹುದು.",
  "Opt in to see the community rankings and share your stats.": "ಸಮುದಾಯದ ಶ್ರೇಣಿಗಳನ್ನು ನೋಡಲು ಮತ್ತು ನಿಮ್ಮ ಅಂಕಿಅಂಶಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಆಯ್ಕೆ ಮಾಡಿ.",
  "Community Impact": "ಸಮುದಾಯದ ಪ್ರಭಾವ",
  "Privacy Notice & Consent (DPDPA-2023)": "ಗೌಪ್ಯತೆ ಸೂಚನೆ ಮತ್ತು ಸಮ್ಮತಿ (ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩)",
  "Civizen processes your data (masked Aadhaar, GPS location, and issue photos) in compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023. This is required to prevent fake reports, verify your local residency, and coordinate dispatches with officials. Faces and license plates are blurred on your device to preserve anonymity.": "ನಾವು ನಿಮ್ಮ ವಾರ್ಡ್ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ನೈಜತೆಯನ್ನು ಕಾಪಾಡಲು ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩ ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಮತ್ತು ಆಧಾರ್ ಡೇಟಾವನ್ನು ಬಳಸುತ್ತೇವೆ. ಅಪ್ಲೋಡ್ ಮಾಡುವ ಮುನ್ನ ಫೋಟೋಗಳಲ್ಲಿ ಮುಖಗಳನ್ನು ಮರೆಮಾಡಲಾಗುತ್ತದೆ.",
  "Manage Preferences": "ಆದ್ಯತೆಗಳು",
  "Hide Details": "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ",
  "Accept All Conditions": "ಸಮ್ಮತಿಸಿ",
  "Save & Close": "ಉಳಿಸಿ ಮತ್ತು ಮುಚ್ಚಿ",
  "Manage Processing Preferences": "ಡೇಟಾ ಸಂಸ್ಕರಣಾ ಆದ್ಯತೆಗಳು",
  "GPS Coordinates Geofencing": "ಜಿಪಿಎಸ್ ಕೋಆರ್ಡಿನೇಟ್‌ಗಳು",
  "Processes ticket coordinate maps to identify appropriate ward dispatch channels.": "ದೂರುಗಳನ್ನು ಸರಿಯಾದ ವಾರ್ಡ್ ಇಲಾಖೆಗಳಿಗೆ ತಲುಪಿಸಲು ಜಿಪಿಎಸ್ ಸ್ಥಳ ಅಗತ್ಯವಿದೆ.",
  "Mandatory": "ಕಡ್ಡಾಯ",
  "Aadhaar Resident Verification": "ಆಧಾರ್ ನಾಗರಿಕ ಪರಿಶೀಲನೆ",
  "Validates local residency. Raw numbers are never saved locally.": "ಸ್ಥಳೀಯ ನಿವಾಸಿ ಎಂದು ಪರಿಶೀಲಿಸುತ್ತದೆ. ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.",
  "Public Rankings Share": "ಸಮುದಾಯ ಶ್ರೇಯಾಂಕ ಹಂಚಿಕೆ",
  "Displays username, earned XP, and badges on public leaderboard lists.": "ಲೀಡರ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಅಂಕಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ಅನುಮತಿಸುತ್ತದೆ.",
  "Data Protection Officer Contact: dpo@civizen.org.in. You can withdraw leaderboard consent at any time via Profile Settings.": "ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿ ಸಂಪರ್ಕ: dpo@civizen.org.in. ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್ ಮೂಲಕ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದು.",
  "Ticket Pipeline Status": "ದೂರುಗಳ ಸ್ಥಿತಿ ಪೈಪ್‌ಲೈನ್",
  "Our Civic Vision": "ನಮ್ಮ ನಾಗರಿಕ ದೂರದೃಷ್ಟಿ",
  "We aim to co-create sustainable, smart, and highly-responsive urban environments where citizens are not passive observers, but active partners in municipal governance. By leveraging modern technology, we turn complaints into constructive actions.": "ನಮ್ಮ ಉದ್ದೇಶ ಸಮರ್ಥನೀಯ, ಸ್ಮಾರ್ಟ್ ಮತ್ತು ಅತ್ಯಂತ ಸ್ಪಂದಿಸುವ ನಗರಾಭಿವೃದ್ಧಿ ಪರಿಸರವನ್ನು ನಾಗರಿಕರ ಸಹಭಾಗಿತ್ವದೊಂದಿಗೆ ನಿರ್ಮಿಸುವುದಾಗಿದೆ. ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ಪ್ರತಿಯೊಂದು ದೂರನ್ನು ರಚನಾತ್ಮಕ ಬದಲಾವಣೆಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತೇವೆ.",
  "Hyperlocal Network": "ಸ್ಥಳೀಯ ನೆಟ್‌ವರ್ಕ್",
  "Ward Engineers": "ವಾರ್ಡ್ ಎಂಜಿನಿಯರ್‌ಗಳು",
  "Citizen Alliance": "ನಾಗರಿಕರ ಮೈತ್ರಿ",
  "AI Ticket Routing": "ಎಐ ದೂರು ರೂಟಿಂಗ್",
  "Auditor Voting": "ನಾಗರಿಕ ಪರಿಶೀಲನೆ",
  "Redeemable Subsidies": "ರಿಯಾಯಿತಿ ಬಹುಮಾನಗಳು",
  "Smart Governance": "ಸ್ಮಾರ್ಟ್ ಆಡಳಿತ",
  "Transparent Audit": "ಪಾರದರ್ಶಕ ಪರಿಶೀಲನೆ",
  "Green Neighbourhoods": "ಹಸಿರು ನೆರೆಹೊರೆ",
  "Fastest Response": "ವೇಗದ ಪ್ರತಿಕ್ರಿಯೆ",
  "System Bottleneck": "ವ್ಯವಸ್ಥೆಯ ಅಡಚಣೆ",
  "Overall City Average": "ಸರಾಸರಿ ನಗರ ಸಮಯ",
  "days": "ದಿನಗಳು",

  // Badge descriptions
  "Reported your first issue": "ಮೊದಲ ದೂರು ಸಲ್ಲಿಸಿದವರು",
  "Reported 5 issues": "5 ದೂರು ಸಲ್ಲಿಸಿದವರು",
  "Reported 10 issues": "10 ದೂರು ಸಲ್ಲಿಸಿದವರು",
  "Had your first issue resolved": "ಮೊದಲ ದೂರು ಪರಿಹರಿಸಿದವರು",
  "Verified by community": "ಸಮುದಾಯದಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟವರು",
  "Cast 20 community votes": "20 ಸಮುದಾಯದ ಮತಗಳು",
  "7-day reporting streak": "7 ದಿನ ನಿರಂತರ ಲಾಗಿನ್",
  "Uploaded 10 photos": "10 ಫೋಟೋ ಅಪ್‌ಲೋಡ್",

  // Departments
  "Environment Department": "ಪರಿಸರ ಇಲಾಖೆ",
  "Infrastructure Department": "ಮೂಲಸೌಕರ್ಯ ಇಲಾಖೆ",
  "Utilities Department": "ಉಪಯುಕ್ತತೆಗಳ ಇಲಾಖೆ",
  "Sanitation Department": "ನೈರ್ಮಲ್ಯ ಇಲಾಖೆ",
  "Public Safety Department": "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ಇಲಾಖೆ",
  "Public Property Department": "ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ಇಲಾಖೆ",
  "BBMP Roads Department": "ಬಿಬಿಎಂಪಿ ರಸ್ತೆ ಇಲಾಖೆ",
  "BESCOM Department": "ಬೆಸ್ಕಾಂ ಇಲಾಖೆ",
  "BWSSB Department": "ಬಿಡಬ್ಲ್ಯೂಎಸ್ಎಸ್ಬಿ ಇಲಾಖೆ",
  "Workflow": "ಕಾರ್ಯಪ್ರವಾಹ",
  "Consensus Swarm": "ಸಹಮತಿ ಸ್ವಾರ್ಮ್",
  "Concierge": "ಸಹಾಯಕಿ",
  "Re-Run Swarm Simulation": "ಸ್ವಾರ್ಮ್ ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ",
  "UPI & BBPS Linked": "UPI ಮತ್ತು BBPS ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ",
  "Link Utility Account": "ಖಾತೆಯನ್ನು ಲಿಂಕ್ ಮಾಡಿ",
  "Consumer Account Number": "ಗ್ರಾಹಕ ಖಾತೆ ಸಂಖ್ಯೆ",
  "UPI ID for Cashback": "ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್‌ಗಾಗಿ UPI ID",
  "Verify & Link": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಿಂಕ್ ಮಾಡಿ",
  "Auto-Applied to next bill": "ಮುಂದಿನ ಬಿಲ್‌ಗೆ ಸ್ವಯಂ ಅನ್ವಯಿಸಲಾಗಿದೆ",
  "AI Smart Dispatch": "ಎಐ ಸ್ಮಾರ್ಟ್ ವರ್ಗೀಕರಣ",
  "Joint-Agency Work Sync": "ಇಲಾಖೆಗಳ ಕೆಲಸದ ಸಮನ್ವಯ",
  "Community Volunteer Alert": "ಸ್ವಯಂಸೇವಕರ ಅಧಿಸೂಚನೆ",
  "1. Snap & Report": "೧. ವರದಿ ಮಾಡಿ",
  "Submit geotagged photos of local issues.": "ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳ ಫೋಟೋ ಸಲ್ಲಿಸಿ.",
  "2. Community Verify": "೨. ಪರಿಶೀಲಿಸಿ",
  "Neighbors vote to validate genuineness.": "ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ನಾಗರಿಕರು ಮತ ಚಲಾಯಿಸುತ್ತಾರೆ.",
  "3. Vigilant Citizen": "೩. ಜಾಗರೂಕ ನಾಗರಿಕ",
  "Earn points for genuine, verified reports.": "ನೈಜ ವರದಿಗಳಿಗಾಗಿ ಅಂಕಗಳನ್ನು ಗಳಿಸಿ.",
  "3. Redeem Subsidies": "೩. ಸಬ್ಸಿಡಿ ಪಡೆಯಿರಿ",
  "Get UPI / BBPS bill discounts.": "ಯುಪಿಐ / ಬಿಬಿಎಂಪಿ ಬಿಲ್ ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ.",
  "Bypassing bureaucratic delays using smart technology. We coordinate citizens, AI auditors, and municipal utility providers (BBMP, BESCOM, BWSSB) to resolve local infrastructure issues rapidly.": "ಸ್ಮಾರ್ಟ್ ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ಆಡಳಿತಾತ್ಮಕ ವಿಳಂಬಗಳನ್ನು ತಪ್ಪಿಸುವುದು. ಸ್ಥಳೀಯ ಮೂಲಸೌಕರ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಪರಿಹರಿಸಲು ನಾವು ನಾಗರಿಕರು, ಎಐ ಪರಿಶೀಲಕರು ಮತ್ತು ಬಿಬಿಎಂಪಿ, ಬೆಸ್ಕಾಂ, ಬಿಡಬ್ಲ್ಯೂಎಸ್ಎಸ್ಬಿ ಇಲಾಖೆಗಳನ್ನು ಸಂಘಟಿಸುತ್ತೇವೆ.",
  "Privacy Notice & Consent (DPDPA-2023)": "ಗೌಪ್ಯತೆ ಸೂಚನೆ ಮತ್ತು ಸಮ್ಮತಿ (ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩)",
  "CivicWise processes your data (masked Aadhaar, GPS location, and issue photos) in compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023. This is required to prevent fake reports, verify your local residency, and coordinate dispatches with officials. Faces and license plates are blurred on your device to preserve anonymity.": "ನಾವು ನಿಮ್ಮ ವಾರ್ಡ್ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ನೈಜತೆಯನ್ನು ಕಾಪಾಡಲು ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩ ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಮತ್ತು ಆಧಾರ್ ಡೇಟಾವನ್ನು ಬಳಸುತ್ತೇವೆ. ಅಪ್ಲೋಡ್ ಮಾಡುವ ಮುನ್ನ ಫೋಟೋಗಳಲ್ಲಿ ಮುಖಗಳನ್ನು ಮರೆಮಾಡಲಾಗುತ್ತದೆ.",
  "Manage Preferences": "ಆದ್ಯತೆಗಳು",
  "Hide Details": "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ",
  "Accept All Conditions": "ಸಮ್ಮತಿಸಿ",
  "Save & Close": "ಉಳಿಸಿ ಮತ್ತು ಮುಚ್ಚಿ",
  "Manage Processing Preferences": "ಡೇಟಾ ಸಂಸ್ಕರಣಾ ಆದ್ಯತೆಗಳು",
  "GPS Coordinates Geofencing": "ಜಿಪಿಎಸ್ ಕೋಆರ್ಡಿನೇಟ್‌ಗಳು",
  "Processes ticket coordinate maps to identify appropriate ward dispatch channels.": "ದೂರುಗಳನ್ನು ಸರಿಯಾದ ವಾರ್ಡ್ ಇಲಾಖೆಗಳಿಗೆ ತಲುಪಿಸಲು ಜಿಪಿಎಸ್ ಸ್ಥಳ ಅಗತ್ಯವಿದೆ.",
  "Mandatory": "ಕಡ್ಡಾಯ",
  "Aadhaar Resident Verification": "ಆಧಾರ್ ನಾಗರಿಕ ಪರಿಶೀಲನೆ",
  "Validates local residency. Raw numbers are never saved locally.": "ಸ್ಥಳೀಯ ನಿವಾಸಿ ಎಂದು ಪರಿಶೀಲಿಸುತ್ತದೆ. ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.",
  "Public Rankings Share": "ಸಮುದಾಯ ಶ್ರೇಯಾಂಕ ಹಂಚಿಕೆ",
  "Displays username, earned XP, and badges on public leaderboard lists.": "ಲೀಡರ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಅಂಕಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ಅನುಮತಿಸುತ್ತದೆ.",
  "Data Protection Officer Contact: dpo@civicwise.org.in. You can withdraw leaderboard consent at any time via Profile Settings.": "ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿ ಸಂಪರ್ಕ: dpo@civicwise.org.in. ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್ ಮೂಲಕ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದು.",
  "DPDPA-2023 Consent:": "ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩ ಸಮ್ಮತಿ:",
  "I agree to the public processing of my geofenced coordinates, photos, and report details for community validation and dispatch, in accordance with the Digital Personal Data Protection Act, 2023.": "ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ-೨೦೨೩ ರ ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ ಸಮುದಾಯದ ಪರಿಶೀಲನೆಗಾಗಿ ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಮತ್ತು ವಿವರಗಳನ್ನು ಬಳಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
  "City Feed": "ನಗರದ ದೂರುಗಳು"
};

export const HINDI_TRANSLATIONS = {
  // Sidebar & Navbar navigation
  "Home": "मुख्यपृष्ठ",
  "City Feed": "शहर फीड",
  "Report Issue": "शिकायत दर्ज करें",
  "Issue Map": "नक्शा",
  "Issue Tracker": "शिकायतें",
  "Dashboard": "डैशबोर्ड",
  "Impact Dashboard": "प्रभाव डैशबोर्ड",
  "Leaderboard": "लीडरबोर्ड",
  "Ward Officials": "वार्ड अधिकारी",
  "Redeem Subsidies": "सब्सिडी भुनाएं",
  "Login / Sign Up": "लॉग इन / साइन अप",
  "Log Out": "लॉग आउट",
  "Welcome, Guest": "स्वागत है, अतिथि",
  "Log in to start contributing": "योगदान देने के लिए लॉग इन करें",
  "Level Citizen": "सक्रिय नागरिक",
  "XP Progress": "एक्सपी प्रगति",
  "Navigation": "नेविगेशन",
  "Resolved": "समाधान हो गया",
  "Open": "सक्रिय",
  "Badges": "बैज",

  // Home page text
  "Live Community Platform": "लाइव समुदाय मंच",
  "Be the Change": "वह बदलाव बनें",
  "Your Community Needs": "जिसकी आपके समुदाय को आवश्यकता है",
  "Report, verify, and resolve local issues with the power of AI and community collaboration. Every report matters.": "एआई और सामुदायिक सहयोग की शक्ति से स्थानीय समस्याओं की रिपोर्ट करें, सत्यापित करें और हल करें। हर रिपोर्ट मायने रखती है।",
  "View Map": "नक्शा देखें",
  "Total Issues Reported": "कुल रिपोर्ट की गई शिकायतें",
  "Issues Resolved": "हल की गई शिकायतें",
  "In Progress": "प्रगति पर है",
  "Critical Issues": "गंभीर समस्याएं",
  "Recent Reports": "हालिया रिपोर्ट",
  "View all": "सभी देखें",
  "Trending": "ट्रेंडिंग",
  "AI Predictions": "एआई भविष्यवाणियां",
  "Categories": "श्रेणियां",
  "About CivicWise": "सिविकवाइज़ के बारे में",
  "Hyperlocal Civic Engagement Portal": "हाइपरलोकल नागरिक जुड़ाव पोर्टल",
  "Who We Are": "हम कौन हैं",
  "We are CivicWise Community Champions, a network of dedicated residents, civic leaders, and local ward engineers collaborating to build cleaner, safer, and better-managed neighbourhoods.": "हम सिविकवाइज़ कम्युनिटी चैंपियंस हैं, जो अधिक स्वच्छ, सुरक्षित और बेहतर प्रबंधित पड़ोस बनाने के लिए मिलकर काम करने वाले समर्पित निवासियों, नागरिक नेताओं और स्थानीय वार्ड इंजीनियरों का एक नेटवर्क है।",
  "What This Does": "यह क्या करता है",
  "CivicWise bypasses traditional bureaucratic delays. By combining AI-powered ticket routing, community verification voting, and utility bill points incentives, we empower citizens to identify, audit, and coordinate resolution directly with officials.": "सिविकवाइज़ पारंपरिक नौकरशाही देरी को समाप्त करता है। एआई-संचालित टिकट रूटिंग, सामुदायिक सत्यापन मतदान और उपयोगिता बिल अंक प्रोत्साहन को मिलाकर, हम नागरिकों को अधिकारियों के साथ सीधे पहचान करने, ऑडिट करने और समाधान का समन्वय करने के लिए सशक्त बनाते हैं।",
  "AI Classifier": "एआई क्लासिफायर",
  "Automated categorisation & priority classification": "स्वचालित वर्गीकरण और प्राथमिकता वर्गीकरण",
  "Community Consensus": "सामुदायिक सहमति",
  "Decentralized validation via citizen voting": "नागरिक मतदान के माध्यम से विकेंद्रीकृत सत्यापन",
  "Subsidies Wallet": "सब्सिडी वॉलेट",
  "Points redeemable for monthly utility discounts": "मासिक उपयोगिता छूट के लिए भुनाने योग्य अंक",

  // Dashboard & Tracker
  "Real-time analytics · Community performance · AI insights": "वास्तविक समय विश्लेषण · सामुदायिक प्रदर्शन · एआई अंतर्दृष्टि",
  "Total Issues": "कुल शिकायतें",
  "Resolution Rate": "समाधान दर",
  "Avg. Days to Resolve": "औसत समाधान समय (दिन)",
  "Community Votes": "सामुदायिक मत",
  "Wards Active": "सक्रिय वार्ड",
  "All": "सभी",

  // Leaderboard
  "Community Champions Leaderboard": "सामुदायिक चैंपियंस लीडरबोर्ड",
  "Participate in community auditing, earn verified citizen points, and claim municipal rewards": "सामुदायिक ऑडिटिंग में भाग लें, सत्यापित नागरिक अंक अर्जित करें, और नगर निगम पुरस्कारों का दावा करें",
  "Rankings & Leaderboard": "रैंकिंग और लीडरबोर्ड",
  "Redeem Civic Subsidies": "नागरिक सब्सिडी का भुगतान करें",
  "View Personal Impact": "व्यक्तिगत प्रभाव देखें",

  // Report Issue
  "Issue Reported Successfully!": "शिकायत सफलतापूर्वक दर्ज की गई!",
  "Your report is live. Points (+100 XP) will be awarded once verified by the community.": "आपकी रिपोर्ट लाइव है। समुदाय द्वारा सत्यापित होने के बाद अंक (+100 XP) प्रदान किए जाएंगे।",
  "Pending Verification": "सत्यापन लंबित",
  "Redirecting to tracker...": "शिकायत सूची पर पुनः निर्देशित किया जा रहा है...",
  "Describe the Issue": "शिकायत का वर्णन करें",
  "Issue Title": "शिकायत का शीर्षक",
  "e.g. Large pothole on Main Street": "जैसे: मेन स्ट्रीट पर बड़ा गड्ढा",
  "Detailed Description": "विस्तृत विवरण",
  "Record Voice": "आवाज रिकॉर्ड करें",
  "Provide details: when it started, severity...": "विवरण प्रदान करें: यह कब शुरू हुआ, गंभीरता...",
  "Issue Details / ವಿವರಗಳು": "शिकायत विवरण",
  "Location & Media / ಸ್ಥಳ": "स्थान और मीडिया",
  "Review / ಪರಿಶೀಲನೆ": "समीक्षा",
  "AI-powered categorisation · Geo-tagged · Community verified / ಎಐ ಆಧಾರಿತ ವರ್ಗೀಕರಣ": "एआई-संचालित वर्गीकरण · भू-टैग · समुदाय सत्यापित",

  // Category / Status / Priority / Badge labels
  "Infrastructure": "बुनियादी ढांचा",
  "Utilities": "उपयोगिताएँ",
  "Sanitation": "स्वच्छता",
  "Public Safety": "सार्वजनिक सुरक्षा",
  "Environment": "पर्यावरण",
  "Public Property": "सार्वजनिक संपत्ति",

  "Reported": "रिपोर्ट किया गया",
  "Verified": "सत्यापित",
  "Rejected": "खारिज कर दिया",

  "Low": "कम",
  "Medium": "मध्यम",
  "High": "उच्च",
  "Critical": "गंभीर",

  "First Reporter": "प्रथम रिपोर्टर",
  "Active Citizen": "सक्रिय नागरिक",
  "Community Watchdog": "समुदाय प्रहरी",
  "Problem Solver": "समस्या निवारक",
  "Verified Hero": "सत्यापित नायक",
  "Democracy Advocate": "लोकतंत्र समर्थक",
  "Streak Master": "निरंतरता मास्टर",
  "Photo Pro": "फोटो प्रो",

  "Points": "अंक",
  "XP": "एक्सपी",
  "Level": "स्तर",
  "Citizen": "नागरिक",

  // Report Issue Additions
  "Detailed Address / Street": "विस्तृत पता / सड़क",
  "Area / Locality": "क्षेत्र / इलाका",
  "Pincode": "पिनकोड",
  "Geo-Tagging Coordinates": "जियो-टैगिंग निर्देशांक",
  "Auto Geo-Tag Location": "ऑटो जियो-टैग स्थान",
  "Acquiring GPS...": "जीपीएस प्राप्त किया जा रहा है...",
  "GPS Locked": "जीपीएस लॉक हो गया",
  "Click to acquire GPS from device": "डिवाइस से जीपीएस प्राप्त करने के लिए क्लिक करें",
  "Review & Submit": "समीक्षा करें और सबमिट करें",
  "Title": "शीर्षक",
  "Category": "श्रेणी",
  "Priority": "प्राथमिकता",
  "Location Address": "स्थान का पता",
  "Photos": "तस्वीरें",
  "attached": "संलग्न",
  "Description": "विवरण",
  "Back": "पीछे",
  "Submit Issue": "शिकायत सबमिट करें",
  "🌟 +50 points for reporting": "🌟 रिपोर्ट करने के लिए +50 अंक",
  "🎯 Contributes to community score": "🎯 सामुदायिक स्कोर में योगदान देता है",
  "📧 Get notified on updates": "📧 अपडेट पर सूचना प्राप्त करें",
  "Select category": "श्रेणी का चयन करें",
  "Select subcategory": "उपश्रेणी का चयन करें",
  "Priority Level": "प्राथमिकता स्तर",
  "Next: Add Location": "आगे: स्थान जोड़ें",
  "Next: Review": "आगे: समीक्षा",
  "Photos / Videos (optional, up to 5)": "तस्वीरें / वीडियो (वैकल्पिक, 5 तक)",
  "JPG, PNG, WEBP up to 10MB each": "प्रत्येक JPG, PNG, WEBP अधिकतम 10MB",
  "Leaderboard Profile": "लीडरबोर्ड प्रोफ़ाइल",
  "Your stats are public. You can see others' ranks.": "आपके आँकड़े सार्वजनिक हैं। आप दूसरों की रैंक देख सकते हैं।",
  "Opt in to see the community rankings and share your stats.": "सामुदायिक रैंकिंग देखने और अपने आँकड़े साझा करने के लिए ऑप्ट-इन करें।",
  "Community Impact": "सामुदायिक प्रभाव",
  "My Personal Impact": "मेरा व्यक्तिगत प्रभाव",
  "Civic Activity & Contributions": "नागरिक गतिविधि और योगदान",
  "My Activity & XP Growth": "मेरी गतिविधि और एक्सपी वृद्धि",
  "Category Breakdown of My Reports": "मेरी शिकायतों का श्रेणीवार विवरण",
  "Level Progress": "स्तर की प्रगति",
  "My Reported Issues": "मेरी रिपोर्ट की गई शिकायतें",
  "Opt-In Required": "सहमति आवश्यक",
  "To view rankings and share your civic achievements with other citizens, we need your consent to display your profile name, XP points, and report count on the public leaderboard. You can opt out at any time from your profile menu.": "रैंकिंग देखने और अन्य नागरिकों के साथ अपनी नागरिक उपलब्धियों को साझा करने के लिए, हमें सार्वजनिक लीडरबोर्ड पर आपका प्रोफ़ाइल नाम, एक्सपी अंक और रिपोर्ट संख्या प्रदर्शित करने के लिए आपकी सहमति की आवश्यकता है। आप अपने प्रोफ़ाइल मेनू से किसी भी समय ऑप्ट-आउट कर सकते हैं।",
  "Agree & Join": "सहमत हों और जुड़ें",
  "Decline": "अस्वीकार करें",
  "Enable Leaderboard Participation": "लीडरबोर्ड भागीदारी सक्षम करें",
  "Ticket Pipeline Status": "टिकट पाइपलाइन स्थिति",
  "Our Civic Vision": "हमारा नागरिक दृष्टिकोण",
  "We aim to co-create sustainable, smart, and highly-responsive urban environments where citizens are not passive observers, but active partners in municipal governance. By leveraging modern technology, we turn complaints into constructive actions.": "हमारा उद्देश्य एक सतत, स्मार्ट और अत्यधिक संवेदनशील शहरी वातावरण का सह-निर्माण करना है जहां नागरिक मूक दर्शक नहीं, बल्कि शासन में सक्रिय भागीदार हों।",
  "Hyperlocal Network": "हाइपरलोकल नेटवर्क",
  "Ward Engineers": "वार्ड इंजीनियर",
  "Citizen Alliance": "नागरिक गठबंधन",
  "AI Ticket Routing": "एआई टिकट रूटिंग",
  "Auditor Voting": "ऑडिटर वोटिंग",
  "Redeemable Subsidies": "भुनाने योग्य सब्सिडी",
  "Smart Governance": "स्मार्ट गवर्नेंस",
  "Transparent Audit": "पारदर्शी ऑडिट",
  "Green Neighbourhoods": "हरित पड़ोस",
  "Fastest Response": "सबसे तेज़ प्रतिक्रिया",
  "System Bottleneck": "सिस्टम की रुकावट",
  "Overall City Average": "कुल शहर का औसत",
  "days": "दिन",

  // Badge descriptions
  "Reported your first issue": "अपनी पहली समस्या की रिपोर्ट की",
  "Reported 5 issues": "5 समस्याओं की रिपोर्ट की",
  "Reported 10 issues": "10 समस्याओं की रिपोर्ट की",
  "Had your first issue resolved": "अपनी पहली समस्या का समाधान कराया",
  "Verified by community": "समुदाय द्वारा सत्यापित किया गया",
  "Cast 20 community votes": "20 सामुदायिक मत डाले",
  "7-day reporting streak": "7-दिवसीय रिपोर्टिंग निरंतरता",
  "Uploaded 10 photos": "10 तस्वीरें अपलोड कीं",

  // Departments
  "Environment Department": "पर्यावरण विभाग",
  "Infrastructure Department": "बुनियादी ढांचा विभाग",
  "Utilities Department": "उपयोगिता विभाग",
  "Sanitation Department": "स्वच्छता विभाग",
  "Public Safety Department": "सार्वजनिक सुरक्षा विभाग",
  "Public Property Department": "सार्वजनिक संपत्ति विभाग",
  "BBMP Roads Department": "बीबीएमपी सड़क विभाग",
  "BESCOM Department": "बेस्कॉम विभाग",
  "BWSSB Department": "बीडब्ल्यूएसएसबी विभाग",
  "Workflow": "कार्यप्रवाह",
  "Consensus Swarm": "सहमति झुंड (Swarm)",
  "Concierge": "सहायक (Concierge)",
  "Re-Run Swarm Simulation": "वार्ता सिमुलेशन फिर से चलाएं",
  "UPI & BBPS Linked": "UPI और BBPS लिंक्ड",
  "Link Utility Account": "उपयोगिता खाता लिंक करें",
  "Consumer Account Number": "उपभोक्ता खाता संख्या",
  "UPI ID for Cashback": "कैशबैक के लिए UPI ID",
  "Verify & Link": "सत्यापित करें और लिंक करें",
  "Auto-Applied to next bill": "अगले बिल में स्वतः लागू",
  "AI Smart Dispatch": "एआई स्मार्ट वर्गीकरण",
  "Joint-Agency Work Sync": "विभागीय कार्यों का समन्वय",
  "Community Volunteer Alert": "स्वयंसेवक सूचना",
  "1. Snap & Report": "1. रिपोर्ट दर्ज करें",
  "Submit geotagged photos of local issues.": "स्थानीय समस्याओं की तस्वीरें सबमिट करें।",
  "2. Community Verify": "2. समुदाय द्वारा सत्यापित करें",
  "Neighbors vote to validate genuineness.": "सच्चाई की पुष्टि के लिए नागरिक मतदान करते हैं।",
  "3. Vigilant Citizen": "3. सतर्क नागरिक",
  "Earn points for genuine, verified reports.": "सच्ची और सत्यापित रिपोर्टों के लिए अंक अर्जित करें।",
  "3. Redeem Subsidies": "3. सब्सिडी प्राप्त करें",
  "Get UPI / BBPS bill discounts.": "यूपीआई / बीबीपीएस बिल छूट प्राप्त करें।",
  "Bypassing bureaucratic delays using smart technology. We coordinate citizens, AI auditors, and municipal utility providers (BBMP, BESCOM, BWSSB) to resolve local infrastructure issues rapidly.": "स्मार्ट तकनीक का उपयोग करके प्रशासनिक देरी को कम करना। हम स्थानीय बुनियादी ढांचे की समस्याओं को तेजी से हल करने के लिए नागरिकों, एआई लेखा परीक्षकों और नगर निगम उपयोगिता प्रदाताओं (बीबीएमपी, बेस्कॉम, बीडब्ल्यूएसएसबी) का समन्वय करते हैं।",
  "Privacy Notice & Consent (DPDPA-2023)": "गोपनीयता सूचना और सहमति (डीपीडीपी अधिनियम-२०२३)",
  "CivicWise processes your data (masked Aadhaar, GPS location, and issue photos) in compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023. This is required to prevent fake reports, verify your local residency, and coordinate dispatches with officials. Faces and license plates are blurred on your device to preserve anonymity.": "हम आपके वार्ड की शिकायतों को सत्यापित करने और विश्वसनीयता के लिए डीपीडीपी अधिनियम-२०२३ के तहत आपके जीपीएस और आधार डेटा का उपयोग करते हैं। अपलोड से पहले फोटो में चेहरे धुंधले किए जाते हैं।",
  "Manage Preferences": "प्राथमिकताएं",
  "Hide Details": "विवरण छिपाएं",
  "Accept All Conditions": "स्वीकार करें",
  "Save & Close": "सहेजें और बंद करें",
  "Manage Processing Preferences": "डेटा प्रसंस्करण प्राथमिकताएं",
  "GPS Coordinates Geofencing": "जीपीएस स्थान समन्वय",
  "Processes ticket coordinate maps to identify appropriate ward dispatch channels.": "शिकायतों को सही वार्ड विभागों तक पहुँचाने के लिए जीपीएस स्थान आवश्यक है।",
  "Mandatory": "अनिवार्य",
  "Aadhaar Resident Verification": "आधार नागरिक सत्यापन",
  "Validates local residency. Raw numbers are never saved locally.": "स्थानीय निवासी होने की पुष्टि करता है। आपका आधार नंबर सहेजा नहीं जाता है।",
  "Public Rankings Share": "सार्वजनिक रैंकिंग साझाकरण",
  "Displays username, earned XP, and badges on public leaderboard lists.": "लीडरबोर्ड पर आपका नाम और अंक प्रदर्शित करने की अनुमति देता।",
  "Data Protection Officer Contact: dpo@civicwise.org.in. You can withdraw leaderboard consent at any time via Profile Settings.": "डेटा संरक्षण अधिकारी संपर्क: dpo@civicwise.org.in. प्रोफ़ाइल सेटिंग्स के माध्यम से किसी भी समय सहमति वापस ले सकते हैं।",
  "DPDPA-2023 Consent:": "डीपीडीपी अधिनियम-२०२३ सहमति:",
  "I agree to the public processing of my geofenced coordinates, photos, and report details for community validation and dispatch, in accordance with the Digital Personal Data Protection Act, 2023.": "डीपीडीपी अधिनियम-२०२३ के दिशानिर्देशों के अनुसार सामुदायिक सत्यापन के लिए मेरे जीपीएस स्थान और विवरण का उपयोग करने के लिए मैं सहमत हूँ।"
};

// Custom subcategory maps for translation lookups
const SUBCATEGORIES_KN = {
  "Pothole": "ಗುಂಡಿ", "Road Damage": "ರಸ್ತೆ ಹಾನಿ", "Bridge": "ಸೇತುವೆ", "Footpath": "ಪಾದಚಾರಿ ಮಾರ್ಗ", "Signage": "ನಾಮಫಲಕ",
  "Water Leakage": "ನೀರು ಸೋರಿಕೆ", "Power Outage": "ವಿದ್ಯುತ್ ಕಡಿತ", "Gas Leak": "ಗ್ಯಾಸ್ ಸೋರಿಕೆ", "Internet": "ಇಂಟರ್ನೆಟ್", "Water Supply": "ನೀರು ಸರಬರಾಜು",
  "Garbage": "ಕಸ", "Drainage": "ಚರಂಡಿ", "Sewage": "ಒಳಚರಂಡಿ", "Littering": "ಸಾರ್ವಜನಿಕ ತ್ಯಾಜ್ಯ", "Illegal Dumping": "ಅಕ್ರಮ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ",
  "Streetlight": "ಬೀದಿದೀಪ", "Traffic Signal": "ಟ್ರಾಫಿಕ್ ಸಿಗ್ನಲ್", "Abandoned Vehicle": "ಪರಿತ್ಯಕ್ತ ವಾಹನ", "Vandalism": "ದಾಂಧಲೆ", "Unsafe Building": "ಅಸುರಕ್ಷಿತ ಕಟ್ಟಡ",
  "Fallen Tree": "ಬಿದ್ದ ಮರ", "Air Pollution": "ವಾಯು ಮಾಲಿನ್ಯ", "Noise Pollution": "ಶಬ್ದ ಮಾಲಿನ್ಯ", "Water Pollution": "ಜಲ ಮಾಲಿನ್ಯ", "Park Damage": "ಉದ್ಯಾನವನ ಹಾನಿ",
  "School Damage": "ಶಾಲೆ ಹಾನಿ", "Hospital Issue": "ಆಸ್ಪತ್ರೆ ಸಮಸ್ಯೆ", "Library": "ಗ್ರಂಥಾಲಯ", "Community Centre": "ಸಮುದಾಯ ಕೇಂದ್ರ", "Government Building": "ಸರ್ಕಾರಿ ಕಟ್ಟಡ"
};

const SUBCATEGORIES_HI = {
  "Pothole": "गड्ढा", "Road Damage": "सड़क क्षति", "Bridge": "पुल", "Footpath": "फुटपाथ", "Signage": "संकेत चिन्ह",
  "Water Leakage": "पानी का रिसाव", "Power Outage": "बिजली कटौती", "Gas Leak": "गैस रिसाव", "Internet": "इंटरनेट", "Water Supply": "जलापूर्ति",
  "Garbage": "कचरा", "Drainage": "जल निकासी", "Sewage": "सीवेज", "Littering": "गंदगी फैलाना", "Illegal Dumping": "अवैध डंपिंग",
  "Streetlight": "स्ट्रीटलाइट", "Traffic Signal": "ट्रैफिक सिग्नल", "Abandoned Vehicle": "लावारिस वाहन", "Vandalism": "तोड़फोड़", "Unsafe Building": "असुरक्षित इमारत",
  "Fallen Tree": "गिरा हुआ पेड़", "Air Pollution": "वायु प्रदूषण", "Noise Pollution": "ध्वनि प्रदूषण", "Water Pollution": "जल प्रदूषण", "Park Damage": "पार्क क्षति",
  "School Damage": "स्कूल क्षति", "Hospital Issue": "अस्पताल समस्या", "Library": "पुस्तकालय", "Community Centre": "सामुदायिक केंद्र", "Government Building": "सरकारी इमारत"
};

const isBilingual = (str) => /[\u0C80-\u0CFF\u0900-\u097F]/.test(str);

export function useTranslation() {
  const { state } = useApp();
  const lang = state.language || 'en';

  return useCallback((str) => {
    if (!str) return '';

    const trimmed = String(str).trim();

    // 1. Check if we have a direct dictionary translation first (this takes precedence)
    if (lang === 'en-kn') {
      const kn = KANNADA_TRANSLATIONS[trimmed] || SUBCATEGORIES_KN[trimmed];
      if (kn) return kn;
    } else if (lang === 'en-hi') {
      const hi = HINDI_TRANSLATIONS[trimmed] || SUBCATEGORIES_HI[trimmed];
      if (hi) return hi;
    }

    // 2. If no direct lookup, check if it's a combined bilingual string (e.g. "En / Kn")
    // and ONLY split if it's actually bilingual (contains Kannada/Hindi chars on the right)
    if (trimmed.includes(' / ') && isBilingual(trimmed)) {
      const parts = trimmed.split(' / ');
      const en = parts[0].trim();
      const kn = parts[1].trim();

      if (lang === 'en') {
        return en;
      }
      if (lang === 'en-kn') {
        return kn;
      }
      if (lang === 'en-hi') {
        const hi = HINDI_TRANSLATIONS[en] || SUBCATEGORIES_HI[en] || en;
        return hi;
      }
    }

    // 3. Fallback direct lookups or defaults (returning ONLY the requested language)
    if (lang === 'en') {
      return trimmed;
    }
    if (lang === 'en-kn') {
      return KANNADA_TRANSLATIONS[trimmed] || SUBCATEGORIES_KN[trimmed] || trimmed;
    }
    if (lang === 'en-hi') {
      return HINDI_TRANSLATIONS[trimmed] || SUBCATEGORIES_HI[trimmed] || trimmed;
    }

    return trimmed;
  }, [lang]);
}
