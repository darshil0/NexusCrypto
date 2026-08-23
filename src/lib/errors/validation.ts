import type { AppError } from './error-codes';
import { createAppError } from './error-messages';

export interface ValidationResult {
  isValid: boolean;
  error?: AppError;
  errorMessage?: string;
}

export function validateRequired(value: unknown, fieldName = 'Field'): ValidationResult {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: createAppError('REQUIRED_FIELD', `${fieldName} is required.`),
      errorMessage: `${fieldName} is required.`,
    };
  }
  return { isValid: true };
}

export function validatePositiveNumber(
  value: string | number,
  fieldName = 'Amount',
  min = 0.00000001,
  max = 10000000
): ValidationResult {
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      error: createAppError('REQUIRED_FIELD', `Enter a valid ${fieldName.toLowerCase()}.`),
      errorMessage: `Enter a valid ${fieldName.toLowerCase()}.`,
    };
  }

  const num = typeof value === 'number' ? value : parseFloat(value);

  if (isNaN(num)) {
    return {
      isValid: false,
      error: createAppError('INVALID_NUMBER', `${fieldName} must be a valid number.`),
      errorMessage: `${fieldName} must be a valid number.`,
    };
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: createAppError('NEGATIVE_VALUE', `${fieldName} must be greater than zero.`),
      errorMessage: `${fieldName} must be greater than zero.`,
    };
  }

  if (num < min) {
    return {
      isValid: false,
      error: createAppError('VALUE_TOO_SMALL', `${fieldName} must be at least ${min}.`),
      errorMessage: `${fieldName} must be at least ${min}.`,
    };
  }

  if (num > max) {
    return {
      isValid: false,
      error: createAppError('VALUE_TOO_LARGE', `${fieldName} cannot exceed ${max.toLocaleString()}.`),
      errorMessage: `${fieldName} cannot exceed ${max.toLocaleString()}.`,
    };
  }

  return { isValid: true };
}

export function validatePrecision(value: string | number, maxDecimals: number): ValidationResult {
  const str = String(value);
  if (!str.includes('.')) return { isValid: true };

  const parts = str.split('.');
  const decimals = parts[1] ? parts[1].length : 0;
  if (decimals > maxDecimals) {
    return {
      isValid: false,
      error: createAppError('TOO_MANY_DECIMALS', `Maximum allowed precision is ${maxDecimals} decimal places.`),
      errorMessage: `Maximum allowed precision is ${maxDecimals} decimal places.`,
    };
  }

  return { isValid: true };
}

export function validateOrderNotional(
  quantity: number,
  price: number,
  minNotional = 1.0,
  maxNotional = 1000000.0
): ValidationResult {
  const notional = quantity * price;

  if (isNaN(notional) || notional < minNotional) {
    return {
      isValid: false,
      error: createAppError('ORDER_NOTIONAL_TOO_LOW', `Total order value must be at least $${minNotional.toFixed(2)} USD.`),
      errorMessage: `Total order value must be at least $${minNotional.toFixed(2)} USD.`,
    };
  }

  if (notional > maxNotional) {
    return {
      isValid: false,
      error: createAppError('ORDER_NOTIONAL_TOO_HIGH', `Total order value cannot exceed $${maxNotional.toLocaleString()} USD.`),
      errorMessage: `Total order value cannot exceed $${maxNotional.toLocaleString()} USD.`,
    };
  }

  return { isValid: true };
}

export function validateWithdrawalAddress(address: string): ValidationResult {
  const trimmed = address.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: createAppError('REQUIRED_FIELD', 'Destination wallet address is required.'),
      errorMessage: 'Destination wallet address is required.',
    };
  }

  if (trimmed.length < 16) {
    return {
      isValid: false,
      error: createAppError('INVALID_WITHDRAWAL_ADDRESS', 'Destination address is too short for a valid blockchain address.'),
      errorMessage: 'Destination address is too short for a valid blockchain address.',
    };
  }

  // Basic regex check for blockchain address formats
  const validPattern = /^[a-zA-Z0-9_-]{16,80}$/;
  if (!validPattern.test(trimmed)) {
    return {
      isValid: false,
      error: createAppError('INVALID_WITHDRAWAL_ADDRESS', 'Destination address contains invalid characters.'),
      errorMessage: 'Destination address contains invalid characters.',
    };
  }

  return { isValid: true };
}

export function validateSupportTicket(
  subject: string,
  category: string,
  message: string
): ValidationResult {
  if (!subject.trim()) {
    return {
      isValid: false,
      error: createAppError('REQUIRED_FIELD', 'Subject line is required.'),
      errorMessage: 'Subject line is required.',
    };
  }

  if (!category || category === 'Select Category') {
    return {
      isValid: false,
      error: createAppError('REQUIRED_FIELD', 'Please select a support category.'),
      errorMessage: 'Please select a support category.',
    };
  }

  if (message.trim().length < 10) {
    return {
      isValid: false,
      error: createAppError('SUPPORT_TICKET_CREATE_FAILED', 'Please describe your request using at least 10 characters.'),
      errorMessage: 'Please describe your request using at least 10 characters.',
    };
  }

  return { isValid: true };
}
