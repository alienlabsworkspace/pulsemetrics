const SESSION_KEY = 'pm_session_id';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return generateId();
  }

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const elapsed = Date.now() - parsed.timestamp;
      if (elapsed < SESSION_DURATION_MS) {
        // Refresh timestamp
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          id: parsed.id,
          timestamp: Date.now(),
        }));
        return parsed.id;
      }
    }
  } catch {
    // Ignore storage errors
  }

  const newId = generateId();
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: newId,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore storage errors
  }

  return newId;
}
