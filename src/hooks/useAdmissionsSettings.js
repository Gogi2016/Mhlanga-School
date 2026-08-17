import { useEffect, useRef, useState } from 'react';
import { supabasePublic as supabase } from '../lib/Supabase';

// How often to re-check admissions_settings while the tab is visible.
// Short enough that a change made in the admin dashboard shows up on
// the public site within a few seconds, long enough not to hammer
// Supabase.
const POLL_INTERVAL_MS = 5000;

export function useAdmissionsSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const settingsRef = useRef(null); // avoids re-rendering when nothing changed

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const fetchSettings = async ({ isInitial } = {}) => {
      if (isInitial) setLoading(true);
      try {
        const { data, error } = await supabase
          .from('admissions_settings')
          .select('intake_year, is_open')
          .eq('id', 1)
          .single();

        if (error) throw error;
        if (cancelled) return;

        const prev = settingsRef.current;
        const changed =
          !prev || prev.intake_year !== data.intake_year || prev.is_open !== data.is_open;

        if (changed) {
          settingsRef.current = data;
          setSettings(data);
        }
        setError('');
      } catch (err) {
        console.error('Failed to load admissions settings:', err);
        if (!cancelled) setError('Failed to load admissions status.');
      } finally {
        if (isInitial && !cancelled) setLoading(false);
      }
    };

    fetchSettings({ isInitial: true });

    // Poll on an interval while the tab is visible.
    const startPolling = () => {
      if (intervalId) return;
      intervalId = setInterval(() => fetchSettings(), POLL_INTERVAL_MS);
    };
    const stopPolling = () => {
      clearInterval(intervalId);
      intervalId = undefined;
    };

    startPolling();

    // Pause polling when the tab is hidden (saves requests), and do an
    // immediate refetch the moment the person switches back to the tab
    // or refocuses the window — covers the common case of an admin
    // flipping the toggle in another tab and switching back to check.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSettings();
        startPolling();
      } else {
        stopPolling();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', fetchSettings);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', fetchSettings);
    };
  }, []);

  return { settings, loading, error };
}