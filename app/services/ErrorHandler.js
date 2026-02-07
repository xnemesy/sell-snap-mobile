/**
 * ErrorHandler - Sistema Centralizzato Gestione Errori
 * 
 * Features:
 * - Classificazione errori (network, validation, API, unknown)
 * - Messaggi user-friendly localizzati
 * - Retry logic configurabile
 * - Logging strutturato per debug
 */

import { Alert } from 'react-native';

// Tipi di errore riconosciuti
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  API: 'API',
  TIMEOUT: 'TIMEOUT',
  AUTH: 'AUTH',
  RATE_LIMIT: 'RATE_LIMIT',
  UNKNOWN: 'UNKNOWN',
};

// Configurazione retry per tipo errore
const RETRY_CONFIG = {
  [ErrorTypes.NETWORK]: { maxRetries: 2, delay: 1000 },
  [ErrorTypes.TIMEOUT]: { maxRetries: 1, delay: 2000 },
  [ErrorTypes.API]: { maxRetries: 0, delay: 0 },
  [ErrorTypes.VALIDATION]: { maxRetries: 0, delay: 0 },
  [ErrorTypes.RATE_LIMIT]: { maxRetries: 0, delay: 0 },
  [ErrorTypes.AUTH]: { maxRetries: 0, delay: 0 },
  [ErrorTypes.UNKNOWN]: { maxRetries: 1, delay: 1000 },
};

/**
 * Classifica il tipo di errore basandosi sul messaggio/codice
 */
export const classifyError = (error) => {
  const message = error.message || '';

  if (message.includes('TIMEOUT')) return ErrorTypes.TIMEOUT;
  if (message.includes('VALIDATION_ERROR')) return ErrorTypes.VALIDATION;
  if (message.includes('HTTP_ERROR_401') || message.includes('HTTP_ERROR_403')) {
    return ErrorTypes.AUTH;
  }
  if (message.includes('HTTP_ERROR_429')) return ErrorTypes.RATE_LIMIT;
  if (message.includes('HTTP_ERROR_') || message.includes('API_ERROR')) {
    return ErrorTypes.API;
  }
  if (message.includes('Network') || message.includes('Failed to fetch')) {
    return ErrorTypes.NETWORK;
  }

  return ErrorTypes.UNKNOWN;
};

/**
 * Mapping errori → messaggi utente
 */
const ERROR_MESSAGES = {
  // Network
  'TIMEOUT': {
    title: 'Connessione lenta',
    message: 'Richiesta troppo lunga. Riprova con meno foto o verifica la connessione.',
    action: 'Riprova',
  },
  'NETWORK': {
    title: 'Nessuna connessione',
    message: 'Verifica di essere connesso a Internet e riprova.',
    action: 'Riprova',
  },

  // Validation
  'VALIDATION_ERROR: No images provided': {
    title: 'Foto mancanti',
    message: 'Devi scattare almeno una foto per continuare.',
    action: 'OK',
  },
  'VALIDATION_ERROR: Max 4 images allowed': {
    title: 'Troppe foto',
    message: 'Puoi caricare massimo 4 foto per annuncio.',
    action: 'OK',
  },
  'VALIDATION_ERROR: Images must be base64': {
    title: 'Formato non valido',
    message: 'Le foto devono essere in formato JPEG o PNG.',
    action: 'OK',
  },
  'VALIDATION_ERROR: Image too large': {
    title: 'Foto troppo pesante',
    message: 'Una o più foto superano i 5MB. Comprimile e riprova.',
    action: 'OK',
  },

  // API Errors
  'HTTP_ERROR_401': {
    title: 'Chiave API non valida',
    message: 'Configurazione non corretta. Contatta il supporto.',
    action: 'Supporto',
  },
  'HTTP_ERROR_429': {
    title: 'Limite raggiunto',
    message: 'Hai raggiunto il limite giornaliero. Riprova domani o passa a Pro.',
    action: 'Upgrade',
  },
  'HTTP_ERROR_500': {
    title: 'Errore del server',
    message: 'Il servizio è temporaneamente non disponibile. Riprova tra poco.',
    action: 'Riprova',
  },
  'HTTP_ERROR_503': {
    title: 'Servizio non disponibile',
    message: 'Manutenzione in corso. Riprova tra qualche minuto.',
    action: 'OK',
  },

  // Auth
  'AUTH_ERROR': {
    title: 'Autenticazione fallita',
    message: 'Effettua nuovamente il login per continuare.',
    action: 'Login',
  },

  // Fallback
  'UNKNOWN': {
    title: 'Qualcosa è andato storto',
    message: 'Errore imprevisto. Riprova o contatta il supporto se persiste.',
    action: 'Riprova',
  },
};

/**
 * Ottiene il messaggio user-friendly per un errore
 */
export const getErrorMessage = (error) => {
  const message = error.message || '';

  // Cerca match esatto
  if (ERROR_MESSAGES[message]) {
    return ERROR_MESSAGES[message];
  }

  // Cerca match parziale per validation errors
  const validationMatch = Object.keys(ERROR_MESSAGES).find(
    key => key.startsWith('VALIDATION_ERROR') && message.includes(key.split(':')[1]?.trim())
  );
  if (validationMatch) {
    return ERROR_MESSAGES[validationMatch];
  }

  // Fallback per tipo
  const errorType = classifyError(error);
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.UNKNOWN;
};

/**
 * Mostra alert errore con retry option
 */
export const showErrorAlert = (error, onRetry = null, onCancel = null) => {
  const errorInfo = getErrorMessage(error);
  const errorType = classifyError(error);
  const canRetry = RETRY_CONFIG[errorType].maxRetries > 0 && onRetry;

  const buttons = [];

  if (onCancel) {
    buttons.push({
      text: 'Annulla',
      style: 'cancel',
      onPress: onCancel,
    });
  }

  buttons.push({
    text: errorInfo.action,
    onPress: canRetry ? onRetry : null,
  });

  Alert.alert(errorInfo.title, errorInfo.message, buttons);
};

/**
 * Wrapper per funzioni con retry automatico
 */
export const withRetry = async (fn, errorContext = 'operation') => {
  let lastError;
  let attempts = 0;

  const execute = async () => {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorType = classifyError(error);
      const config = RETRY_CONFIG[errorType];

      if (attempts < config.maxRetries) {
        attempts++;
        console.log(`[ErrorHandler] Retry ${attempts}/${config.maxRetries} for ${errorContext}`);
        await new Promise(resolve => setTimeout(resolve, config.delay));
        return execute();
      }

      throw error;
    }
  };

  return execute();
};

/**
 * Logger strutturato per errori
 */
export const logError = (error, context = {}) => {
  const errorType = classifyError(error);
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    type: errorType,
    message: error.message,
    stack: error.stack,
    context,
  };

  console.error('[ErrorHandler]', JSON.stringify(logEntry, null, 2));

  // TODO: Invia a servizio logging (Sentry, LogRocket, etc.)
  // sendToLoggingService(logEntry);
};

/**
 * Utility per creare errori tipizzati
 */
export const createError = (type, message, details = {}) => {
  const error = new Error(message);
  error.type = type;
  error.details = details;
  return error;
};

// Export convenience functions
export const createValidationError = (message, details) =>
  createError(ErrorTypes.VALIDATION, `VALIDATION_ERROR: ${message}`, details);

export const createNetworkError = (message, details) =>
  createError(ErrorTypes.NETWORK, message, details);

export const createAPIError = (statusCode, message, details) =>
  createError(ErrorTypes.API, `HTTP_ERROR_${statusCode}: ${message}`, details);
