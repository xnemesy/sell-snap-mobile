/**
 * Validators - Input Validation per Gemini API
 * 
 * Previene invii invalidi e fornisce messaggi errore chiari
 */

/**
 * Valida array di immagini base64
 * 
 * @param {string[]} images - Array di base64 strings
 * @returns {Object} { valid: boolean, reason?: string }
 */
export const validateBase64Images = (images) => {
  // Check 1: Array non vuoto
  if (!Array.isArray(images) || images.length === 0) {
    return { valid: false, reason: 'No images provided' };
  }

  // Check 2: Max 4 immagini
  if (images.length > 4) {
    return { valid: false, reason: 'Max 4 images allowed' };
  }

  // Check 3: Formato base64 valido per JPEG/PNG
  const base64Regex = /^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];

    if (typeof img !== 'string') {
      return { valid: false, reason: `Image ${i + 1} is not a string` };
    }

    if (!base64Regex.test(img)) {
      return { valid: false, reason: 'Images must be base64 JPEG/PNG' };
    }

    // Check 4: Stima dimensione (base64 è ~33% più grande del binario)
    // Se base64 > 6.6MB, il file originale è probabilmente > 5MB
    const base64Length = img.split(',')[1]?.length || 0;
    const estimatedSizeMB = (base64Length * 0.75) / (1024 * 1024);

    if (estimatedSizeMB > 5) {
      return { valid: false, reason: 'Image too large (>5MB)' };
    }
  }

  return { valid: true };
};

/**
 * Valida output Vision API
 * 
 * @param {Object} data - Response da analyzeImagesWithGemini
 * @returns {Object} { valid: boolean, reason?: string }
 */
export const validateVisionData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, reason: 'Data is not an object' };
  }

  // Check campi required
  const requiredFields = ['product', 'condition'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return { valid: false, reason: `Missing required field: ${field}` };
    }
  }

  // Check product.type (essenziale per categorizzazione)
  if (!data.product.type && !data.product.category_hint) {
    return { valid: false, reason: 'Product type/category not identified' };
  }

  // Check condition.level (essenziale per listing)
  if (!data.condition.level) {
    // Non blocchiamo, mettiamo un default
    console.warn('[Validator] Condition level missing, defaulting to "Buone"');
    data.condition.level = "Buone";
  }

  // Validazione opzionale: warn se troppi campi missing
  if (data.missing_or_uncertain && data.missing_or_uncertain.length > 5) {
    console.warn('[Validator] Vision data has many uncertain fields:',
      data.missing_or_uncertain.length);
    // Non blocchiamo, ma logghiamo per debugging
  }

  return { valid: true };
};

/**
 * Valida output Listing API
 * 
 * @param {Object} data - Response da generateListingsWithGemini
 * @returns {Object} { valid: boolean, reason?: string }
 */
export const validateListingData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, reason: 'Data is not an object' };
  }

  // Almeno un marketplace deve essere presente
  const marketplaces = ['vinted', 'ebay', 'subito'];
  const hasAtLeastOne = marketplaces.some(m => data[m]);

  if (!hasAtLeastOne) {
    return { valid: false, reason: 'No marketplace listings generated' };
  }

  // Per ogni marketplace presente, verifica title e description
  for (const marketplace of marketplaces) {
    if (data[marketplace]) {
      const listing = data[marketplace];

      if (!listing.title || typeof listing.title !== 'string') {
        return { valid: false, reason: `${marketplace}: missing or invalid title` };
      }

      if (!listing.description || typeof listing.description !== 'string') {
        return { valid: false, reason: `${marketplace}: missing or invalid description` };
      }

      // Check lunghezza minima (evita output vuoti/truncati)
      if (listing.title.length < 10) {
        return { valid: false, reason: `${marketplace}: title too short` };
      }

      if (listing.description.length < 20) {
        return { valid: false, reason: `${marketplace}: description too short` };
      }
    }
  }

  return { valid: true };
};

/**
 * Valida prezzo inserito dall'utente
 * 
 * @param {string|number} price - Prezzo da validare
 * @returns {Object} { valid: boolean, reason?: string, normalized?: number }
 */
export const validatePrice = (price) => {
  // Normalizza a numero
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;

  if (isNaN(numPrice)) {
    return { valid: false, reason: 'Price must be a number' };
  }

  if (numPrice < 0) {
    return { valid: false, reason: 'Price cannot be negative' };
  }

  if (numPrice === 0) {
    // Warn ma non blocca (potrebbe essere gratis)
    console.warn('[Validator] Price is 0 - listing might be marked as free');
  }

  if (numPrice > 999999) {
    return { valid: false, reason: 'Price too high (max 999,999)' };
  }

  // Arrotonda a 2 decimali
  const normalized = Math.round(numPrice * 100) / 100;

  return { valid: true, normalized };
};
