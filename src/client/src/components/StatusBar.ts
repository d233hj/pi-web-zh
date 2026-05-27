import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { SessionStatus, Workspace } from "../api";
import type { WorkspaceLabelItem } from "../plugins/types";
import { formatCost, formatTokenCount } from "../utils/format";
import { statusBarStyles } from "./shared";
import { t } from "../i18n/index.js";
import { renderWorkspaceLabel } from "./workspaceLabel";

@customElement("status-bar")
export class StatusBar extends LitElement {
  @property({ attribute: false }) status?: SessionStatus;
  @property({ attribute: false }) workspace?: Workspace;
  @property({ attribute: false }) workspaceLabelItems: WorkspaceLabelItem[] = [];

  override render() {
    const status = this.status;
    if (status === undefined) return html`<div class="bar muted">${t("status.noStatus")}</div>`;
    const context = status.contextUsage;
    const contextText = context
      ? context.percent == null
        ? `context ${formatTokenCount(context.contextWindow)}`
        : `${context.percent.toFixed(1)}%/${formatTokenCount(context.contextWindow)}`
      : t("status.contextUnknown");
    const tokens = status.tokens;
    return html`
      <div class="bar">
        <span>${renderWorkspaceLabel(this.workspace?.label ?? "workspace", this.workspaceLabelItems, this.workspace?.path)}</span>
        <span>↑${formatTokenCount(tokens.input)}</span>
        <span>↓${formatTokenCount(tokens.output)}</span>
        <span>${contextText}</span>
        <span>${formatCost(status.cost)}</span>
        ${status.pendingMessageCount > 0 ? html`<span>${String(status.pendingMessageCount)} ${t("status.queued")}</span>` : null}
      </div>
    `;
  }

  static override styles = statusBarStyles;
}
