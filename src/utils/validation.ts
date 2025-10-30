// src/utils/validation.ts

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida el formato de un email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'El correo electrónico es obligatorio',
    };
  }

  // Regex para validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'El correo electrónico no tiene un formato válido',
    };
  }

  return { isValid: true };
};

/**
 * Valida la fortaleza de una contraseña
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'La contraseña es obligatoria',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'La contraseña debe tener al menos 8 caracteres',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una mayúscula',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una minúscula',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos un número',
    };
  }

  return { isValid: true };
};

/**
 * Obtiene el nivel de fortaleza de una contraseña (para UI)
 * @returns 'weak' | 'medium' | 'strong'
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password || password.length < 6) return 'weak';

  let strength = 0;

  // Longitud
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Complejidad
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++; // Caracteres especiales

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

/**
 * Valida el formato de un username
 * Requisitos:
 * - Mínimo 3 caracteres
 * - Máximo 20 caracteres
 * - Solo letras, números y guiones bajos
 * - No puede empezar con número
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) {
    return {
      isValid: false,
      error: 'El nombre de usuario es obligatorio',
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      error: 'El nombre de usuario debe tener al menos 3 caracteres',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: 'El nombre de usuario no puede tener más de 20 caracteres',
    };
  }

  // Solo letras, números y guiones bajos
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
    return {
      isValid: false,
      error: 'El nombre de usuario solo puede contener letras, números y guiones bajos, y debe empezar con una letra',
    };
  }

  return { isValid: true };
};

/**
 * Valida que dos contraseñas coincidan
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Las contraseñas no coinciden',
    };
  }

  return { isValid: true };
};

/**
 * Valida el nombre completo
 */
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return {
      isValid: false,
      error: 'El nombre es obligatorio',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'El nombre debe tener al menos 2 caracteres',
    };
  }

  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: 'El nombre no puede tener más de 50 caracteres',
    };
  }

  return { isValid: true };
};
