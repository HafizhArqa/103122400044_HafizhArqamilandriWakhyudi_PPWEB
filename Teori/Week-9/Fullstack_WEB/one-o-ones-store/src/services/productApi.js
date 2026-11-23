const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    const networkError = new Error(
      `Tidak dapat terhubung ke backend NestJS di ${API_BASE_URL}. Pastikan server backend berjalan (npm run start:dev).`,
    );
    networkError.isNetworkError = true;
    throw networkError;
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const messages = Array.isArray(data?.message)
      ? data.message
      : [data?.message || `Permintaan gagal dengan status HTTP ${response.status}`];

    const apiError = new Error(messages.join(' • '));
    apiError.status = response.status;
    apiError.errorType = data?.error || 'Error';
    apiError.messages = messages;
    throw apiError;
  }

  return data;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function fetchProducts() {
  return requestJson(PRODUCTS_ENDPOINT, { method: 'GET' });
}

export async function fetchProductById(id) {
  return requestJson(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'GET' });
}

export async function createProduct(payload) {
  return requestJson(PRODUCTS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id, payload) {
  return requestJson(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  return requestJson(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}

export async function resetProducts() {
  return requestJson(`${PRODUCTS_ENDPOINT}/reset`, {
    method: 'POST',
  });
}

export async function clearAllProducts() {
  return requestJson(`${PRODUCTS_ENDPOINT}/all`, {
    method: 'DELETE',
  });
}

