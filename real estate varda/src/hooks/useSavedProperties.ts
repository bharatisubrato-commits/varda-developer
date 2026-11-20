import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'vadra_saved_properties';

export function useSavedProperties() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  const toggleSaved = useCallback((propertyId: string) => {
    setSavedIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const isSaved = useCallback(
    (propertyId: string) => savedIds.includes(propertyId),
    [savedIds]
  );

  return { savedIds, toggleSaved, isSaved };
}
