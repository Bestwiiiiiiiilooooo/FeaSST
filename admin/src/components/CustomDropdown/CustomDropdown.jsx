import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready to Collect':
        return '#28a745'; // Green
      case 'Rejected':
        return '#dc3545'; // Red
      case 'Food Processing':
        return '#ffc107'; // Yellow
      default:
        return '#6c757d'; // Gray for unknown status
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
        {value || 'Select...'}
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
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 