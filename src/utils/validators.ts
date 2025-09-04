// Form validation schemas and utilities for TerraPrice application

// Email validation regex
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Password validation regex (8+ chars, at least 1 uppercase, 1 lowercase, 1 number)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Phone number validation regex (US format)
export const PHONE_REGEX = /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;

// Name validation (letters, spaces, hyphens, apostrophes)
export const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

// Validation error messages
export const ValidationMessages = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_STRONG: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
  PASSWORD_CONFIRM_REQUIRED: 'Please confirm your password',
  PASSWORD_MISMATCH: 'Passwords do not match',
  FIRST_NAME_REQUIRED: 'First name is required',
  FIRST_NAME_MIN_LENGTH: 'First name must be at least 2 characters',
  FIRST_NAME_INVALID: 'First name can only contain letters, spaces, hyphens, and apostrophes',
  LAST_NAME_REQUIRED: 'Last name is required',
  LAST_NAME_MIN_LENGTH: 'Last name must be at least 2 characters',
  LAST_NAME_INVALID: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
  PHONE_INVALID: 'Please enter a valid phone number',
  REQUIRED: 'This field is required',
} as const;

// Login form validation schema
export const loginValidationSchema = {
  email: {
    required: ValidationMessages.EMAIL_REQUIRED,
    pattern: {
      value: EMAIL_REGEX,
      message: ValidationMessages.EMAIL_INVALID,
    },
  },
  password: {
    required: ValidationMessages.PASSWORD_REQUIRED,
    minLength: {
      value: 6,
      message: ValidationMessages.PASSWORD_MIN_LENGTH,
    },
  },
};

// Register form validation schema
export const registerValidationSchema = {
  firstName: {
    required: ValidationMessages.FIRST_NAME_REQUIRED,
    minLength: {
      value: 2,
      message: ValidationMessages.FIRST_NAME_MIN_LENGTH,
    },
    pattern: {
      value: NAME_REGEX,
      message: ValidationMessages.FIRST_NAME_INVALID,
    },
  },
  lastName: {
    required: ValidationMessages.LAST_NAME_REQUIRED,
    minLength: {
      value: 2,
      message: ValidationMessages.LAST_NAME_MIN_LENGTH,
    },
    pattern: {
      value: NAME_REGEX,
      message: ValidationMessages.LAST_NAME_INVALID,
    },
  },
  email: {
    required: ValidationMessages.EMAIL_REQUIRED,
    pattern: {
      value: EMAIL_REGEX,
      message: ValidationMessages.EMAIL_INVALID,
    },
  },
  password: {
    required: ValidationMessages.PASSWORD_REQUIRED,
    minLength: {
      value: 8,
      message: ValidationMessages.PASSWORD_STRONG,
    },
    pattern: {
      value: PASSWORD_REGEX,
      message: ValidationMessages.PASSWORD_STRONG,
    },
  },
  confirmPassword: {
    required: ValidationMessages.PASSWORD_CONFIRM_REQUIRED,
    // validate function should be used in the form for password matching
  },
  phoneNumber: {
    pattern: {
      value: PHONE_REGEX,
      message: ValidationMessages.PHONE_INVALID,
    },
  },
};

// Individual validation functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: ValidationMessages.PASSWORD_REQUIRED };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: ValidationMessages.PASSWORD_STRONG };
  }
  
  if (!PASSWORD_REGEX.test(password)) {
    return { isValid: false, message: ValidationMessages.PASSWORD_STRONG };
  }
  
  return { isValid: true };
};

export const validateName = (name: string, fieldName: 'firstName' | 'lastName'): { isValid: boolean; message?: string } => {
  const requiredMessage = fieldName === 'firstName' 
    ? ValidationMessages.FIRST_NAME_REQUIRED 
    : ValidationMessages.LAST_NAME_REQUIRED;
  
  const minLengthMessage = fieldName === 'firstName'
    ? ValidationMessages.FIRST_NAME_MIN_LENGTH
    : ValidationMessages.LAST_NAME_MIN_LENGTH;
    
  const invalidMessage = fieldName === 'firstName'
    ? ValidationMessages.FIRST_NAME_INVALID
    : ValidationMessages.LAST_NAME_INVALID;

  if (!name) {
    return { isValid: false, message: requiredMessage };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: minLengthMessage };
  }
  
  if (!NAME_REGEX.test(name)) {
    return { isValid: false, message: invalidMessage };
  }
  
  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional in most cases
  }
  
  if (!PHONE_REGEX.test(phone)) {
    return { isValid: false, message: ValidationMessages.PHONE_INVALID };
  }
  
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): { isValid: boolean; message?: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: ValidationMessages.PASSWORD_CONFIRM_REQUIRED };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: ValidationMessages.PASSWORD_MISMATCH };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (data: Record<string, unknown>, schema: Record<string, unknown>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field] as Record<string, unknown>;
    
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = rules.required as string;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) return;
    
    // Pattern validation
    const pattern = rules.pattern as { value: RegExp; message: string } | undefined;
    if (pattern && typeof value === 'string' && !pattern.value.test(value)) {
      errors[field] = pattern.message;
      return;
    }
    
    // Min length validation
    const minLength = rules.minLength as { value: number; message: string } | undefined;
    if (minLength && typeof value === 'string' && value.length < minLength.value) {
      errors[field] = minLength.message;
      return;
    }
    
    // Max length validation
    const maxLength = rules.maxLength as { value: number; message: string } | undefined;
    if (maxLength && typeof value === 'string' && value.length > maxLength.value) {
      errors[field] = maxLength.message;
      return;
    }
  });
  
  return errors;
};
