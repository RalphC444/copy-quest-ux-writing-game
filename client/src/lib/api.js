async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  health: () => request('/health'),
  levels: () => request('/levels'),
  level: (id) => request(`/levels/${id}`),
  grade: (payload) => request('/grade', { method: 'POST', body: JSON.stringify(payload) }),
  critique: (payload) => request('/critique', { method: 'POST', body: JSON.stringify(payload) }),
};
