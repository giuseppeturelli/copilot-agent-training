import React, { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '../api';
import CommonTable from './CommonTable';

export default function Activities() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME || '';
        const endpoint = codespace
          ? `https://${codespace}-8000.app.github.dev/api/activities/`
          : `${window.location.protocol}//${window.location.hostname}:8000/api/activities/`;
        const results = await fetchJson(endpoint);
        console.log('Activities component fetched:', results);
        setData(results);
      } catch (err) {
        console.error('Activities fetch error', err);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!data || !Array.isArray(data)) return data;
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      Object.values(row || {}).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <div>
      <h2 className="h3 mb-4">Activities</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3 mb-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search</label>
              <input
                id="search"
                type="text"
                className="form-control"
                placeholder="Filter activities"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end gap-2">
              <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                Open Info
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={async () => {
                try {
                  const codespace = process.env.REACT_APP_CODESPACE_NAME || '';
                  const endpoint = codespace
                    ? `https://${codespace}-8000.app.github.dev/api/activities/`
                    : `${window.location.protocol}//${window.location.hostname}:8000/api/activities/`;
                  const refreshed = await fetchJson(endpoint);
                  setData(refreshed);
                } catch (err) {
                  console.error('Refresh error', err);
                }
              }}>
                Refresh
              </button>
            </div>
          </form>

          {!data && (
            <div className="text-center py-3">
              <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          )}

          {data && (
            <CommonTable data={filtered} />
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activities Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Use the search to filter activities. Data is displayed in a responsive Bootstrap table.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
      )}
    </div>
  );
}
