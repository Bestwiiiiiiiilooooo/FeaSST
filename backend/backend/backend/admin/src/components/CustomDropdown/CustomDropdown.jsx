import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';
import { useLanguage } from '../../LanguageContext';

const CustomDropdown = ({ options, value, onChange, disabled }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case t('readyToCollect'):
        return '#28a745'; // Green
      case t('rejected'):
        return '#dc3545'; // Red
      case t('foodProcessing'):
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray for unknown status
    }
  };

  // Function to translate status text
  const translateStatus = (status) => {
    switch (status) {
      case 'Ready to Collect':
        return t('readyToCollect');
      case 'Rejected':
        return t('rejected');
      case 'Food Processing':
        return t('foodProcessing');
      default:
        return status;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={`custom-dropdown${disabled ? ' disabled' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-selected"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        {value && (
          <span 
            style={{ 
              color: getStatusColor(value),
              fontSize: '1.2em',
              marginRight: '8px'
            }}
          >
            &#x25cf;
          </span>
        )}
        {value ? translateStatus(value) : t('select')}
        <span className="custom-dropdown-arrow">▼</span>
      </button>
      {open && (
        <div className="custom-dropdown-list">
          {options.map((option) => (
            <div
              key={option}
              className={`custom-dropdown-option${option === value ? ' selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <span 
                style={{ 
                  color: getStatusColor(option),
                  fontSize: '1.2em',
                  marginRight: '8px'
                }}
              >
                &#x25cf;
              </span>
              {translateStatus(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 