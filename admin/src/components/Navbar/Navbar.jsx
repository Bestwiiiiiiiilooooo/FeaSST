import React, { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useLanguage } from '../../LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ms', label: 'Melayu' },
];

const Navbar = () => {
  const [showLang, setShowLang] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const langRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLang(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setShowLang(false);
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='profile-lang-wrapper' ref={langRef}>
        <img
          className='profile'
          src={assets.profile_image}
          alt=""
          onClick={() => setShowLang(v => !v)}
          style={{ cursor: 'pointer' }}
        />
        <span style={{ marginLeft: 10 }}>{LANGUAGES.find(l => l.code === language)?.label}</span>
        {showLang && (
          <div className='lang-dropdown'>
            {LANGUAGES.map(lang => (
              <div
                key={lang.code}
                className='lang-option'
                onClick={() => handleLanguageChange(lang.code)}
                style={{ padding: '8px 16px', cursor: 'pointer', background: language === lang.code ? '#ffe8e4' : '#fff' }}
              >
                {lang.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
