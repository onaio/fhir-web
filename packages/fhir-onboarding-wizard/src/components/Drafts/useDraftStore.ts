import { useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';

const STORAGE_PREFIX = 'wizard-draft:';
const storageKeyFor = (stepKey: string) => `${STORAGE_PREFIX}${stepKey}`;

/** other drafts point at a draft as "draft:<draftId>", so a missing or repeated id makes two drafts look like one */
function withUniqueDraftIds<T>(items: T[]): { items: T[]; changed: boolean } {
  const seen = new Set<string>();
  let changed = false;
  const fixed = items.map((item) => {
    const id = (item as { draftId?: string } | null)?.draftId;
    if (id && !seen.has(id)) {
      seen.add(id);
      return item;
    }
    changed = true;
    const draftId = v4();
    seen.add(draftId);
    return { ...(item as object), draftId } as T;
  });
  return { items: fixed, changed };
}

function loadDrafts<T>(stepKey: string): T[] {
  try {
    const raw = sessionStorage.getItem(storageKeyFor(stepKey));
    const { items, changed } = withUniqueDraftIds(raw ? (JSON.parse(raw) as T[]) : []);
    if (changed) sessionStorage.setItem(storageKeyFor(stepKey), JSON.stringify(items));
    return items;
  } catch {
    return [];
  }
}

export function useDraftStore<T>(stepKey: string) {
  const storageKey = storageKeyFor(stepKey);
  const [drafts, setDrafts] = useState<T[]>(() => loadDrafts<T>(stepKey));

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(drafts));
  }, [storageKey, drafts]);

  const addDraft = useCallback((item: T, editIndex?: number) => {
    setDrafts((prev) => {
      if (editIndex !== undefined) {
        const next = [...prev];
        next[editIndex] = item;
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeDraft = useCallback((index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { drafts, addDraft, removeDraft };
}

export function readDrafts<T>(stepKey: string): T[] {
  return loadDrafts<T>(stepKey);
}

export function clearAllDrafts() {
  Object.keys(sessionStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => sessionStorage.removeItem(k));
}