import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 