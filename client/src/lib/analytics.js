// Hotjar analytics, loaded only after the player agrees in the consent banner.
// Skipped on localhost so local testing stays out of the data.
const CONSENT_KEY = 'copy-quest:analytics-consent';
const HOTJAR_ID = 6790618;

export function loadConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } // 'granted' | 'denied' | null
}

export function saveConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage unavailable */ }
}

let loaded = false;
export function startHotjar() {
  if (loaded || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return;
  loaded = true;
  // Hotjar Tracking Code for Copywriting Game
  (function (h, o, t, j, a, r) {
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
    h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script'); r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}
