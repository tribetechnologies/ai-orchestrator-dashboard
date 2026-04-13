import { useState, useEffect, useCallback, useRef } from 'react';
import { POLL_INTERVAL_MS } from '@/lib/constants';

export function usePolling<T>(
  fetcher: () => Promise<T>,
  enabled = true
): { data: T | null; error: string | null; loading: boolean; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const doFetch = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setError(null);
      setLoading(true);
      return;
    }
    doFetch();
    const interval = setInterval(doFetch, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [enabled, doFetch]);

  return { data, error, loading, refresh: doFetch };
}
