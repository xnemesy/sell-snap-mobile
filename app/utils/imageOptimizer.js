/**
 * ImageOptimizer - Compressione e Validazione Immagini
 * 
 * Features:
 * - Resize automatico max 1024px
 * - Compressione quality 0.8
 * - Validazione dimensioni
 * - Batch processing con progress
 * - Preserve EXIF orientation
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const JPEG_QUALITY = 0.8;
const MAX_FILE_SIZE_MB = 5;

/**
 * Ottiene dimensioni file da URI
 */
const getFileSize = async (uri) => {
  try {
    if (uri.startsWith('data:')) {
      const base64Length = uri.split(',')[1]?.length || 0;
      return (base64Length * 0.75) / (1024 * 1024); // Stima MB
    }
    const info = await FileSystem.getInfoAsync(uri);
    return info.size / (1024 * 1024); // MB
  } catch (error) {
    console.warn('[ImageOptimizer] Could not get file size:', error);
    return 0;
  }
};

/**
 * Calcola dimensioni target mantenendo aspect ratio
 */
const calculateTargetDimensions = (width, height) => {
  const aspectRatio = width / height;

  if (width > height) {
    // Landscape
    if (width > MAX_WIDTH) {
      return {
        width: MAX_WIDTH,
        height: Math.round(MAX_WIDTH / aspectRatio),
      };
    }
  } else {
    // Portrait
    if (height > MAX_HEIGHT) {
      return {
        width: Math.round(MAX_HEIGHT * aspectRatio),
        height: MAX_HEIGHT,
      };
    }
  }

  // Già entro limiti
  return { width, height };
};

/**
 * Comprimi singola immagine
 * 
 * @param {string} uri - URI locale immagine
 * @returns {Promise<Object>} { uri, base64, originalSize, compressedSize }
 */
export const compressImage = async (uri) => {
  try {
    // 1. Validazione size pre-compressione
    const originalSize = await getFileSize(uri);

    if (originalSize > MAX_FILE_SIZE_MB * 2) {
      // Troppo grande anche per tentare compressione
      throw new Error(`Image too large: ${originalSize.toFixed(2)}MB (max ${MAX_FILE_SIZE_MB * 2}MB)`);
    }

    // 2. Ottieni dimensioni originali
    const imageInfo = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { base64: false }
    );

    const { width, height } = imageInfo;
    const targetDimensions = calculateTargetDimensions(width, height);

    // 3. Resize + Compress
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: targetDimensions }],
      {
        compress: JPEG_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true, // Ottieni direttamente base64
      }
    );

    // 4. Calcola size compressa
    const compressedSize = await getFileSize(manipulatedImage.uri);

    // 5. Validazione post-compressione
    if (compressedSize > MAX_FILE_SIZE_MB) {
      console.warn('[ImageOptimizer] Compressed image still too large:', compressedSize);
      // Riprova con quality più bassa
      const recompressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: targetDimensions }],
        {
          compress: 0.6, // Quality più bassa
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return {
        uri: recompressed.uri,
        base64: `data:image/jpeg;base64,${recompressed.base64}`,
        originalSize,
        compressedSize: await getFileSize(recompressed.uri),
        wasRecompressed: true,
      };
    }

    return {
      uri: manipulatedImage.uri,
      base64: `data:image/jpeg;base64,${manipulatedImage.base64}`,
      originalSize,
      compressedSize,
      wasRecompressed: false,
    };
  } catch (error) {
    console.error('[ImageOptimizer] Compression failed:', error);
    throw error;
  }
};

/**
 * Batch compress con progress callback
 * 
 * @param {string[]} uris - Array di URI immagini
 * @param {function} onProgress - Callback (current, total, percentage)
 * @returns {Promise<Object[]>} Array di risultati compressImage
 */
export const batchCompress = async (uris, onProgress = null) => {
  const results = [];
  const total = uris.length;

  for (let i = 0; i < total; i++) {
    const uri = uris[i];

    try {
      const result = await compressImage(uri);
      results.push(result);

      if (onProgress) {
        const percentage = Math.round(((i + 1) / total) * 100);
        onProgress(i + 1, total, percentage);
      }
    } catch (error) {
      // Non blocca il batch, ma logga errore
      console.error(`[ImageOptimizer] Failed to compress image ${i + 1}:`, error);
      results.push({
        uri,
        error: error.message,
        failed: true,
      });
    }
  }

  return results;
};

/**
 * Validazione pre-compressione (blocca file corrotti/invalidi)
 * 
 * @param {string} uri - URI immagine
 * @returns {Promise<Object>} { valid: boolean, reason?: string }
 */
export const validateImage = async (uri) => {
  try {
    // Check 1: File esiste
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) {
      return { valid: false, reason: 'File does not exist' };
    }

    // Check 2: Dimensione ragionevole
    const sizeMB = info.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB * 2) {
      return { valid: false, reason: `File too large: ${sizeMB.toFixed(2)}MB` };
    }

    // Check 3: Formato immagine (tentando manipulazione)
    try {
      await ImageManipulator.manipulateAsync(uri, [], { base64: false });
    } catch (error) {
      return { valid: false, reason: 'Invalid image format or corrupted file' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
};

/**
 * Stima saving da compressione
 * 
 * @param {number} originalSize - Size originale (MB)
 * @param {number} compressedSize - Size compressa (MB)
 * @returns {Object} { savedMB, savedPercentage }
 */
export const calculateSavings = (originalSize, compressedSize) => {
  const savedMB = originalSize - compressedSize;
  const savedPercentage = Math.round((savedMB / originalSize) * 100);

  return {
    savedMB: savedMB.toFixed(2),
    savedPercentage,
  };
};

/**
 * Helper: converti FileSystem URI → base64 data URI
 * (se l'immagine è già compressa e serve solo conversione)
 */
export const uriToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('[ImageOptimizer] URI to base64 conversion failed:', error);
    throw error;
  }
};
