import { Platform } from 'react-native';
import {
  showErrorAlert,
  withRetry,
  logError,
  createValidationError,
  createNetworkError,
  createAPIError,
} from './ErrorHandler';
import { validateBase64Images, validateVisionData } from '../utils/validators';

const API_BASE_URL = Platform.OS === 'android'
  ? "http://10.0.2.2:3000/api/gemini"
  : "http://localhost:3000/api/gemini";

/**
 * Fetch con timeout configurabile
 */
const fetchWithTimeout = (url, options, timeout = 20000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(createNetworkError('TIMEOUT')), timeout)
    )
  ]);
};

/**
 * Fetch con gestione errori strutturata
 */
const fetchWithErrorHandling = async (url, options, timeout) => {
  try {
    const response = await fetchWithTimeout(url, options, timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createAPIError(
        response.status,
        errorData.error || 'Unknown API error',
        { url, statusText: response.statusText }
      );
    }

    return await response.json();
  } catch (error) {
    // Se è già un nostro errore custom, rilancialo
    if (error.type) throw error;

    // Altrimenti wrappa come network error
    throw createNetworkError(error.message, { url, originalError: error });
  }
};

/**
 * Analizza immagini con Gemini Vision API
 * 
 * @param {string|string[]} base64Images - Base64 JPEG/PNG (max 4)
 * @returns {Promise<Object>} Vision data strutturati
 * @throws {Error} Validation/Network/API errors
 */
export const analyzeImagesWithGemini = async (base64Images) => {
  // 1. Normalizza input
  const images = Array.isArray(base64Images) ? base64Images : [base64Images];

  // 2. Validazione input
  const validation = validateBase64Images(images);
  if (!validation.valid) {
    const error = createValidationError(validation.reason, { imageCount: images.length });
    logError(error, { function: 'analyzeImagesWithGemini' });
    throw error;
  }

  // 3. Preparazione request
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  };

  // 4. Esecuzione con retry automatico
  try {
    const result = await withRetry(
      () => fetchWithErrorHandling(`${API_BASE_URL}/vision`, options, 20000),
      'Vision API'
    );

    // 5. Validazione response
    const dataValidation = validateVisionData(result);
    if (!dataValidation.valid) {
      throw createValidationError(
        `Invalid API response: ${dataValidation.reason}`,
        { response: result }
      );
    }

    return result;
  } catch (error) {
    logError(error, {
      function: 'analyzeImagesWithGemini',
      imageCount: images.length,
    });
    throw error;
  }
};

/**
 * Genera listing testuali per marketplace
 * 
 * @param {Object} visionData - Dati validati da Vision API
 * @returns {Promise<Object>} Listing per Vinted/eBay/Subito
 * @throws {Error} Validation/Network/API errors
 */
export const generateListingsWithGemini = async (visionData) => {
  // 1. Validazione input
  const validation = validateVisionData(visionData);
  if (!validation.valid) {
    const error = createValidationError(validation.reason, { visionData });
    logError(error, { function: 'generateListingsWithGemini' });
    throw error;
  }

  // 2. Preparazione request
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visionData }),
  };

  // 3. Esecuzione con retry (timeout più breve per listing)
  try {
    const result = await withRetry(
      () => fetchWithErrorHandling(`${API_BASE_URL}/listing`, options, 15000),
      'Listing API'
    );

    // 4. Validazione base response (almeno un marketplace)
    if (!result.vinted && !result.ebay && !result.subito) {
      throw createValidationError(
        'Invalid listing response: no marketplace data',
        { response: result }
      );
    }

    return result;
  } catch (error) {
    logError(error, {
      function: 'generateListingsWithGemini',
      productType: visionData.product?.type,
    });
    throw error;
  }
};

/**
 * Helper per mostrare errori all'utente con retry UI
 */
export const handleGeminiError = (error, retryFn = null, cancelFn = null) => {
  showErrorAlert(error, retryFn, cancelFn);
};
