import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Globe, Shield, Sparkles, MapPin, 
  Compass, Check, LogOut, ArrowRight, Heart, Award
} from 'lucide-react';
import './LoginModal.css';

const EXPLORER_ROLES = [
  { id: 'historian', title: 'Heritage Historian', tamil: 'வரலாற்று ஆய்வாளர்', icon: '🏛️' },
  { id: 'traveler', title: 'Cultural Traveler', tamil: 'பண்பாட்டுப் பயணி', icon: '🧭' },
  { id: 'student', title: 'Student & Researcher', tamil: 'மாணவர் & ஆய்வாளர்', icon: '📜' },
  { id: 'enthusiast', title: 'Temple & Art Lover', tamil: 'கோயில் கலை ஆர்வலர்', icon: '🪔' }
];

const TAMIL_DISTRICTS = [
  'Madurai', 'Chennai', 'Thanjavur', 'Coimbatore', 'Tiruchirappalli',
  'Tirunelveli', 'Kanchipuram', 'Pudukkottai', 'Ramanathapuram',
  'Dharmapuri', 'Salem', 'Kanyakumari', 'International Diaspora / பிற நாடுகள்'
];

export const LoginModal = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onLogout,
  currentLanguage = 'en',
  onLanguageChange,
  translations = {}
}) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'profile'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('historian');
  const [selectedDistrict, setSelectedDistrict] = useState('Madurai');
  const [preferredLang, setPreferredLang] = useState(currentLanguage || 'en');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state with currentUser when modal opens
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setSelectedRole(currentUser.role || 'historian');
      setSelectedDistrict(currentUser.district || 'Madurai');
      setPreferredLang(currentUser.preferredLanguage || currentLanguage || 'en');
      setActiveTab('profile');
    } else {
      setName('');
      setEmail('');
      setSelectedRole('historian');
      setSelectedDistrict('Madurai');
      setPreferredLang(currentLanguage || 'en');
      setActiveTab('login');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [isOpen, currentUser, currentLanguage]);

  if (!isOpen) return null;

  const handleLangSelect = (langCode) => {
    setPreferredLang(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(preferredLang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(preferredLang === 'ta' ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email address');
      return;
    }

    const roleObj = EXPLORER_ROLES.find(r => r.id === selectedRole) || EXPLORER_ROLES[0];

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: selectedRole,
      roleTitle: roleObj.title,
      roleTamil: roleObj.tamil,
      roleIcon: roleObj.icon,
      district: selectedDistrict,
      preferredLanguage: preferredLang,
      joinedAt: currentUser?.joinedAt || new Date().toISOString()
    };

    onSaveUser(userData);
    setSuccessMsg(preferredLang === 'ta' ? 'சுயவிவரம் வெற்றிகரமாகச் சேமிக்கப்பட்டது!' : 'Profile saved successfully!');
    
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleGuestContinue = () => {
    // If not logged in, set light guest profile or close
    if (!currentUser) {
      onSaveUser({
        name: preferredLang === 'ta' ? 'விருந்தினர் பயணி' : 'Guest Explorer',
        email: 'guest@geothamizh.heritage',
        role: 'traveler',
        roleTitle: 'Cultural Traveler',
        roleTamil: 'பண்பாட்டுப் பயணி',
        roleIcon: '🧭',
        district: 'Tamil Nadu',
        preferredLanguage: preferredLang,
        isGuest: true,
        joinedAt: new Date().toISOString()
      });
    }
    onClose();
  };

  return (
    <div className="heritage-login-overlay" onClick={onClose}>
      <div className="heritage-login-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button 
          type="button" 
          className="heritage-login-close-btn" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Decorative Brand Header */}
        <div className="heritage-login-header">
          <div className="login-emblem-badge">
            <Sparkles size={22} className="login-sparkle-icon" />
          </div>
          <h2 className="login-brand-title">Geoதமிழ் Explorer Profile</h2>
          <div className="login-brand-sub">
            {preferredLang === 'ta' 
              ? 'வரலாற்றுப் பயணக் கணக்கு • தமிழ் மரபு நுழைவு'
              : 'Rooted in Time. Alive in Stories.'}
          </div>
        </div>

        {/* Language Selection Bar (Prominent at top) */}
        <div className="login-lang-section">
          <div className="login-section-label">
            <Globe size={13} />
            <span>
              {preferredLang === 'ta' ? 'விருப்பமான மொழி / Preferred Language' : 'Preferred Language / விருப்பமான மொழி'}
            </span>
          </div>
          <div className="login-lang-pills-row">
            <button
              type="button"
              className={`login-lang-btn ${preferredLang === 'ta' ? 'active' : ''}`}
              onClick={() => handleLangSelect('ta')}
            >
              <span className="lang-name">தமிழ்</span>
              <span className="lang-sub">Tamil</span>
              {preferredLang === 'ta' && <Check size={12} className="lang-check" />}
            </button>
            <button
              type="button"
              className={`login-lang-btn ${preferredLang === 'en' ? 'active' : ''}`}
              onClick={() => handleLangSelect('en')}
            >
              <span className="lang-name">English</span>
              <span className="lang-sub">ஆங்கிலம்</span>
              {preferredLang === 'en' && <Check size={12} className="lang-check" />}
            </button>
            <button
              type="button"
              className={`login-lang-btn ${preferredLang === 'hi' ? 'active' : ''}`}
              onClick={() => handleLangSelect('hi')}
            >
              <span className="lang-name">हिन्दी</span>
              <span className="lang-sub">Hindi</span>
              {preferredLang === 'hi' && <Check size={12} className="lang-check" />}
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="login-status-alert error">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="login-status-alert success">
            <span>✓ {successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="heritage-login-form">
          {/* Full Name */}
          <div className="login-field-wrap">
            <label className="login-field-label">
              <User size={13} />
              <span>{preferredLang === 'ta' ? 'முழுப் பெயர் (Full Name)' : 'Full Name (பெயர்)'}</span>
            </label>
            <input
              type="text"
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={preferredLang === 'ta' ? 'எ.கா. கபிலன் மணிமாறன்' : 'e.g. John Doe / Karikalan'}
              required
            />
          </div>

          {/* Email Address */}
          <div className="login-field-wrap">
            <label className="login-field-label">
              <Mail size={13} />
              <span>{preferredLang === 'ta' ? 'மின்னஞ்சல் (Email Address)' : 'Email Address (மின்னஞ்சல்)'}</span>
            </label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@geothamizh.heritage"
              required
            />
          </div>

          {/* Explorer Archetype Role */}
          <div className="login-field-wrap">
            <label className="login-field-label">
              <Award size={13} />
              <span>{preferredLang === 'ta' ? 'பயணி வகை (Explorer Archetype)' : 'Explorer Archetype / Role'}</span>
            </label>
            <div className="login-roles-grid">
              {EXPLORER_ROLES.map(role => {
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`login-role-card ${isSelected ? 'active' : ''}`}
                  >
                    <span className="role-icon">{role.icon}</span>
                    <div className="role-text-col">
                      <div className="role-title-en">{role.title}</div>
                      <div className="role-title-ta">{role.tamil}</div>
                    </div>
                    {isSelected && <Check size={14} className="role-check" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Home District / Region */}
          <div className="login-field-wrap">
            <label className="login-field-label">
              <MapPin size={13} />
              <span>{preferredLang === 'ta' ? 'சொந்த மாவட்டம் / பிராந்தியம்' : 'Home District / Native Region'}</span>
            </label>
            <select
              className="login-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {TAMIL_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="login-actions-row">
            <button type="submit" className="login-primary-submit-btn">
              <span>{currentUser ? (preferredLang === 'ta' ? 'சுயவிவரத்தைப் புதுப்பி' : 'Update Profile') : (preferredLang === 'ta' ? 'கணக்கில் நுழைக' : 'Sign In & Explore')}</span>
              <ArrowRight size={15} />
            </button>

            {!currentUser && (
              <button 
                type="button" 
                onClick={handleGuestContinue}
                className="login-guest-btn"
                title="Continue exploring without an account"
              >
                <span>{preferredLang === 'ta' ? 'விருந்தினராக தொடர்க →' : 'Continue as Guest →'}</span>
              </button>
            )}

            {currentUser && onLogout && (
              <button 
                type="button" 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="login-logout-btn"
                title="Log out of current profile"
              >
                <LogOut size={14} />
                <span>{preferredLang === 'ta' ? 'வெளியேறு' : 'Log Out'}</span>
              </button>
            )}
          </div>
        </form>

        {/* Footer Note */}
        <div className="login-card-footer">
          <Shield size={11} />
          <span>
            {preferredLang === 'ta' 
              ? 'உங்கள் விருப்பங்கள் உள்ளூர் சாதனத்தில் பாதுகாப்பாகச் சேமிக்கப்படுகின்றன.' 
              : 'Preferences are preserved locally for an enriched personalized heritage exploration.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
