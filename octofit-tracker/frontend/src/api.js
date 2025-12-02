export function getApiBase() {
  const codespace = process.env.REACT_APP_CODESPACE_NAME || '';
  if (codespace) {
    return `https://${codespace}-8000.app.github.dev/api/`;
  }
  // fallback to localhost
  return `${window.location.protocol}//${window.location.hostname}:8000/api/`;
}

export async function fetchJson(endpointPath) {
  const base = getApiBase();
  const url = `${base}${endpointPath}`;
  console.log('Fetching API endpoint:', url);
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  const json = await res.json();
  console.log('Fetched data from', url, json);
  // support paginated responses with .results or direct arrays/objects
  if (json && typeof json === 'object' && Array.isArray(json.results)) return json.results;
  return json;
}
