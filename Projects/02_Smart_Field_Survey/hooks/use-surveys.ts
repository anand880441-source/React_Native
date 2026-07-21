/**
 * useSurveys — lightweight in-memory survey store.
 * Shared across screens via module-level state (simple for a mini project).
 */
import { useState, useCallback, useEffect } from 'react';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Survey {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: Priority;
  date: string;           // YYYY-MM-DD
  photoUri?: string;
  capturedAt?: string;    // photo capture time display string
  contactName?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  notes?: string;
  submittedAt?: string;   // ISO string — set on submit
}

// ── Module-level store (persists across component remounts) ────────────────
let _surveys: Survey[] = [
  {
    id: 'SRV-001',
    siteName: 'Swaminarayan Campus',
    clientName: 'Harshil Patel',
    description: 'Annual infrastructure inspection of the main campus buildings.',
    priority: 'High',
    date: new Date().toISOString().split('T')[0],
    latitude: 23.0225,
    longitude: 72.5714,
    accuracy: 8,
    notes: 'Gate lighting needs replacement. Library door hinge broken.',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'SRV-002',
    siteName: 'Rai University',
    clientName: 'Pritesh Bachhav',
    description: 'Quarterly safety audit of the engineering block.',
    priority: 'Medium',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  },
  {
    id: 'SRV-003',
    siteName: 'Swarnim University',
    clientName: 'Trikam Devasi',
    description: 'Lab equipment condition survey.',
    priority: 'Low',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

let _listeners: Array<() => void> = [];

function subscribe(fn: () => void) {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((l) => l !== fn);
  };
}

function notify() {
  _listeners.forEach((fn) => fn());
}

// ── Public store mutators ─────────────────────────────────────────────────
export function addSurvey(survey: Survey) {
  _surveys = [survey, ..._surveys];
  notify();
}

export function deleteSurvey(id: string) {
  _surveys = _surveys.filter((s) => s.id !== id);
  notify();
}

export function updateSurvey(updated: Survey) {
  _surveys = _surveys.map((s) => (s.id === updated.id ? updated : s));
  notify();
}

export function clearAllSurveys() {
  _surveys = [];
  notify();
}

export function getSurveys(): Survey[] {
  return _surveys;
}

export function getSurveyById(id: string): Survey | undefined {
  return _surveys.find((s) => s.id === id);
}

export function generateId(): string {
  return `SRV-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

// ── React hook ────────────────────────────────────────────────────────────
export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>(() => [..._surveys]);

  const refresh = useCallback(() => setSurveys([..._surveys]), []);

  useEffect(() => {
    const unsub = subscribe(refresh);
    // Sync on mount in case store changed since last render
    refresh();
    return unsub;
  }, [refresh]);

  return { surveys, addSurvey, deleteSurvey, updateSurvey, clearAllSurveys };
}
