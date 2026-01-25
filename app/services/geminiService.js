const API_BASE_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/api/gemini" : "http://localhost:3000/api/gemini";
import { Platform } from 'react-native';

const fetchWithTimeout = (url, options, timeout = 20000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), timeout)
        )
    ]);
};

const fetchWithRetry = async (url, options, retries = 2) => {
    try {
        const response = await fetchWithTimeout(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP_ERROR_${response.status}`);
        }
        return await response.json();
    } catch (err) {
        if (retries === 0) throw err;
        console.log(`Retrying... (${retries} left)`);
        return fetchWithRetry(url, options, retries - 1);
    }
};

export const analyzeImagesWithGemini = async (base64Images) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: Array.isArray(base64Images) ? base64Images : [base64Images] })
    };

    try {
        return await fetchWithRetry(`${API_BASE_URL}/vision`, options);
    } catch (error) {
        console.error("Vision Proxy Error:", error);
        throw error;
    }
};

export const generateListingsWithGemini = async (visionData) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visionData })
    };

    try {
        return await fetchWithRetry(`${API_BASE_URL}/listing`, options);
    } catch (error) {
        console.error("Listing Proxy Error:", error);
        throw error;
    }
};
