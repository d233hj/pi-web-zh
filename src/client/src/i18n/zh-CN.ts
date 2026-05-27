/**
 * Simplified Chinese (zh-CN) messages for pi-web
 */
import { registerMessages } from "./index";

registerMessages("zh-CN", {
  // Navigation / Projects
  "project.noProject": "无项目",
  "project.noProjectSelected": "未选择项目",
  "project.emptyTitle": "暂无项目",
  "project.emptyBody": "使用 操作 → 添加项目 来添加文件夹。选择工作区后，工作区工具将显示在此处。",
  "project.selectTitle": "选择项目",
  "project.selectBody": "从侧边栏选择一个项目，然后选择工作区以查看文件、Git 或终端。",
  "project.loading": "正在加载项目…",
  "project.loadingBody": "正在查找您已添加到 PI WEB 的项目。",

  // Workspaces
  "workspace.noWorkspace": "无工作区",
  "workspace.noWorkspaceSelected": "未选择工作区",
  "workspace.loading": "正在加载工作区…",
  "workspace.noWorkspacesFound": "未找到工作区",
  "workspace.selectWorkspace": "选择工作区",
  "workspace.selectBody": "选择一个工作区以查看文件、Git 或终端。",
  "workspace.main": " · 主分支",
  "workspace.toolsUnavailable": "工作区工具不可用",
  "workspace.toolsUnavailableBody": "请尝试重新选择工作区。",
  "workspace.noToolsAvailable": "无可用的工作区工具",
  "workspace.noToolsAvailableBody": "此工作区没有可用的工具。",

  // Sessions
  "session.noSession": "无会话",
  "session.noSessionSelected": "未选择会话",
  "session.selectOrStart": "选择或启动一个会话。",
  "session.selectWorkspaceToStart": "选择一个工作区以启动会话。",
  "session.addProjectToStart": "添加一个项目以启动会话。",
  "session.selectProjectAndWorkspace": "选择一个项目和工作区以启动会话。",

  // Status prompts
  "status.promptSelect": "选择一个项目和工作区以启动会话。",

  // Errors
  "error.onlySecondaryGitWorktrees": "只能删除辅助 Git 工作树",
  "error.projectMainWorkspaceNotFound": "未找到项目主工作区",
  "error.workspaceDeletionFailed": "工作区删除失败，请查看终端输出。",

  // Dialogs
  "dialog.selectModel": "选择模型",
  "dialog.selectTheme": "选择主题",
  "dialog.selectThinkingLevel": "选择思考级别",
  "dialog.configureAuth": "配置提供商认证",
  "dialog.selectAuth": "选择提供商认证",
  "dialog.selectSubscription": "选择订阅提供商",
  "dialog.selectApiKey": "选择 API Key 提供商",
  "dialog.subscription": "订阅",
  "dialog.apiKey": "API Key",
  "dialog.cancel": "取消",
  "dialog.saving": "保存中…",
  "dialog.saveApiKey": "保存 API Key",
  "dialog.close": "关闭",

  // Thinking levels
  "thinking.off": "无推理",
  "thinking.minimal": "极简推理 (~1k tokens)",
  "thinking.low": "轻度推理 (~2k tokens)",
  "thinking.medium": "中度推理 (~8k tokens)",
  "thinking.high": "深度推理 (~16k tokens)",
  "thinking.xhigh": "最大推理 (~32k tokens)",

  // Theme
  "theme.autoOffDesc": "当所选主题有明暗配对时，跟随系统明暗偏好。",
  "theme.autoOnNoPair": "已开启，但所选主题没有明暗配对，将保持不变。",

  // Auth
  "auth.apiKeyRequired": "API Key 为必填项",
  "auth.logoutTitle": "移除已存储的提供商认证",
  "auth.apiKeyPlaceholder": "API Key",

  // App refresh
  "refresh.refreshing": "正在刷新应用数据。长按查看重载选项。",
  "refresh.normal": "刷新应用数据。长按查看重载选项。",

  // Actions
  "actions.showActions": "显示操作",
  "actions.label": "操作",
  "actions.searchPlaceholder": "搜索操作…",

  // Composer / Prompt Editor
  "composer.placeholder": "输入消息…",
  "composer.send": "发送",
  "composer.queue": "排队",
  "composer.queueTitle": "等待当前活动完成后发送",
  "composer.steer": "引导",
  "composer.steerTitle": "在下一次模型调用前引导当前响应",
  "composer.stop": "停止",
  "composer.stopTitle": "停止当前工作并清除排队消息",
  "composer.nothingRunning": "无运行中的任务",
  "composer.selectModel": "选择模型",
  "composer.selectThinking": "选择思考级别",

  // Chat
  "chat.lateArrival1": "您在助手正在回复时打开了此对话。完整回复即将出现。",
  "chat.lateArrival2": "我们在半途加入。等完整回复就绪后再揭晓。",
  "chat.lateArrival3": "助手在这个标签页打开前就开始回复了。完整回复到达后我们会立即展示。",
  "chat.lateArrival4": "正在捕获完整回复——没有剧透，没有半截答案。",
  "chat.lateArrival5": "Token 还在组装中。完整回复马上就到。",
  "chat.lateArrival6": "我们来晚了一步。完整版本即将出现。",
  "chat.steer": "引导",
  "chat.followUp": "跟进",
  "chat.noInfo": "无信息",
  "chat.noMetadata": "无 Pi 消息元数据",
  "chat.copied": "已复制",
  "chat.copy": "复制消息",

  // Session List
  "sessionList.sessionActions": "会话操作",
  "sessionList.detachFromParent": "断开父级关联",
  "sessionList.delete": "删除",
  "sessionList.restore": "恢复",
  "sessionList.archive": "归档",
  "sessionList.archiveWithDescendants": "归档及其子会话",
  "sessionList.sessionActive": "会话活跃",
  "sessionList.noSessionSelected": "未选择会话",

  // Workspace List
  "workspaceList.workspaces": "工作区",
  "workspaceList.noWorkspaceSelected": "未选择工作区",
  "workspaceList.actionsAndDetails": "工作区操作和详情",
  "workspaceList.deleteWorkspace": "删除工作区",
  "workspaceList.deleting": "删除中…",
  "workspaceList.deletionInProgress": "工作区删除进行中",
  "workspaceList.workspace": "工作区",
  "workspaceList.branch": "分支",
  "workspaceList.terminalActive": "工作区终端活跃",
  "workspaceList.active": "工作区活跃",

  // Project List
  "projectList.projects": "项目",
  "projectList.noProjectSelected": "未选择项目",
  "projectList.close": "关闭",
  "projectList.closeProject": "关闭项目",
  "projectList.terminalActive": "项目终端活跃",
  "projectList.active": "项目活跃",

  // Terminal Panel
  "terminal.cancelCommand": "取消命令",
  "terminal.cancelSent": "取消已发送…",
  "terminal.continueInShell": "在 Shell 中继续",
  "terminal.startingShell": "正在启动 Shell…",
  "terminal.invalidMessage": "无效的终端消息",

  // Tool Execution / Diff
  "diff.previewDiff": "预览差异",
  "diff.appliedDiff": "已应用的差异",
  "diff.fullDiff": "完整差异",
  "diff.copyDiff": "复制差异",
  "diff.copied": "已复制",
  "diff.showingLines": "显示 {0} / {1} 行",

  // Code blocks
  "code.copyCodeBlock": "复制代码块",
  "code.copiedCodeBlock": "已复制代码块",
  "code.failedToCopy": "复制代码块失败",

  // Navigation tabs
  "nav.sessions": "会话",
  "nav.chat": "对话",

  // Refresh menu
  "refresh.fullReload": "完全刷新页面",

  // Context bar
  "context.location": "位置",
  "context.project": "项目",
  "context.workspace": "工作区",
  "context.session": "会话",

  // Shared / General
  "general.select": "选择",
  "general.search": "搜索",
  "general.workspace": "工作区",
  "general.branch": "分支",
  "general.main": "主分支",
  "general.active": "活跃",

  // Status bar
  "status.noStatus": "暂无会话状态",
  "status.contextUnknown": "上下文未知",
  "status.queued": "个排队中",

  // Workspace panels
  "panels.files": "文件",
  "panels.git": "Git",
  "panels.terminal": "终端",
  "panels.stale": "已过期",
  "panels.refresh": "刷新",
  "panels.noFilesLoaded": "未加载文件。",
  "panels.selectFile": "选择一个文件。",
  "panels.loadingFile": "正在加载 {0}…",
  "panels.binaryFile": "二进制文件: {0} · {1}",
  "panels.text": "文本",
  "panels.truncatedSuffix": " · 已截断",
  "panels.imageTooLarge": "图片过大无法预览: {0} · 限制 {1}",
  "panels.noGitStatus": "未加载状态。",
  "panels.notGitRepo": "不是 Git 仓库。",
  "panels.noChanges": "无变更。",
  "panels.selectChangedFile": "选择一个已变更的文件。",
  "panels.loadingDiff": "正在加载差异…",
  "panels.noDiff": "无暂存或未暂存的差异。",
  "panels.diff": "差异",
  "panels.staged": "已暂存",
  "panels.unstaged": "未暂存",
  "panels.detached": "游离状态",

  // Action palette groups
  "actions.openPalette": "打开命令面板",
  "actions.focusPrompt": "聚焦输入框",
  "actions.focusPromptDesc": "将键盘焦点移至消息输入框",
  "actions.addProject": "添加项目",
  "actions.configureAuth": "配置提供商认证",
  "actions.configureAuthDesc": "运行 /login 而不将会话绑定到认证",
  "actions.removeAuth": "移除提供商认证",
  "actions.removeAuthDesc": "运行 /logout 清除已存储的 pi 凭证",
  "actions.selectTheme": "选择主题",
  "actions.selectThemeDesc": "选择 PI WEB 颜色主题",
  "actions.refreshAppData": "刷新应用数据",
  "actions.refreshAppDataDesc": "刷新会话、状态、活动及当前工作区界面，无需重载页面",
  "actions.fullPageReload": "完全刷新页面",
  "actions.fullPageReloadDesc": "重新加载 PI WEB 浏览器页面",
  "actions.goToChat": "前往对话",
  "actions.goToFiles": "前往文件",
  "actions.goToGit": "前往 Git",
  "actions.goToTerminal": "前往终端",
  "actions.refreshFiles": "刷新文件",
  "actions.refreshGit": "刷新 Git",
  "actions.refreshCurrentPanel": "刷新当前面板",
  "actions.deleteWorkspace": "删除工作区",
  "actions.deleteWorkspaceDesc": "移除选中的 Git 工作树",
  "actions.startSession": "启动会话",
  "actions.archiveSession": "归档会话",
  "actions.archiveSessionDesc": "归档选中的会话",
  "actions.stopActiveWork": "停止当前任务",
  "actions.groupGeneral": "通用",
  "actions.groupProject": "项目",
  "actions.groupPreferences": "偏好设置",
  "actions.groupNavigation": "导航",
  "actions.groupWorkspace": "工作区",
  "actions.groupSession": "会话",

  // Shell messages
  "shell.noOutput": "（无输出）",
  "shell.commandFailed": "Bash 命令执行失败",
  "shell.cancelled": "已取消",
  "shell.truncated": "输出已截断",
  "shell.fullOutput": "完整输出",
});
