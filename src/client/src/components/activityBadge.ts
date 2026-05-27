import { html, type TemplateResult } from "lit";
import { t } from "../i18n/index.js";

export type ActivityIndicatorKind = "session" | "terminal";

export function renderActivityIndicator(kind: ActivityIndicatorKind | undefined, label = t("general.active")): TemplateResult | undefined {
  if (kind === undefined) return undefined;
  return html`<span class=${`activity-indicator ${kind}`} role="img" aria-label=${label} title=${label}></span>`;
}
