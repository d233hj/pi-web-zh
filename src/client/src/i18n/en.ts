/**
 * English messages for pi-web
 */
import { registerMessages } from "./index";

// ============ PiWebApp ============
registerMessages("en", {
  // Navigation / Projects
  "project.noProject": "No project",
  "project.noProjectSelected": "No project selected",
  "project.emptyTitle": "No projects yet",
  "project.emptyBody": "Use Actions → Add Project to add a folder. Workspace tools will appear here after you choose a workspace.",
  "project.selectTitle": "Select a project",
  "project.selectBody": "Choose a project from the sidebar, then select a workspace to inspect files, Git, or terminals.",
  "project.loading": "Loading projects…",
  "project.loadingBody": "Looking for projects you have added to PI WEB.",

  // Workspaces
  "workspace.noWorkspace": "No workspace",
  "workspace.noWorkspaceSelected": "No workspace selected",
  "workspace.loading": "Loading workspaces…",
  "workspace.noWorkspacesFound": "No workspaces found",
  "workspace.selectWorkspace": "Select a workspace",
  "workspace.selectBody": "Choose a workspace to inspect files, Git, or terminals.",
  "workspace.main": " · main",
  "workspace.toolsUnavailable": "Workspace tools unavailable",
  "workspace.toolsUnavailableBody": "Try selecting the workspace again.",
  "workspace.noToolsAvailable": "No workspace tools available",
  "workspace.noToolsAvailableBody": "No tools are available for this workspace.",

  // Sessions
  "session.noSession": "No session",
  "session.noSessionSelected": "No session selected",
  "session.selectOrStart": "Select or start a session.",
  "session.selectWorkspaceToStart": "Select a workspace to start a session.",
  "session.addProjectToStart": "Add a project to start a session.",
  "session.selectProjectAndWorkspace": "Select a project and workspace to start a session.",

  // Status prompts
  "status.promptSelect": "Select a project and workspace to start a session.",

  // Errors
  "error.onlySecondaryGitWorktrees": "Only secondary Git worktrees can be deleted",
  "error.projectMainWorkspaceNotFound": "Project main workspace not found",
  "error.workspaceDeletionFailed": "Workspace deletion failed. See terminal output.",

  // Dialogs
  "dialog.selectModel": "Select Model",
  "dialog.selectTheme": "Select Theme",
  "dialog.selectThinkingLevel": "Select Thinking Level",
  "dialog.configureAuth": "Configure provider authentication",
  "dialog.selectAuth": "Select provider authentication",
  "dialog.selectSubscription": "Select subscription provider",
  "dialog.selectApiKey": "Select API key provider",
  "dialog.subscription": "subscription",
  "dialog.apiKey": "API key",
  "dialog.cancel": "Cancel",
  "dialog.saving": "Saving…",
  "dialog.saveApiKey": "Save API key",
  "dialog.close": "Close",

  // Thinking levels
  "thinking.off": "No reasoning",
  "thinking.minimal": "Very brief reasoning (~1k tokens)",
  "thinking.low": "Light reasoning (~2k tokens)",
  "thinking.medium": "Moderate reasoning (~8k tokens)",
  "thinking.high": "Deep reasoning (~16k tokens)",
  "thinking.xhigh": "Maximum reasoning (~32k tokens)",

  // Theme
  "theme.autoOffDesc": "Follow the system light/dark preference when the selected theme has a pair.",
  "theme.autoOnNoPair": "On, but the selected theme has no light/dark pair, so it will stay selected.",

  // Auth
  "auth.apiKeyRequired": "API key is required",
  "auth.logoutTitle": "Remove stored provider authentication",
  "auth.apiKeyPlaceholder": "API key",

  // App refresh
  "refresh.refreshing": "Refreshing app data. Long-press for reload options.",
  "refresh.normal": "Refresh app data. Long-press for reload options.",

  // Actions
  "actions.showActions": "Show Actions",
  "actions.label": "Actions",
  "actions.searchPlaceholder": "Search actions...",

  // Composer / Prompt Editor
  "composer.placeholder": "Message pi...",
  "composer.send": "Send",
  "composer.queue": "Queue",
  "composer.queueTitle": "Queue until the current activity finishes",
  "composer.steer": "Steer",
  "composer.steerTitle": "Steer the current response before the next model call",
  "composer.stop": "Stop",
  "composer.stopTitle": "Stop current work and clear queued messages",
  "composer.nothingRunning": "Nothing running",
  "composer.selectModel": "Select model",
  "composer.selectThinking": "Select thinking level",

  // Chat
  "chat.lateArrival1": "You opened this chat while the assistant was already replying. The complete answer will appear shortly.",
  "chat.lateArrival2": "We joined mid-sentence. Holding the curtain until the full reply is ready.",
  "chat.lateArrival3": "The assistant started before this tab arrived. We'll show the full answer when it lands.",
  "chat.lateArrival4": "Catching the reply in one piece — no spoilers, no half-answers.",
  "chat.lateArrival5": "The tokens are still assembling themselves. Full answer incoming.",
  "chat.lateArrival6": "We arrived fashionably late to this response. The complete version will appear soon.",
  "chat.steer": "Steer",
  "chat.followUp": "Follow-up",
  "chat.noInfo": "no info",
  "chat.noMetadata": "No Pi message metadata available",
  "chat.copied": "Copied",
  "chat.copy": "Copy message",

  // Session List
  "sessionList.sessionActions": "Session actions",
  "sessionList.detachFromParent": "Detach from parent",
  "sessionList.delete": "Delete",
  "sessionList.restore": "Restore",
  "sessionList.archive": "Archive",
  "sessionList.archiveWithDescendants": "Archive with descendants",
  "sessionList.sessionActive": "Session active",
  "sessionList.noSessionSelected": "No session selected",

  // Workspace List
  "workspaceList.workspaces": "Workspaces",
  "workspaceList.noWorkspaceSelected": "No workspace selected",
  "workspaceList.actionsAndDetails": "Workspace actions and details",
  "workspaceList.deleteWorkspace": "Delete workspace",
  "workspaceList.deleting": "Deleting…",
  "workspaceList.deletionInProgress": "Workspace deletion in progress",
  "workspaceList.workspace": "Workspace",
  "workspaceList.branch": "Branch",
  "workspaceList.terminalActive": "Workspace terminal active",
  "workspaceList.active": "Workspace active",

  // Project List
  "projectList.projects": "Projects",
  "projectList.noProjectSelected": "No project selected",
  "projectList.close": "Close",
  "projectList.closeProject": "Close project",
  "projectList.terminalActive": "Project terminal active",
  "projectList.active": "Project active",

  // Terminal Panel
  "terminal.cancelCommand": "Cancel command",
  "terminal.cancelSent": "Cancel sent…",
  "terminal.continueInShell": "Continue in shell",
  "terminal.startingShell": "Starting shell…",
  "terminal.invalidMessage": "Invalid terminal message",

  // Tool Execution / Diff
  "diff.previewDiff": "Preview diff",
  "diff.appliedDiff": "Applied diff",
  "diff.fullDiff": "Full diff",
  "diff.copyDiff": "Copy diff",
  "diff.copied": "Copied",
  "diff.showingLines": "Showing {0} of {1} lines",

  // Code blocks
  "code.copyCodeBlock": "Copy code block",
  "code.copiedCodeBlock": "Copied code block",
  "code.failedToCopy": "Failed to copy code block",

  // Navigation tabs
  "nav.sessions": "Sessions",
  "nav.chat": "Chat",

  // Refresh menu
  "refresh.fullReload": "Full page reload",

  // Context bar
  "context.location": "Location",
  "context.project": "Project",
  "context.workspace": "Workspace",
  "context.session": "Session",

  // Shared / General
  "general.select": "Select",
  "general.search": "Search",
  "general.workspace": "Workspace",
  "general.branch": "Branch",
  "general.main": "main",
  "general.active": "Active",

  // Status bar
  "status.noStatus": "No session status yet",
  "status.contextUnknown": "context unknown",
  "status.queued": "queued",

  // Workspace panels
  "panels.files": "Files",
  "panels.git": "Git",
  "panels.terminal": "Terminal",
  "panels.stale": "stale",
  "panels.refresh": "Refresh",
  "panels.noFilesLoaded": "No files loaded.",
  "panels.selectFile": "Select a file.",
  "panels.loadingFile": "Loading {0}…",
  "panels.binaryFile": "Binary file: {0} · {1}",
  "panels.text": "text",
  "panels.truncatedSuffix": " · truncated",
  "panels.imageTooLarge": "Image too large to preview: {0} · limit {1}",
  "panels.noGitStatus": "No status loaded.",
  "panels.notGitRepo": "Not a git repository.",
  "panels.noChanges": "No changes.",
  "panels.selectChangedFile": "Select a changed file.",
  "panels.loadingDiff": "Loading diff…",
  "panels.noDiff": "No staged or unstaged diff.",
  "panels.diff": "diff",
  "panels.staged": "staged",
  "panels.unstaged": "unstaged",
  "panels.detached": "detached",

  // Action palette groups
  "actions.openPalette": "Open the command palette",
  "actions.focusPrompt": "Focus Prompt",
  "actions.focusPromptDesc": "Move keyboard focus to the message composer",
  "actions.addProject": "Add Project",
  "actions.configureAuth": "Configure Provider Authentication",
  "actions.configureAuthDesc": "Run /login without tying authentication to a session",
  "actions.removeAuth": "Remove Provider Authentication",
  "actions.removeAuthDesc": "Run /logout for stored pi credentials",
  "actions.selectTheme": "Select Theme",
  "actions.selectThemeDesc": "Choose the PI WEB color theme",
  "actions.refreshAppData": "Refresh App Data",
  "actions.refreshAppDataDesc": "Refresh session, status, activity, and the current workspace surface without reloading the page",
  "actions.fullPageReload": "Full Page Reload",
  "actions.fullPageReloadDesc": "Reload the PI WEB browser page",
  "actions.goToChat": "Go to Chat",
  "actions.goToFiles": "Go to Files",
  "actions.goToGit": "Go to Git",
  "actions.goToTerminal": "Go to Terminal",
  "actions.refreshFiles": "Refresh Files",
  "actions.refreshGit": "Refresh Git",
  "actions.refreshCurrentPanel": "Refresh Current Panel",
  "actions.deleteWorkspace": "Delete Workspace",
  "actions.deleteWorkspaceDesc": "Remove the selected Git worktree",
  "actions.startSession": "Start Session",
  "actions.archiveSession": "Archive Session",
  "actions.archiveSessionDesc": "Archive the selected session",
  "actions.stopActiveWork": "Stop Active Work",
  "actions.groupGeneral": "General",
  "actions.groupProject": "Project",
  "actions.groupPreferences": "Preferences",
  "actions.groupNavigation": "Navigation",
  "actions.groupWorkspace": "Workspace",
  "actions.groupSession": "Session",

  // Shell messages
  "shell.noOutput": "(no output)",
  "shell.commandFailed": "Bash command failed",
  "shell.cancelled": "cancelled",
  "shell.truncated": "output truncated",
  "shell.fullOutput": "full output",
});
