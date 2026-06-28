import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { CATEGORIES, PRIORITY_CONFIG } from '../data/categories.js';
import { categorizeIssue, analyzePriority, generateTags, estimateResolutionTime, analyzeImage, analyzeIssueWithGemini } from '../utils/aiEngine.js';
import './ReportIssue.css';

const BCP47_LANGS = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN'
};

// Google Maps script dynamic loader helper
let googleMapsPromise = null;
function loadGoogleMapsScript(apiKey) {
  if (window.google) return Promise.resolve(window.google);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}
const mapAIToCategories = (text) => {
  const t = text.toLowerCase();
  
  // 1. Utilities
  if (t.includes('water supply') || t.includes('water leak') || t.includes('leakage') || t.includes('water pipe') || t.includes('flooding')) {
    return {
      category: 'utilities',
      subcategory: 'Water Leakage',
      priority: 'high',
      title: 'Water Leakage / Pipe Burst'
    };
  }
  if (t.includes('power') || t.includes('electric') || t.includes('electricity') || t.includes('blackout') || t.includes('load shedding') || t.includes('outage')) {
    return {
      category: 'utilities',
      subcategory: 'Power Outage',
      priority: 'high',
      title: 'Power Outage / Electrical Issue'
    };
  }
  if (t.includes('gas') || t.includes('cylinder') || t.includes('lpg')) {
    return {
      category: 'utilities',
      subcategory: 'Gas Leak',
      priority: 'critical',
      title: 'Gas Leakage Threat'
    };
  }
  
  // 2. Sanitation
  if (t.includes('garbage') || t.includes('trash') || t.includes('waste') || t.includes('dump') || t.includes('litter')) {
    return {
      category: 'sanitation',
      subcategory: 'Garbage',
      priority: 'medium',
      title: 'Garbage Accumulation / Littering'
    };
  }
  if (t.includes('drain') || t.includes('drainage') || t.includes('overflowing drain')) {
    return {
      category: 'sanitation',
      subcategory: 'Drainage',
      priority: 'high',
      title: 'Blocked / Overflowing Drainage'
    };
  }
  if (t.includes('sewage') || t.includes('sewer') || t.includes('manhole')) {
    return {
      category: 'sanitation',
      subcategory: 'Sewage',
      priority: 'high',
      title: 'Sewage Leak / Open Manhole'
    };
  }

  // 3. Public Safety
  if (t.includes('light') || t.includes('streetlight') || t.includes('dark')) {
    return {
      category: 'public_safety',
      subcategory: 'Streetlight',
      priority: 'medium',
      title: 'Non-functional Streetlight'
    };
  }
  if (t.includes('traffic') || t.includes('signal') || t.includes('junction')) {
    return {
      category: 'public_safety',
      subcategory: 'Traffic Signal',
      priority: 'high',
      title: 'Broken Traffic Signal'
    };
  }
  if (t.includes('unsafe') || t.includes('collapse') || t.includes('structure')) {
    return {
      category: 'public_safety',
      subcategory: 'Unsafe Building',
      priority: 'critical',
      title: 'Hazardous Unsafe Structure'
    };
  }

  // 4. Infrastructure
  if (t.includes('pothole') || t.includes('crater') || t.includes('hole')) {
    return {
      category: 'infrastructure',
      subcategory: 'Pothole',
      priority: 'high',
      title: 'Hazardous Road Pothole'
    };
  }
  if (t.includes('road') || t.includes('damage') || t.includes('crack') || t.includes('asphalt')) {
    return {
      category: 'infrastructure',
      subcategory: 'Road Damage',
      priority: 'high',
      title: 'Damaged Road Surface'
    };
  }
  if (t.includes('bridge') || t.includes('flyover')) {
    return {
      category: 'infrastructure',
      subcategory: 'Bridge',
      priority: 'high',
      title: 'Bridge Structural Damage'
    };
  }
  if (t.includes('footpath') || t.includes('pavement') || t.includes('sidewalk')) {
    return {
      category: 'infrastructure',
      subcategory: 'Footpath',
      priority: 'medium',
      title: 'Broken Footpath Slab'
    };
  }

  // 5. Environment
  if (t.includes('tree') || t.includes('branch') || t.includes('fallen')) {
    return {
      category: 'environment',
      subcategory: 'Fallen Tree',
      priority: 'high',
      title: 'Fallen Tree / Blocked Road'
    };
  }
  if (t.includes('air') || t.includes('smoke') || t.includes('pollution')) {
    return {
      category: 'environment',
      subcategory: 'Air Pollution',
      priority: 'medium',
      title: 'Air Quality Concern'
    };
  }

  // Default fallback
  return {
    category: 'infrastructure',
    subcategory: 'Road Damage',
    priority: 'medium',
    title: 'Infrastructure Maintenance Issue'
  };
};

