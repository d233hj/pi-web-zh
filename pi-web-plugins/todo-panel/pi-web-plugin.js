const STATUS_ICONS = {
  todo: "○",
  doing: "◐",
  done: "●",
  blocked: "⚠",
  deferred: "→",
  cancelled: "✕",
};

const STATUS_LABELS = {
  todo: "待办",
  doing: "进行中",
  done: "已完成",
  blocked: "阻塞",
  deferred: "推迟",
  cancelled: "取消",
};

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function parseTodoMarkdown(md) {
  const items = [];
  const categories = [];
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
      const marker = todoMatch[1];
      const statusMap = { "[ ]": "todo", "[~]": "doing", "[x]": "done", "[!]": "blocked", "[>]": "deferred", "[-]": "cancelled" };
      items.push({
        text: todoMatch[2].trim(),
        status: statusMap[marker] || "todo",
        category: currentCategory,
      });
    }
  }
  return { items, categories };
}

function escapeHtml(text) {
  const el = document.createElement("div");
  el.textContent = text;
  return el.innerHTML;
}

async function fetchTodos(projectId, workspaceId) {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  const paths = [];
  for (let w = week; w >= week - 3; w--) {
    paths.push(`knowledge/todos/${year}-W${String(w).padStart(2, "0")}.md`);
  }

  for (const filePath of paths) {
    try {
      const url = `/api/projects/${encodeURIComponent(projectId)}/workspaces/${encodeURIComponent(workspaceId)}/file?path=${encodeURIComponent(filePath)}`;
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data.binary || !data.content) continue;
      const parsed = parseTodoMarkdown(data.content);
      return { ...parsed, filePath, error: null };
    } catch (e) {
      console.error("todo-panel fetch error:", e);
      continue;
    }
  }
  return { items: [], filePath: null, error: "未找到待办文件\nknowledge/todos/" + year + "-W" + String(week).padStart(2, "0") + ".md" };
}

class TodoPanelElement extends HTMLElement {
  constructor() {
    super();
    this._projectId = "";
    this._workspaceId = "";
  }

  setContext(projectId, workspaceId) {
    this._projectId = projectId;
    this._workspaceId = workspaceId;
    this.load();
  }

  async load() {
    this.innerHTML = '<div style="padding:12px;"><p class="muted">加载中...</p></div>';
    try {
      const result = await fetchTodos(this._projectId, this._workspaceId);
      this.innerHTML = this.buildHTML(result);
    } catch (e) {
      this.innerHTML = '<div style="padding:12px;"><p class="muted">加载失败: ' + escapeHtml(String(e)) + '</p></div>';
    }
  }

  buildHTML(result) {
    if (result.error && result.items.length === 0) {
      const fileInfo = result.filePath ? '' : '<br><small>' + escapeHtml(result.error) + '</small>';
      return '<section class="toolbar"><strong>📋 待办</strong></section>' +
        '<section class="viewer" style="padding:12px;"><p class="muted">暂无待办' + fileInfo + '</p></section>';
    }

    const activeItems = result.items.filter(i => i.status !== "done" && i.status !== "cancelled");
    const doneItems = result.items.filter(i => i.status === "done" || i.status === "cancelled");
    const counts = {};
    for (const item of activeItems) counts[item.status] = (counts[item.status] || 0) + 1;

    let toolbar = '<section class="toolbar"><strong>📋 待办</strong>';
    if (counts.todo) toolbar += ' <span style="font-size:11px;opacity:0.7;">' + counts.todo + '待办</span>';
    if (counts.blocked) toolbar += ' <span style="font-size:11px;opacity:0.7;color:var(--pi-error,#e74c3c);">' + counts.blocked + '阻塞</span>';
    toolbar += '<button id="' + this._refreshBtnId() + '" style="margin-left:auto;border:none;background:none;cursor:pointer;font-size:12px;opacity:0.5;" title="刷新">🔄</button>';
    toolbar += '</section>';

    let body = '<section class="viewer" style="padding:8px 12px;">';
    if (activeItems.length === 0) body += '<p class="muted">全部完成 🎉</p>';

    for (const item of activeItems) {
      const icon = STATUS_ICONS[item.status] || "○";
      const label = STATUS_LABELS[item.status] || "";
      const opacity = item.status === "deferred" ? "0.5" : "1";
      body += '<div style="display:flex;align-items:flex-start;gap:6px;padding:2px 0;opacity:' + opacity + ';font-size:13px;" title="' + label + '">';
      body += '<span style="flex-shrink:0;width:18px;text-align:center;">' + icon + '</span>';
      body += '<span>' + escapeHtml(item.text) + '</span>';
      body += '</div>';
    }

    if (doneItems.length > 0) {
      body += '<details style="margin-top:8px;font-size:12px;opacity:0.6;">';
      body += '<summary>已完成 (' + doneItems.length + ')</summary>';
      for (const item of doneItems) {
        body += '<div style="padding:1px 0;text-decoration:line-through;">' + escapeHtml(item.text) + '</div>';
      }
      body += '</details>';
    }

    if (result.filePath) {
      body += '<p style="margin-top:8px;font-size:11px;opacity:0.4;">📄 ' + escapeHtml(result.filePath) + '</p>';
    }
    body += '</section>';

    return toolbar + body;
  }

  _refreshBtnId() {
    return "todo-refresh-" + (this.getAttribute("data-instance") || "0");
  }

  connectedCallback() {
    const btnId = this._refreshBtnId();
    this.addEventListener("click", (e) => {
      if (e.target && e.target.id === btnId) {
        this.load();
      }
    });
  }
}

if (!customElements.get("todo-panel-el")) {
  customElements.define("todo-panel-el", TodoPanelElement);
}

const plugin = {
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
            const instanceId = Date.now().toString(36);
            const result = _html`<todo-panel-el data-instance="${instanceId}" style="display:block;height:100%;overflow-y:auto;"></todo-panel-el>`;

            setTimeout(() => {
              const el = document.querySelector(`todo-panel-el[data-instance="${instanceId}"]`);
              if (el) {
                el.setContext(_context.workspace.projectId, _context.workspace.id);
              }
            }, 50);

            return result;
          },
        },
      ],
    },
  }),
};

export default plugin;
