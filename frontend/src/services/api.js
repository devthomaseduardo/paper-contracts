import { auth } from '../firebase';

/**
 * Cliente da API REST. Em dev, o Vite faz proxy de `/api` para o backend.
 * Em produção, defina `VITE_API_BASE_URL` (ex.: https://api.seudominio.com).
 */
function apiBase() {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  return base.replace(/\/$/, '');
}

async function parseError(res) {
  try {
    const j = await res.json();
    return j.error?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

async function getAuthHeaders(extraHeaders = {}) {
  const idToken = await auth.currentUser?.getIdToken();
  const headers = { ...extraHeaders };
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }
  return headers;
}

export async function refineServiceDescription(rawInput) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/ai/refine-services`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ rawInput }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = await res.json();
  return data.items ?? [];
}

export async function generateLegalClause(request) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/ai/generate-clause`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ request }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = await res.json();
  return data.clause ?? '';
}

export async function analyzeRisks(documentData) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/ai/analyze-risks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(documentData),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return await res.json();
}

export async function generateTimeline(services) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/ai/generate-timeline`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ services }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return await res.json();
}

export async function analyzeATSWithAI(cvData, jobDescription) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/ai/analyze-ats`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ cvData, jobDescription }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return await res.json();
}

export async function getClients() {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/clients`, { headers });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function saveClient(client) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/clients`, {
    method: 'POST',
    headers,
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function deleteClient(doc) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${apiBase()}/api/v1/clients/${doc}`, { 
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error(await parseError(res));
}

// Documents Cloud Storage
export async function getDocuments() {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/documents`, { headers });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function saveDocument(document) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${apiBase()}/api/v1/documents`, {
    method: 'POST',
    headers,
    body: JSON.stringify(document),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function deleteDocument(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${apiBase()}/api/v1/documents/${id}`, { 
    method: 'DELETE',
    headers
  });
  if (!res.ok) throw new Error(await parseError(res));
}