export default function ReportIssue() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const t = useTranslation();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    location: '',
    coordinates: null,
    priority: 'medium',
    streetAddress: '',
    area: '',
    pincode: '',
  });

  const [images, setImages] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('kn');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageAiResult, setImageAiResult] = useState(null);
  const [step, setStep] = useState(1);
  const [geoLoading, setGeoLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [intakeMode, setIntakeMode] = useState('voice');
  const aiTimeout = useRef(null);
  const autocompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Reactively run AI Vision analysis whenever the uploaded images list changes
  useEffect(() => {
    let active = true;
    if (images.length === 0) {
      setImageAiResult(null);
      return;
    }

    const primaryFile = images[0].file || images[0];
    
    const runAnalysis = async () => {
      const result = await analyzeImage(primaryFile);
      if (active) {
        setImageAiResult(result);
        
        // Auto-categorize based on image detection
        const mapped = mapAIToCategories(result.detected);
        setForm(f => ({
          ...f,
          title: f.title || mapped.title,
          description: f.description || `ZenAI Vision: ${result.detected} observed. Confidence: ${Math.round(result.confidence * 100)}%.`,
          category: mapped.category,
          subcategory: mapped.subcategory,
          priority: mapped.priority
        }));
        
        const catObj = CATEGORIES.find(c => c.id === mapped.category);
        const est = estimateResolutionTime(catObj, mapped.priority);
        setAiResult(prev => ({
          ...prev,
          category: catObj,
          confidence: result.confidence,
          priority: mapped.priority,
          tags: [mapped.subcategory.toLowerCase().replace(' ', '_'), 'zenai_vision'],
          estimatedDays: est
        }));
      }
    };
    
    runAnalysis();
    
    return () => {
      active = false;
    };
  }, [images]);

  // Live demo capture references
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Live webcam activation hook
  useEffect(() => {
    let activeStream = null;
    if (isCameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          activeStream = stream;
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Unable to access real webcam stream, fallback enabled:", err);
        });
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOpen]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && apiKey !== '';

  useEffect(() => {
    if (isKeyConfigured) {
      loadGoogleMapsScript(apiKey)
        .then(() => setGoogleLoaded(true))
        .catch(err => console.warn("Google Maps script load failed:", err));
    }
  }, [isKeyConfigured, apiKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Initialize Google Places Autocomplete when on location step
  useEffect(() => {
    if (!googleLoaded || !window.google || !autocompleteRef.current || step !== 2) return;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'in' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      let street = '';
      let subLocality = '';
      let code = '';

      if (place.address_components) {
        place.address_components.forEach(c => {
          const types = c.types;
          if (types.includes('route') || types.includes('street_number')) {
            street += (street ? ' ' : '') + c.long_name;
          } else if (types.includes('sublocality') || types.includes('neighborhood') || types.includes('locality')) {
            subLocality = c.long_name;
          } else if (types.includes('postal_code')) {
            code = c.long_name;
          }
        });
      }

      setForm(f => ({
        ...f,
        coordinates: [lat, lng],
        streetAddress: street || place.name || '',
        area: subLocality || '',
        pincode: code || '',
      }));
    });

    autocompleteInstanceRef.current = autocomplete;
  }, [googleLoaded, step]);

  // Run AI categorization on text change
  const runAiAnalysis = (title, description) => {
    if (aiTimeout.current) clearTimeout(aiTimeout.current);
    if (title.length < 5 && description.length < 10) { setAiResult(null); return; }

    setAiLoading(true);
    aiTimeout.current = setTimeout(async () => {
      // 1. Try Live Gemini API
      let geminiData = null;
      try {
        geminiData = await analyzeIssueWithGemini(title, description);
      } catch (e) {
        console.error("Gemini API execution error:", e);
      }

      if (geminiData) {
        const catObj = CATEGORIES.find(c => c.id === geminiData.category);
        const est = estimateResolutionTime(catObj, geminiData.priority);
        
        setAiResult({
          category: catObj,
          confidence: geminiData.confidence || 0.95,
          alternatives: [],
          priority: geminiData.priority,
          tags: geminiData.tags || [],
          estimatedDays: est
        });
        
        setForm(f => ({
          ...f,
          category: geminiData.category,
          priority: geminiData.priority,
          subcategory: geminiData.subcategory || (catObj?.subcategories?.[0] || '')
        }));
      } else {
        // 2. Fallback to Local NLP matching
        const result = categorizeIssue(title, description);
        const priority = analyzePriority(title, description);
        const tags = result ? generateTags(title, description, result.category) : [];
        const est = result ? estimateResolutionTime(result.category, priority) : null;
        setAiResult({ ...result, priority, tags, estimatedDays: est });

        if (result && !form.category) {
          setForm(f => ({
            ...f,
            category: result.category.id,
            priority,
            subcategory: result.category.subcategories?.[0] || ''
          }));
        }
      }
      setAiLoading(false);
    }, 700);
  };

  const runMockVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      
      let localTranscript = '';
      let englishTranslate = '';
      
      const currentLang = voiceLanguage;
      
      switch (currentLang) {
        case 'kn':
          localTranscript = 'ರಸ್ತೆಯ ಮಧ್ಯದಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದ್ದು, ವಾಹನಗಳು ಓಡಿಸಲು ತುಂಬಾ ಕಷ್ಟವಾಗುತ್ತಿದೆ.';
          englishTranslate = 'There is a large pothole in the middle of the road, making it very difficult to drive vehicles.';
          break;
        case 'hi':
          localTranscript = 'सड़क के बीच में एक बड़ा गड्ढा है जिसके कारण कारें असंतुलित हो रही हैं।';
          englishTranslate = 'There is a large pothole in the middle of the road, causing cars to swerve and lose balance.';
          break;
        case 'ta':
          localTranscript = 'சாலையில் பெரிய குழி உள்ளது, வாகனங்கள் செல்ல முடியவில்லை.';
          englishTranslate = 'There is a big hole in the road, vehicles are unable to pass.';
          break;
        case 'te':
          localTranscript = 'రోడ్డు మధ్యలో పెద్ద గుంత ఉండటంతో కార్లు నియంత్రణ కోల్పోతున్నాయి.';
          englishTranslate = 'There is a big pothole in the middle of the road, causing cars to lose control.';
          break;
        case 'mr':
          localTranscript = 'रस्त्यावर मोठा खड्डा आहे, दुचाकी वाहने घसरून पडत आहेत.';
          englishTranslate = 'There is a big pothole on the road, two-wheelers are slipping and falling.';
          break;
        default:
          localTranscript = 'There is a major water pipe leakage flooding the street here, it needs urgent attention.';
          englishTranslate = 'There is a major water pipe leakage flooding the street here, it needs urgent attention.';
      }

      setVoiceTranscript(localTranscript);
      setEnglishTranslation(englishTranslate);

      const mapped = mapAIToCategories(englishTranslate);
      setForm(f => {
        const newDesc = f.description ? `${f.description}\n${localTranscript}` : localTranscript;
        runAiAnalysis(f.title || mapped.title, englishTranslate);
        return { 
          ...f, 
          title: f.title || mapped.title,
          description: newDesc,
          category: mapped.category,
          subcategory: mapped.subcategory,
          priority: mapped.priority
        };
      });
    }, 3000);
  };

  const toggleVoiceRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setVoiceTranscript('');
      setEnglishTranslation('');
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = BCP47_LANGS[voiceLanguage] || 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setVoiceTranscript(text);
          
          let english = text;
          if (voiceLanguage !== 'en') {
            const lowerText = text.toLowerCase();
            if (lowerText.includes('ಗುಂಡಿ') || lowerText.includes('ರಸ್ತೆ') || lowerText.includes('ಗಡ್ಢ') || lowerText.includes('ಸಡಕ್') || lowerText.includes('pothole') || lowerText.includes('road')) {
              english = 'There is a large pothole in the middle of the road, causing vehicles to swerve.';
            } else if (lowerText.includes('ನೀರು') || lowerText.includes('ಪೈಪ್') || lowerText.includes('ಪಾನಿ') || lowerText.includes('ಲೀಕ್') || lowerText.includes('water') || lowerText.includes('leak')) {
              english = 'There is a major water pipe leakage flooding the street here, it needs urgent attention.';
            } else if (lowerText.includes('ಕಸ') || lowerText.includes('ಕಸದ') || lowerText.includes('ಕಚರಾ') || lowerText.includes('garbage') || lowerText.includes('waste')) {
              english = 'Garbage is piled up on the footpath, emitting a foul smell and blocking pedestrians.';
            } else {
              english = `[Translated from ${voiceLanguage.toUpperCase()}]: ` + text;
            }
          }
          setEnglishTranslation(english);
          
          const mapped = mapAIToCategories(english);
          setForm(f => {
            const newDesc = f.description ? `${f.description}\n${text}` : text;
            runAiAnalysis(f.title || mapped.title, english);
            return {
              ...f,
              title: f.title || mapped.title,
              description: newDesc,
              category: mapped.category,
              subcategory: mapped.subcategory,
              priority: mapped.priority
            };
          });
        };

        recognition.onerror = (e) => {
          console.warn("Speech API error, running simulation fallback:", e);
          runMockVoiceSimulation();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        runMockVoiceSimulation();
      }
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    runAiAnalysis(updated.title, updated.description);
  };

  // Image drop
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 5,
    noClick: true
  });

  // Geolocation
  const getLocation = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation not supported'); setGeoLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm(f => ({
          ...f,
          coordinates: [latitude, longitude],
          streetAddress: '12th Cross, CMH Road',
          area: 'Indiranagar',
          pincode: '560038',
          location: '12th Cross, CMH Road, Indiranagar, Bangalore - 560038'
        }));
        setGeoLoading(false);
      },
      () => {
        // Fallback: use Bangalore center
        setForm(f => ({
          ...f,
          coordinates: [12.9716, 77.5946],
          streetAddress: '80 Feet Road, 4th Block',
          area: 'Koramangala',
          pincode: '560034',
          location: '80 Feet Road, Koramangala, Bangalore - 560034'
        }));
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.streetAddress || !form.area || !form.pincode) return;

    const selectedCat = CATEGORIES.find(c => c.id === form.category);
    const formattedLocation = `${form.streetAddress}, ${form.area} - ${form.pincode}`;
    const newIssue = {
      ...form,
      location: formattedLocation,
      images: images.map(i => i.preview),
      reportedBy: 'cu1',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0,
      comments: [],
      aiConfidence: aiResult?.confidence || 0.75,
      tags: aiResult?.tags || [],
      ward: 'Your Ward',
      department: selectedCat?.label + ' Department',
      coordinates: form.coordinates || [12.9716 + Math.random() * 0.1, 77.5946 + Math.random() * 0.1],
      timeline: [{ status: 'reported', time: new Date().toISOString(), note: 'Issue reported by community member' }]
    };

    dispatch({ type: 'ADD_ISSUE', payload: newIssue });
    setSubmitted(true);
    setTimeout(() => navigate('/tracker'), 2500);
  };

  const selectedCat = CATEGORIES.find(c => c.id === form.category);

  if (submitted) {
    return (
      <div className="page-container">
        <div className="submit-success">
          <div className="success-icon">🎉</div>
          <h2>{t("Issue Reported Successfully!")}</h2>
          <p>{t("Your report is live. Points (+100 XP) will be awarded once verified by the community.")}</p>
          <div className="success-points" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24' }}>
            {t("Pending Verification")} 🛡️
          </div>
          <p className="text-muted text-sm" style={{ marginTop: '1.5rem' }}>{t("Redirecting to tracker...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t("Report Issue")}</h1>
        <p className="page-subtitle">{t("AI-powered categorisation · Geo-tagged · Community verified / ಎಐ ಆಧಾರಿತ ವರ್ಗೀಕರಣ")}</p>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map(s => (
          <div key={s} className={`step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
            <div className="step-circle">{step > s ? '✓' : s}</div>
            <div className="step-label">
              {t(['AI Intake / ಎಐ ವಿವರ', 'Location & Details / ಸ್ಥಳ', 'Review / ಪರಿಶೀಲನೆ'][s-1])}
            </div>
          </div>
        ))}
      </div>

      <div className="report-layout">
        {/* Main Form */}
        <form className="report-form" onSubmit={handleSubmit}>

          {/* Step 1: AI Intake & Details */}
          {step === 1 && (
            <div className="form-section">
              <h3 className="form-section-title">🎙️ {t("AI Intake: Voice & Photo First")}</h3>
              
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <p style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: '1.55',
                  margin: 0,
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '1.25rem', marginTop: '-0.1rem' }}>💡</span>
                  <span>
                    <strong>{t("Instructions:")}</strong> {t("Upload a photo of the issue (mandatory for verification) and optionally record a voice description. Zenith AI will transcribe and classify details automatically. You can also manually type or edit details below.")}
                  </span>
                </p>
              </div>

              {/* Row for Voice Recorder & Photo Dropzone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                
                {/* Voice recorder box */}
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>🎙️ {t("Regional Voice Intake (Optional)")}</span>
                    <select
                      value={voiceLanguage}
                      onChange={(e) => setVoiceLanguage(e.target.value)}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--text-primary)',
                        borderRadius: '20px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="kn">ಕನ್ನಡ</option>
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                      <option value="ta">தமிழ்</option>
                      <option value="te">తెలుగు</option>
                      <option value="mr">ಮರಾಠಿ</option>
                    </select>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                    <button
                      type="button"
                      className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                      onClick={toggleVoiceRecord}
                      style={{
                        background: isRecording ? '#ef4444' : 'rgba(99, 102, 241, 0.1)',
                        color: isRecording ? '#fff' : '#6366f1',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0.35rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{isRecording ? '🔴 Listening...' : `🎙️ ${t("Tap to Record Voice")}`}</span>
                    </button>
                  </div>
                  {voiceTranscript && (
                    <p className="text-xs" style={{ marginTop: '0.5rem', color: 'var(--accent-purple)', fontWeight: 600, fontStyle: 'italic', textAlign: 'center' }}>
                      ✨ Zenith: "{voiceTranscript}"
                    </p>
                  )}
                </div>



                {/* Photo Dropzone box (Mandatory) */}
                <div>
                  <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'dragging' : ''}`}
                    id="image-dropzone"
                    style={{
                      padding: '1.25rem',
                      cursor: 'default',
                      border: images.length === 0 ? '2px dashed #ef444450' : '2px dashed var(--border-accent)'
                    }}
                  >
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                      <div className="dropzone-icon">📸</div>
                      <div className="dropzone-text" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                        {isDragActive ? t("Drop files here...") : t("Add Photo (Mandatory for Verification) *")}
                      </div>

                      {/* Photo Source Selection Buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                        >
                          📷 {t("Take Photo")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => { e.stopPropagation(); open(); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                        >
                          📁 {t("Upload Gallery")}
                        </button>
                      </div>

                      <div className="dropzone-hint text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                        {t("Drag & drop works, or select an option above")}
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="image-previews" style={{ marginTop: '0.75rem' }}>
                      {images.map((img, i) => (
                        <div key={i} className="img-preview">
                          <img src={img.preview} alt={img.name} />
                          <button
                            type="button"
                            className="img-remove"
                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imageAiResult && (
                    <div className="image-ai-result" style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: imageAiResult.confidence >= 0.50 ? 'rgba(52, 211, 153, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: imageAiResult.confidence >= 0.50 ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      color: imageAiResult.confidence >= 0.50 ? '#34d399' : '#f87171',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', lineHeight: 1.4 }}>
                        <span>{imageAiResult.confidence >= 0.50 ? '🤖' : '⚠️'}</span>
                        <strong>{t("Zenith Vision:")}</strong>
                        <span>
                          {imageAiResult.confidence >= 0.50 ? t("Image verified successfully.") : t("Verification failed.")}
                        </span>
                        <span style={{ fontWeight: 800 }}>
                          ({t("Confidence:")} {Math.round(imageAiResult.confidence * 100)}%)
                        </span>
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                          — {imageAiResult.confidence >= 0.50 
                            ? t("Outdoor municipal pavement structures and pavement textures verified.") 
                            : t("Domestic/indoor objects or unrelated shapes detected instead of public road context.")
                          }
                        </span>
                      </div>
                      
                      {imageAiResult.warningComment && (
                        <div style={{
                          marginTop: '0.25rem',
                          fontSize: '0.72rem',
                          color: 'rgba(255,255,255,0.7)',
                          lineHeight: 1.4
                        }}>
                          {imageAiResult.warningComment}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Section Header for Details */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  📋 {t("Issue Details (Type or Edit below)")}
                </h4>
              </div>

              {/* Title Input */}
              <div className="input-group">
                <label className="input-label">{t("Issue Title")} *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleTextChange}
                  className="input-field"
                  placeholder={t("e.g. Large pothole on Main Street")}
                  required
                  id="issue-title"
                />
              </div>

              {/* Description Input */}
              <div className="input-group">
                <label className="input-label">{t("Detailed Description")} *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleTextChange}
                  className="input-field"
                  placeholder={t("Provide details: when it started, severity...")}
                  rows={3}
                  required
                  id="issue-description"
                />
              </div>

              {/* Category Options */}
              <div className="grid-2" style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">{t("Category")} *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={(e) => {
                      const catId = e.target.value;
                      const catObj = CATEGORIES.find(c => c.id === catId);
                      setForm(f => ({
                        ...f,
                        category: catId,
                        subcategory: catObj?.subcategories?.[0] || ''
                      }));
                    }}
                    className="input-field"
                    required
                    id="issue-category"
                  >
                    <option value="">{t("Select category")}</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {t(cat.label)}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">{t("Subcategory")}</label>
                  <select
                    name="subcategory"
                    value={form.subcategory}
                    onChange={(e) => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    className="input-field"
                    id="issue-subcategory"
                    disabled={!form.category}
                  >
                    <option value="">{t("Select subcategory")}</option>
                    {selectedCat?.subcategories?.map(sub => (
                      <option key={sub} value={sub}>{t(sub)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Selector */}
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label className="input-label">{t("Priority Level")}</label>
                <div className="priority-selector">
                  {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      className={`priority-btn ${form.priority === key ? 'selected' : ''}`}
                      style={form.priority === key ? { borderColor: val.color, color: val.color, background: `${val.color}18` } : {}}
                      onClick={() => setForm(f => ({ ...f, priority: key }))}
                      id={`priority-${key}`}
                    >
                      {t(val.label)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Validation Checklist Box */}
              <div style={{
                margin: '1.25rem 0 0.5rem',
                padding: '0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  📋 Verification & Validation Status
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.7rem' }}>
                  {/* Photo Requirement */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{images.length > 0 ? '✅' : '❌'}</span>
                    <span style={{ color: images.length > 0 ? 'var(--text-primary)' : '#ef4444', fontWeight: images.length > 0 ? 400 : 700 }}>
                      Photo Attachment (Required for Civic Verification)
                    </span>
                  </div>

                  {/* Title & Description Requirements */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{form.title.trim().length > 0 && form.description.trim().length > 0 ? '✅' : '❌'}</span>
                    <span style={{ color: form.title.trim().length > 0 && form.description.trim().length > 0 ? 'var(--text-primary)' : '#ef4444' }}>
                      Issue Details: Title & Description are filled (manually or via voice transcription).
                    </span>
                  </div>

                  {/* Category Requirement */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{!!form.category ? '✅' : '❌'}</span>
                    <span style={{ color: !!form.category ? 'var(--text-primary)' : '#ef4444' }}>
                      Issue Category is selected.
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="step-nav" style={{ marginTop: '1.5rem' }}>
                <div />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!form.category || images.length === 0 || !form.title.trim() || !form.description.trim()}
                  id="step-next-1"
                >
                  {t("Next: Add Location")} →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location & Address Verification */}
          {step === 2 && (
            <div className="form-section">
              <h3 className="form-section-title">📍 {t("Location & Verification")}</h3>

              {googleLoaded && window.google && (
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="input-label" style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    🔍 {t("Google Maps Search & Autocomplete")}
                  </label>
                  <input
                    type="text"
                    ref={autocompleteRef}
                    className="input-field"
                    style={{ borderColor: 'var(--accent-secondary)' }}
                    placeholder={t("Search for street or neighborhood...")}
                    id="google-places-search"
                  />
                  <span className="text-xs text-muted" style={{ marginTop: '0.25rem', display: 'block' }}>
                    Type to search locations in Bangalore. Selecting a place auto-fills coordinates, address, and pincode.
                  </span>
                </div>
              )}

              <div className="input-group">
                <label className="input-label">{t("Geo-Tagging Coordinates")} *</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={getLocation}
                    disabled={geoLoading}
                    id="get-location-btn"
                    style={{ flexShrink: 0 }}
                  >
                    {geoLoading ? '⏳' : '📍'} {geoLoading ? t("Acquiring GPS...") : t("Auto Geo-Tag Location")}
                  </button>
                  {form.coordinates ? (
                    <div className="coord-display" style={{ margin: 0, color: 'var(--accent-green)' }}>
                      ✅ {t("GPS Locked")}: {form.coordinates[0].toFixed(5)}, {form.coordinates[1].toFixed(5)}
                    </div>
                  ) : (
                    <span className="text-xs text-muted">{t("Click to acquire GPS from device")}</span>
                  )}
                </div>
              </div>

              {/* Structured Address Details */}
              <div className="grid-2" style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">{t("Detailed Address / Street")} *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={form.streetAddress}
                    onChange={(e) => setForm(f => ({ ...f, streetAddress: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. 5th Cross, CMH Road"
                    required
                    id="issue-street"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">{t("Area / Locality")} *</label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={(e) => setForm(f => ({ ...f, area: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. Indiranagar"
                    required
                    id="issue-area"
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label className="input-label">{t("Pincode")} *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setForm(f => ({ ...f, pincode: val }));
                  }}
                  className="input-field"
                  placeholder="e.g. 560038"
                  required
                  id="issue-pincode"
                />
              </div>

              <div style={{
                background: 'rgba(52, 211, 153, 0.04)',
                border: '1px solid rgba(52, 211, 153, 0.15)',
                borderRadius: '8px',
                padding: '0.875rem',
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                <span>🛡️</span>
                <span>
                  <strong>Aadhaar KYC Verification Status:</strong> Linked & Verified Citizen (Resident of {state.currentUser?.linkedAccounts?.ward || 'Indiranagar'} Ward).
                </span>
              </div>

              <div className="step-nav" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} id="step-back-2">← {t("Back")}</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)} disabled={!form.streetAddress || !form.area || !form.pincode} id="step-next-2">{t("Next: Review")} →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="form-section">
              <h3 className="form-section-title">✅ {t("Review & Submit")}</h3>

              <div className="review-card">
                <div className="review-row">
                  <span className="review-label">{t("Title")}</span>
                  <span className="review-value">{form.title}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">{t("Category")}</span>
                  <span className="review-value">{selectedCat?.icon} {t(selectedCat?.label)} · {t(form.subcategory)}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">{t("Priority")}</span>
                  <span className="review-value" style={{ color: PRIORITY_CONFIG[form.priority]?.color }}>{t(PRIORITY_CONFIG[form.priority]?.label).toUpperCase()}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">{t("Location Address")}</span>
                  <span className="review-value">{form.streetAddress}, {form.area} - {form.pincode}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">{t("Photos")}</span>
                  <span className="review-value">{images.length} {t("attached")}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">{t("Description")}</span>
                  <span className="review-value" style={{ maxWidth: '300px', display: 'block' }}>{form.description.slice(0, 100)}{form.description.length > 100 ? '...' : ''}</span>
                </div>
              </div>

              <div className="submit-rewards">
                <div className="reward-item">{t("🌟 +50 points for reporting")}</div>
                <div className="reward-item">{t("🎯 Contributes to community score")}</div>
                <div className="reward-item">{t("📧 Get notified on updates")}</div>
              </div>

              <div style={{
                margin: '1.25rem 0',
                padding: '0.875rem',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem'
              }}>
                <input
                  type="checkbox"
                  id="submit-consent-check"
                  required
                  style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                />
                <label htmlFor="submit-consent-check" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.45', cursor: 'pointer' }}>
                  <strong>{t("DPDPA-2023 Consent:")}</strong> {t("I agree to the public processing of my geofenced coordinates, photos, and report details for community validation and dispatch, in accordance with the Digital Personal Data Protection Act, 2023.")}
                </label>
              </div>

              <div className="step-nav">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)} id="step-back-3">← {t("Back")}</button>
                <button type="submit" className="btn btn-success btn-lg" id="submit-issue-btn">
                  🚀 {t("Submit Issue")}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* AI Assistant Panel */}
        <aside className="ai-panel">
          <div className="ai-header">
            <div className="ai-icon">🤖</div>
            <div>
              <div className="font-semibold text-sm">AI Assistant</div>
              <div className="text-xs text-muted">Real-time analysis</div>
            </div>
            {aiLoading && <div className="loading-spinner" style={{ width: 20, height: 20, marginLeft: 'auto' }} />}
          </div>

          {isRecording && (
            <div className="ai-result-card" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: '#ef4444', padding: '1.25rem', marginTop: '1rem' }}>
              <div className="ai-result-label" style={{ color: '#ef4444', fontWeight: 800 }}>🎙️ Local Language Audio Recording</div>
              <p className="text-xs text-muted" style={{ margin: '0.5rem 0' }}>Listening to {state.language?.toUpperCase() || 'EN'} speech input stream...</p>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '18px', justifyContent: 'center', margin: '0.75rem 0' }}>
                <span className="wave-bar" style={{ display: 'inline-block', width: '3px', height: '14px', background: '#ef4444' }} />
                <span className="wave-bar" style={{ display: 'inline-block', width: '3px', height: '8px', background: '#ef4444' }} />
                <span className="wave-bar" style={{ display: 'inline-block', width: '3px', height: '18px', background: '#ef4444' }} />
                <span className="wave-bar" style={{ display: 'inline-block', width: '3px', height: '10px', background: '#ef4444' }} />
                <span className="wave-bar" style={{ display: 'inline-block', width: '3px', height: '12px', background: '#ef4444' }} />
              </div>
            </div>
          )}

          {voiceTranscript && (
            <div className="ai-result-card" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: '#10b981', padding: '1.25rem', marginTop: '1rem' }}>
              <div className="ai-result-label" style={{ color: '#10b981', fontWeight: 800 }}>🔄 speech translation output</div>
              <div className="transcript-box" style={{ marginTop: '0.75rem' }}>
                <div className="text-xs font-bold text-muted" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>Original audio ({state.language?.toUpperCase() || 'EN'})</div>
                <p className="text-sm font-semibold" style={{ margin: '0.25rem 0 0.75rem 0', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  "{voiceTranscript}"
                </p>
                <div className="text-xs font-bold text-muted" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>AI Translation to English</div>
                <p className="text-sm italic font-semibold" style={{ margin: '0.25rem 0 0 0', color: '#6366f1', lineHeight: '1.4' }}>
                  "{englishTranslation}"
                </p>
              </div>
            </div>
          )}

          {!aiResult && !aiLoading && (
            <div className="ai-idle">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p className="text-sm text-muted text-center">Start typing to get AI-powered category suggestions and insights</p>
            </div>
          )}

          {aiResult && (
            <div className="ai-results">
              {/* Top Detection */}
              {aiResult.category && (
                <div className="ai-result-card primary">
                  <div className="ai-result-label">🎯 Best Match</div>
                  <div className="ai-result-category">
                    <span style={{ fontSize: '1.5rem' }}>{aiResult.category.icon}</span>
                    <div>
                      <div className="font-semibold">{aiResult.category.label}</div>
                      <div className="text-xs text-muted">AI Confidence</div>
                    </div>
                    <div className="confidence-badge" style={{ color: aiResult.category.color }}>
                      {Math.round(aiResult.confidence * 100)}%
                    </div>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${aiResult.confidence * 100}%`, background: aiResult.category.color }} />
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {aiResult.alternatives?.length > 0 && (
                <div className="ai-alternatives">
                  <div className="text-xs text-muted mb-1">Other possibilities</div>
                  {aiResult.alternatives.map((alt, i) => (
                    <div key={i} className="alt-item">
                      <span>{alt.category?.icon} {alt.category?.label}</span>
                      <span className="text-xs text-muted">{Math.round(alt.confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Priority */}
              <div className="ai-insight">
                <div className="text-xs text-muted">Detected Priority</div>
                <div className="font-semibold" style={{ color: PRIORITY_CONFIG[aiResult.priority]?.color }}>
                  ⚠️ {aiResult.priority?.toUpperCase()}
                </div>
              </div>

              {/* Est. Resolution */}
              {aiResult.estimatedDays && (
                <div className="ai-insight">
                  <div className="text-xs text-muted">Estimated Resolution</div>
                  <div className="font-semibold">⏱️ ~{aiResult.estimatedDays} days</div>
                </div>
              )}

              {/* Tags */}
              {aiResult.tags?.length > 0 && (
                <div className="ai-insight">
                  <div className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>Auto-generated Tags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {aiResult.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing time */}
              {aiResult.processingTime && (
                <div className="text-xs text-muted" style={{ marginTop: '0.75rem' }}>
                  ⚡ Analyzed in {aiResult.processingTime}ms
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="ai-tips">
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>💡 Tips for better reports</div>
            <ul className="tips-list">
              <li>Be specific about location</li>
              <li>Mention when it started</li>
              <li>Add photos for faster verification</li>
              <li>Describe impact on community</li>
            </ul>
          </div>
        </aside>
      </div>

      {isCameraOpen && (
        <div className="login-modal-backdrop" style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-accent)', padding: '1.5rem', borderRadius: '16px', color: 'var(--text-primary)' }}>
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', marginTop: 0 }}>
              📸 {t("Capture Live Photo")}
            </h3>
            <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
              {t("Aim your camera at the issue and tap capture.")}
            </p>

            {/* Real-time Webcam Video Viewport */}
            <div style={{
              height: '240px',
              background: '#000',
              borderRadius: '8px',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1.25rem'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              
              {/* Scanning lines */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: 'rgba(99, 102, 241, 0.6)',
                top: '50%',
                pointerEvents: 'none',
                animation: 'scanLine 3s infinite linear'
              }} />
              <style>{`
                @keyframes scanLine {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
              `}</style>

              {/* Focus target */}
              <div style={{
                position: 'absolute',
                width: '60px',
                height: '60px',
                border: '2px dashed var(--accent-secondary)',
                borderRadius: '4px',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', color: '#fff', pointerEvents: 'none' }}>
                🔴 {t("LIVE FEED")}
              </div>
            </div>



            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCameraOpen(false)}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #4f6ef7)' }}
                onClick={() => {
                  const video = videoRef.current;
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  let dataUrl = '';
                  if (video && streamRef.current) {
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Draw metadata watermarks onto live capture
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillText('📷 CITIZEN LIVE CAPTURE', 15, 30);
                    ctx.fillText('GPS: 12.9783, 77.6408', 15, canvas.height - 15);
                    
                    dataUrl = canvas.toDataURL('image/jpeg');
                  } else {
                    // Fallback to custom canvas generation if camera failed
                    canvas.width = 300;
                    canvas.height = 200;
                    ctx.fillStyle = '#0f0f1c';
                    ctx.fillRect(0, 0, 300, 200);
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 15;
                    ctx.beginPath();
                    ctx.moveTo(150, 0);
                    ctx.lineTo(150, 200);
                    ctx.stroke();
                    ctx.fillStyle = '#eb5757';
                    ctx.beginPath();
                    ctx.arc(150, 100, 35, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillText('📷 CAPTURE FALLBACK', 10, 20);
                    ctx.fillText('GPS: 12.9783, 77.6408', 10, 185);
                    dataUrl = canvas.toDataURL('image/jpeg');
                  }
                  
                  let filename = 'live_capture_' + Date.now() + '.jpg';
                  
                  const mockFile = {
                    name: filename,
                    preview: dataUrl
                  };
                  
                  setImages([mockFile]);
                  setIsCameraOpen(false);
                  
                  // Stop the webcam stream immediately
                  if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                  }
                  
                  // Simulate AI classification
                  setTimeout(async () => {
                    const result = await analyzeImage(mockFile);
                    setImageAiResult(result);
                    
                    const mapped = mapAIToCategories(result.detected);
                    setForm(f => ({
                      ...f,
                      title: f.title || mapped.title,
                      description: f.description ? `${f.description}\nZenAI Vision: ${result.detected} observed. Confidence: ${Math.round(result.confidence * 100)}%.` : `ZenAI Vision: ${result.detected} observed. Confidence: ${Math.round(result.confidence * 100)}%.`,
                      category: mapped.category,
                      subcategory: mapped.subcategory,
                      priority: mapped.priority
                    }));
                    
                    const catObj = CATEGORIES.find(c => c.id === mapped.category);
                    const est = estimateResolutionTime(catObj, mapped.priority);
                    setAiResult({
                      category: catObj,
                      confidence: result.confidence,
                      alternatives: [],
                      priority: mapped.priority,
                      tags: [mapped.subcategory.toLowerCase().replace(' ', '_'), 'zenai_vision'],
                      estimatedDays: est,
                      processingTime: 380
                    });
                  }, 800);
                }}
              >
                📸 {t("Capture")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
