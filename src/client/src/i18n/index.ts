/**
 * pi-web i18n module
 * Simple key-based translation with browser language auto-detection.
 */

export type Locale = "en" | "zh-CN";

export interface I18nMessages {
  [key: string]: string;
}

const messages: Record<Locale, I18nMessages> = {
  en: {},
  "zh-CN": {},
};

let currentLocale: Locale = "zh-CN";

/**
 * Detect browser language, return matched locale.
 * Falls back to "en" for unsupported languages.
 */
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "zh-CN";
  const lang = navigator.language;
  if (lang.startsWith("zh")) return "zh-CN";
  return "zh-CN";
}

/**
 * Set the active locale and re-render if needed.
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
  // Store preference
  try {
    localStorage.setItem("pi-web-locale", locale);
  } catch { /* ignore */ }
}

/**
 * Get the stored or detected locale.
 */
export function getLocale(): Locale {
  // Force zh-CN for pi-web-zh
  return "zh-CN";
}

/**
 * Register translation messages for a locale.
 * Call multiple times to merge messages from different modules.
 */
export function registerMessages(locale: Locale, msgs: I18nMessages): void {
  Object.assign(messages[locale], msgs);
}

/**
 * Translate a key. Supports {0}, {1}, ... placeholders.
 * Falls back to key itself if translation missing.
 */
export function t(key: string, ...args: (string | number)[]): string {
  const currentMsgs: I18nMessages = messages[currentLocale];
  const fallbackMsgs: I18nMessages = messages.en;
  const msg = (currentMsgs[key] ?? fallbackMsgs[key] ?? key) as string;
  if (args.length === 0) return msg;
  return msg.replace(/\{(\d+)\}/g, (_match, idx) => {
    const i = parseInt(idx, 10);
    return i < args.length ? String(args[i]) : `{${idx}}`;
  });
}

// Initialize locale on module load
currentLocale = getLocale();

// Export as default for convenience
export default t;
