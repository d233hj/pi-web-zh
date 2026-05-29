import type { PiWebPlugin } from "../../src/client/src/plugins/types";

interface TodoItem {
  text: string;
  status: "todo" | "doing" | "done" | "blocked" | "deferred" | "cancelled";
  category: string;
}

const STATUS_MAP: Record<string, TodoItem["status"]> = {
  "[ ]": "todo",
  "[~]": "doing",
  "[x]": "done",
  "[!]": "blocked",
  "[>]": "deferred",
  "[-]": "cancelled",
};

const STATUS_ICONS: Record<string, string> = {
  todo: "○",
  doing: "◐",
  done: "●",
  blocked: "⚠",
  deferred: "→",
  cancelled: "✕",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "待办",
  doing: "进行中",
  done: "已完成",
  blocked: "阻塞",
  deferred: "推迟",
  cancelled: "取消",
};

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function todoFilePaths(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  const paths: string[] = [];
  for (let w = week; w >= week - 3; w--) {
    const wStr = String(w).padStart(2, "0");
    paths.push(`knowledge/todos/${year}-W${wStr}.md`);
  }
  return paths;
}

function parseTodoMarkdown(md: string): { items: TodoItem[]; categories: string[] } {
  const items: TodoItem[] = [];
  const categories: string[] = [];
  let currentCategory = "";
  const lines = md.split("\n");

  for (const line of lines) {
    const catMatch = line.match(/^##\s+(.+)/);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      categories.push(currentCategory);
      continue;
    }
    const todoMatch = line.match(/^\s*[-*]\s+(\[[- x~!>]\])\s+(.+)/);
    if (todoMatch && currentCategory) {
      items.push({
        text: todoMatch[2].trim(),
        status: STATUS_MAP[todoMatch[1]] || "todo",
        category: currentCategory,
      });
    }
  }
  return { items, categories };
}

function escapeHtml(text: string): string {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML;
}

async function fetchTodos(projectId: string, workspaceId: string): Promise<{ items: TodoItem[]; filePath: string | null; error: string | null }> {
  const paths = todoFilePaths();
  for (const filePath of paths) {
    try {
      const url = `/api/projects/${encodeURIComponent(projectId)}/workspaces/${encodeURIComponent(workspaceId)}/file?path=${encodeURIComponent(filePath)}`;
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data.binary || !data.content) continue;
      const parsed = parseTodoMarkdown(data.content);
      return { ...parsed, filePath, error: null };
    } catch {
      continue;
    }
  }
  return { items: [], filePath: null, error: "未找到待办文件 (knowledge/todos/)" };
}

function buildHTML(result: { items: TodoItem[]; filePath: string | null; error: string | null }): string {
  if (result.error && result.items.length === 0) {
    return `<section class="toolbar"><strong>📋 待办</strong></section>
      <section class="viewer" style="padding:12px;">
        <p class="muted">${escapeHtml(result.error)}</p>
      </section>`;
  }

  const activeItems = result.items.filter((i) => i.status !== "done" && i.status !== "cancelled");
  const doneItems = result.items.filter((i) => i.status === "done" || i.status === "cancelled");

  // Count badges
  const counts: Record<string, number> = {};
  for (const item of activeItems) counts[item.status] = (counts[item.status] || 0) + 1;

  let badgeStr = "";
  if (counts.todo) badgeStr += ` <span style="font-size:11px;opacity:0.7;">${counts.todo}待办</span>`;
  if (counts.doing) badgeStr += ` <span style="font-size:11px;opacity:0.7;color:var(--pi-accent,#3b82f6);">${counts.doing}进行中</span>`;
  if (counts.blocked) badgeStr += ` <span style="font-size:11px;opacity:0.7;color:var(--pi-error,#e74c3c);">${counts.blocked}阻塞</span>`;

  let html = `<section class="toolbar"><strong>📋 待办</strong>${badgeStr}
    <button onclick="this.closest('[data-todo-panel]').dispatchEvent(new CustomEvent('todo-refresh',{bubbles:true}))" 
      style="margin-left:auto;border:none;background:none;cursor:pointer;font-size:12px;opacity:0.5;" title="刷新">🔄</button>
    </section>`;

  html += `<section class="viewer" style="padding:8px 12px;">`;

  if (activeItems.length === 0 && doneItems.length === 0) {
    html += `<p class="muted">暂无待办</p>`;
  }

  for (const item of activeItems) {
    const icon = STATUS_ICONS[item.status] || "○";
    const label = STATUS_LABELS[item.status] || "待办";
    const opacity = item.status === "deferred" ? "0.5" : "1";
    html += `<div style="display:flex;align-items:flex-start;gap:6px;padding:3px 0;opacity:${opacity};font-size:13px;" title="${label}">`;
    html += `<span style="flex-shrink:0;width:18px;text-align:center;">${icon}</span>`;
    html += `<span>${escapeHtml(item.text)}</span>`;
    html += `</div>`;
  }

  if (doneItems.length > 0) {
    html += `<details style="margin-top:8px;font-size:12px;opacity:0.6;">`;
    html += `<summary>已完成 (${doneItems.length})</summary>`;
    for (const item of doneItems) {
      html += `<div style="padding:2px 0;text-decoration:line-through;">${escapeHtml(item.text)}</div>`;
    }
    html += `</details>`;
  }

  if (result.filePath) {
    html += `<p style="margin-top:8px;font-size:11px;opacity:0.4;">📄 ${escapeHtml(result.filePath)}</p>`;
  }

  html += `</section>`;
  return html;
}

const plugin: PiWebPlugin = {
  apiVersion: 1,
  name: "Todo Panel Plugin",

  activate: ({ html: _html }) => ({
    contributions: {
      workspacePanels: [
        {
          id: "todo-panel.main",
          title: "待办",
          order: 50,
          render: (_context) => {
            // Use template literal directly for the shell, async-populated
            const result = _html`<div data-todo-panel style="height:100%;overflow-y:auto;">加载中...</div>`;

            // Schedule async load via microtask
            queueMicrotask(async () => {
              const projectId = _context.workspace.projectId;
              const workspaceId = _context.workspace.id;
              const data = await fetchTodos(projectId, workspaceId);
              const htmlStr = buildHTML(data);

              // Find and update the DOM element
              const el = document.querySelector(`[data-todo-panel]`);
              if (el) {
                el.innerHTML = htmlStr;
                // Listen for refresh events
                el.addEventListener("todo-refresh", async () => {
                  el.innerHTML = "刷新中...";
                  const fresh = await fetchTodos(projectId, workspaceId);
                  el.innerHTML = buildHTML(fresh);
                });
              }
            });

            return result;
          },
        },
      ],
    },
  }),
};

export default plugin;
