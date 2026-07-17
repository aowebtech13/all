'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';

export default function DevicesSection() {
  const { logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDevices = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get('/api/devices');
      setDevices(res.data?.devices || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Unable to load devices');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoutAll = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await axios.post('/api/devices/logout-all');
      // current token may be revoked => local logout + redirect
      await logout();
    } catch (e) {
      setError(e?.response?.data?.message || 'Logout all failed');
      // If token was revoked anyway, logout() should still clear UI
      await logout();
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoutOne = async (tokenId) => {
    setActionLoading(true);
    setError(null);
    try {
      await axios.post('/api/devices/logout', { token_id: tokenId });
      // if user revoked current device, logout() will redirect
      await logout();
    } catch (e) {
      // If revoking succeeded but client can't see response, still logout.
      setError(e?.response?.data?.message || 'Logout device failed');
      await logout();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Your devices</h3>
        <button
          type="button"
          className="cmn-btn"
          disabled={loading || actionLoading}
          onClick={handleLogoutAll}
          style={{ opacity: loading || actionLoading ? 0.7 : 1 }}
        >
          {actionLoading ? 'Logging out…' : 'Log out on all devices'}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <p>Loading devices…</p>}
        {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && devices.length === 0 && (
          <p>No active devices found.</p>
        )}

        {!loading && !error && devices.length > 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            {devices.map((d) => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  border: '1px solid #eee',
                  borderRadius: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {d.name || 'Unknown device'}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {d.last_used_at ? `Last used: ${new Date(d.last_used_at).toLocaleString()}` : 'Last used: —'}
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-transparent"
                  disabled={actionLoading}
                  onClick={() => handleLogoutOne(d.id)}
                >
                  {actionLoading ? 'Working…' : 'Log out'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

