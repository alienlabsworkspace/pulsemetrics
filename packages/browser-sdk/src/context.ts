interface BrowserContext {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: 'desktop' | 'mobile' | 'tablet';
  screenWidth: number;
  screenHeight: number;
  language: string;
  timezone: string;
}

export function detectContext(): BrowserContext {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      browser: 'unknown', browserVersion: '',
      os: 'unknown', osVersion: '',
      device: 'desktop',
      screenWidth: 0, screenHeight: 0,
      language: 'en', timezone: 'UTC',
    };
  }

  const ua = navigator.userAgent;

  return {
    browser: detectBrowser(ua),
    browserVersion: detectBrowserVersion(ua),
    os: detectOS(ua),
    osVersion: detectOSVersion(ua),
    device: detectDevice(ua),
    screenWidth: window.screen?.width ?? 0,
    screenHeight: window.screen?.height ?? 0,
    language: navigator.language ?? 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
  };
}

function detectBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
}

function detectBrowserVersion(ua: string): string {
  const match = ua.match(/(Chrome|Firefox|Safari|Edg|OPR)\/(\d+)/);
  return match?.[2] ?? '';
}

function detectOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

function detectOSVersion(ua: string): string {
  const match = ua.match(/(?:Windows NT|Mac OS X|Android) (\d+[\d._]*)/);
  return match?.[1]?.replace(/_/g, '.') ?? '';
}

function detectDevice(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}
