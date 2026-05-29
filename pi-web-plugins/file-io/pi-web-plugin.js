function esc(s) {
  var d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
}

var UPLOAD_DIR = ".uploads";

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function treeUrl(pid, wid) {
  return "/api/projects/" + encodeURIComponent(pid) +
    "/workspaces/" + encodeURIComponent(wid) +
    "/tree?path=" + encodeURIComponent(UPLOAD_DIR);
}

function uploadUrl(pid, wid) {
  return "/api/projects/" + encodeURIComponent(pid) +
    "/workspaces/" + encodeURIComponent(wid) +
    "/file/upload?path=" + encodeURIComponent(UPLOAD_DIR);
}

function downloadUrl(pid, wid, name) {
  return "/api/projects/" + encodeURIComponent(pid) +
    "/workspaces/" + encodeURIComponent(wid) +
    "/file/download?path=" + encodeURIComponent(UPLOAD_DIR + "/" + name);
}

function buildHTML(files, error, uploading, selected) {
  var h = '';

  h += '<div class="upload-zone" style="border:2px dashed var(--pi-border,#30363d);border-radius:8px;padding:12px;margin:8px 12px;text-align:center;cursor:pointer;transition:border-color .2s;">';
  if (uploading) {
    h += '<p style="margin:0;opacity:0.7;">⏳ 上传中...</p>';
  } else {
    h += '<p style="margin:0;opacity:0.5;font-size:13px;">拖拽文件到此处 或 点击选择</p>';
  }
  h += '<input type="file" multiple style="display:none;">';
  h += '</div>';

  if (error) {
    h += '<div style="padding:0 12px;"><p style="color:var(--pi-danger);font-size:12px;">' + esc(error) + '</p></div>';
  }

  // Selection bar
  var selCount = selected.size;
  if (selCount > 0) {
    h += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;margin:0 12px 8px;background:var(--pi-accent,#58a6ff);color:#fff;border-radius:6px;font-size:12px;">';
    h += '<span style="font-weight:600;">已选 ' + selCount + ' 个</span>';
    h += '<button data-action="copy-selected" style="padding:2px 8px;font-size:12px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:3px;cursor:pointer;">📋 复制路径</button>';
    h += '<button data-action="download-selected" style="padding:2px 8px;font-size:12px;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:3px;cursor:pointer;">⬇️ 全部下载</button>';
    h += '</div>';
  }

  if (files.length === 0 && !uploading) {
    h += '<div style="padding:0 12px;"><p class="muted" style="font-size:12px;">暂无上传文件</p></div>';
  } else if (files.length > 0) {
    h += '<div style="padding:8px 12px;">';
    h += '<div style="display:flex;align-items:center;gap:8px;font-size:11px;opacity:0.5;margin-bottom:6px;">';
    h += '<span>' + UPLOAD_DIR + '/ (' + files.length + ')</span>';
    h += '<label style="cursor:pointer;margin-left:auto;"><input type="checkbox" data-action="select-all" style="vertical-align:middle;"> 全选</label>';
    h += '</div>';
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var path = UPLOAD_DIR + '/' + f.name;
      var sel = selected.has(f.name);
      var bg = sel ? 'background:var(--pi-selection-bg,#0d2847);border-radius:4px;' : '';
      h += '<div draggable="true" data-path="' + esc(path) + '" data-name="' + esc(f.name) + '" style="display:flex;align-items:center;gap:8px;padding:3px 8px;font-size:13px;border-bottom:1px solid var(--pi-border-muted,#21262d);cursor:grab;' + bg + '">';
      h += '<input type="checkbox" data-select="' + esc(f.name) + '" style="flex-shrink:0;cursor:pointer;"' + (sel ? ' checked' : '') + '>';
      h += '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(path) + '">📄 ' + esc(f.name) + '</span>';
      h += '<span style="font-size:11px;opacity:0.5;white-space:nowrap;">' + formatSize(f.size) + '</span>';
      h += '<button data-copy="' + esc(path) + '" style="padding:1px 6px;font-size:11px;border:1px solid var(--pi-border);background:var(--pi-surface);color:var(--pi-text);border-radius:3px;cursor:pointer;" title="复制路径">📋</button>';
      h += '<button data-download="' + esc(f.name) + '" style="padding:1px 6px;font-size:11px;border:1px solid var(--pi-border);background:var(--pi-surface);color:var(--pi-text);border-radius:3px;cursor:pointer;" title="下载">⬇️</button>';
      h += '</div>';
    }
    h += '</div>';
  }

  return h;
}

async function fetchFiles(pid, wid) {
  try {
    var r = await fetch(treeUrl(pid, wid));
    if (!r.ok) return { files: [], error: "HTTP " + r.status };
    var data = await r.json();
    var entries = data.entries || data;
    var files = Array.isArray(entries) ? entries.filter(function(f) { return f.type !== "directory"; }) : [];
    return { files: files, error: null };
  } catch (e) {
    return { files: [], error: e.message };
  }
}

class FileIoEl extends HTMLElement {
  connectedCallback() {
    var self = this;
    this._pid = this.getAttribute("project-id");
    this._wid = this.getAttribute("workspace-id");
    this._files = [];
    this._error = null;
    this._uploading = false;
    this._selected = new Set();

    self.innerHTML = '<div style="padding:12px;"><p class="muted">加载中...</p></div>';

    var load = function() {
      fetchFiles(self._pid, self._wid).then(function(r) {
        self._files = r.files;
        self._error = r.error;
        var names = new Set(self._files.map(function(f) { return f.name; }));
        self._selected.forEach(function(n) { if (!names.has(n)) self._selected.delete(n); });
        self.innerHTML = buildHTML(self._files, self._error, self._uploading, self._selected);
        self._bindEvents();
      });
    };

    load();
    this._interval = setInterval(load, 30000);
  }

