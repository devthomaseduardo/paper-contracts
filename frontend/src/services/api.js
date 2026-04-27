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

export async function refineServiceDescription(rawInput) {
  const res = await fetch(`${apiBase()}/api/v1/ai/refine-services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawInput }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = await res.json();
  return data.items ?? [];
}

export async function generateLegalClause(request) {
  const res = await fetch(`${apiBase()}/api/v1/ai/generate-clause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = await res.json();
  return data.clause ?? '';
}

export async function analyzeRisks(documentData) {
  const res = await fetch(`${apiBase()}/api/v1/ai/analyze-risks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(documentData),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return await res.json();
}
export async function generateTimeline(services) {
  const res = await fetch(`${apiBase()}/api/v1/ai/generate-timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ services }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return await res.json();
}

export async function getClients() {
  const res = await fetch(`${apiBase()}/api/v1/clients`);
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function saveClient(client) {
  const res = await fetch(`${apiBase()}/api/v1/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json();
}

export async function deleteClient(doc) {
  const res = await fetch(`${apiBase()}/api/v1/clients/${doc}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await parseError(res));
}
