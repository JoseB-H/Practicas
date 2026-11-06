import { useEffect, useState } from 'react';
import { request } from '../api';

export function useRemote<T>(path: string | null) {
  const [state, setState] = useState<{
    path: string | null;
    data: T | null;
    error: string;
    loading: boolean;
  }>({ path: null, data: null, error: '', loading: true });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    if (!path) return;
    setState({ path, data: null, error: '', loading: true });
    request<T>(path)
      .then((data) => {
        if (active) setState({ path, data, error: '', loading: false });
      })
      .catch((error) => {
        if (active)
          setState({ path, data: null, error: error.message, loading: false });
      });
    return () => {
      active = false;
    };
  }, [path, attempt]);
  return {
    ...(state.path === path
      ? state
      : { path, data: null, error: '', loading: true }),
    retry: () => setAttempt((current) => current + 1),
  };
}