  _bindEvents() {
    var self = this;
    var zone = self.querySelector(".upload-zone");
    var input = self.querySelector("input[type=file]");
    if (!zone || !input) return;

    zone.addEventListener("click", function() {
      if (!self._uploading) input.click();
    });

    input.addEventListener("change", function() {
      var files = input.files;
      if (!files || files.length === 0) return;
      self._uploadFiles(files);
      input.value = "";
    });

    zone.addEventListener("dragover", function(e) { e.preventDefault(); zone.style.borderColor = "var(--pi-accent,#58a6ff)"; });
    zone.addEventListener("dragleave", function() { zone.style.borderColor = ""; });
    zone.addEventListener("drop", function(e) {
      e.preventDefault();
      zone.style.borderColor = "";
      var files = e.dataTransfer.files;
      if (files && files.length > 0) self._uploadFiles(files);
    });

    // Drag file path to chat (bind once)
    if (!this._dragBound) {
      this._dragBound = true;
      self.addEventListener("dragstart", function(e) {
        var row = e.target.closest("[data-path]");
        if (!row) return;
        e.dataTransfer.setData("text/plain", row.dataset.path);
        e.dataTransfer.effectAllowed = "copy";
        row.style.opacity = "0.5";
      });
      self.addEventListener("dragend", function(e) {
        var row = e.target.closest("[data-path]");
        if (row) row.style.opacity = "";
      });
    }

    // Delegated clicks: buttons + checkboxes (bind once)
    if (!this._delegatedBound) {
      this._delegatedBound = true;
      self.addEventListener("click", function(e) {
        // Action buttons (select bar)
        var btn = e.target.closest("button[data-action]");
        if (btn) {
          if (btn.dataset.action === "copy-selected") {
            var paths = [];
            self._selected.forEach(function(n) { paths.push(UPLOAD_DIR + "/" + n); });
            navigator.clipboard.writeText(paths.join("\n")).then(function() {
              var orig = btn.textContent;
              btn.textContent = "✅ 已复制";
              setTimeout(function() { btn.textContent = orig; }, 1500);
            }).catch(function() {});
            return;
          }
          if (btn.dataset.action === "download-selected") {
            self._selected.forEach(function(n) {
              var a = document.createElement("a");
              a.href = downloadUrl(self._pid, self._wid, n);
              a.download = n;
              a.click();
            });
            return;
          }
          return;
        }

        // Download button
        btn = e.target.closest("button[data-download]");
        if (btn) {
          var a = document.createElement("a");
          a.href = downloadUrl(self._pid, self._wid, btn.dataset.download);
          a.download = btn.dataset.download;
          a.click();
          return;
        }

        // Copy button
        btn = e.target.closest("button[data-copy]");
        if (btn) {
          navigator.clipboard.writeText(btn.dataset.copy).then(function() {
            var orig = btn.textContent;
            btn.textContent = "✅";
            setTimeout(function() { btn.textContent = orig; }, 1500);
          }).catch(function() {});
          return;
        }
      });

      // Checkbox changes (delegated on self)
      self.addEventListener("change", function(e) {
        var cb = e.target.closest("input[type=checkbox][data-select]");
        if (cb) {
          var name = cb.dataset.select;
          if (cb.checked) self._selected.add(name);
          else self._selected.delete(name);
          self.innerHTML = buildHTML(self._files, self._error, self._uploading, self._selected);
          self._bindEvents();
          return;
        }
        cb = e.target.closest("input[type=checkbox][data-action=select-all]");
        if (cb) {
          if (cb.checked) {
            for (var i = 0; i < self._files.length; i++) self._selected.add(self._files[i].name);
          } else {
            self._selected.clear();
          }
          self.innerHTML = buildHTML(self._files, self._error, self._uploading, self._selected);
          self._bindEvents();
          return;
        }
      });
    }
  }

  async _uploadFiles(files) {
    var self = this;
    self._uploading = true;
    self._error = null;
    self.innerHTML = buildHTML(self._files, self._error, self._uploading, self._selected);
    self._bindEvents();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      try {
        var base64 = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function() { resolve(reader.result.split(",")[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        var r = await fetch(uploadUrl(self._pid, self._wid), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, content: base64 })
        });
        if (!r.ok) {
          var err = await r.json().catch(function() { return {}; });
          throw new Error(err.error || "上传失败");
        }
      } catch (e) {
        self._error = file.name + ": " + (e.message || "上传失败");
        break;
      }
    }

    self._uploading = false;
    var r = await fetchFiles(self._pid, self._wid);
    self._files = r.files;
    if (!self._error && r.error) self._error = r.error;
    self.innerHTML = buildHTML(self._files, self._error, self._uploading, self._selected);
    self._bindEvents();
  }

  disconnectedCallback() {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
  }
}

if (!customElements.get("file-io-el")) {
  customElements.define("file-io-el", FileIoEl);
}

var plugin = {
  apiVersion: 1,
  name: "File I/O Plugin",
  activate: function(ctx) {
    return {
      contributions: {
        workspacePanels: [{
          id: "file-io.main",
          title: "📁 文件",
          order: 40,
          render: function(c) {
            return ctx.html`<file-io-el project-id="${c.workspace.projectId}" workspace-id="${c.workspace.id}"></file-io-el>`;
          },
        }],
      },
    };
  },
};
export default plugin;
