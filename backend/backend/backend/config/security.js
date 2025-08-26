// Security configuration for the application
export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
  },
  
  // Rate Limiting
  rateLimit: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
    },
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per 15 minutes
    },
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000'],
    credentials: true,
  },
  
  // Session Security
  session: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
  
  // Input Validation
  validation: {
    maxEmailLength: 254,
    maxNameLength: 100,
    maxPasswordLength: 128,
  },
  
  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};

// Validate security configuration
export const validateSecurityConfig = () => {
  const errors = [];
  
  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET environment variable is required');
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long');
  }
  
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
    errors.push('ALLOWED_ORIGINS environment variable is required in production');
  }
  
  return errors;
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= securityConfig.password.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  const isStrong = score >= 4 && checks.length;
  
  return {
    isStrong,
    score,
    checks,
    message: isStrong ? 'Password is strong' : 'Password does not meet security requirements',
  };
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Email validation with additional checks
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  
  // Length check
  if (email.length > securityConfig.validation.maxEmailLength) return false;
  
  // Domain check (basic)
  const domain = email.split('@')[1];
  if (!domain || domain.length < 2) return false;
  
  return true;
};
