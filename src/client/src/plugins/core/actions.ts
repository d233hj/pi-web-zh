import { isSessionActive } from "../../../../shared/activity";
import type { AppState } from "../../appState";
import { isWorkspaceDeletionPending } from "../../workspaceDeletion";
import type { PluginAction } from "../types";
import { t } from "../../i18n/index.js";

export function createCoreActions(): PluginAction[] {
  return [
    {
      id: "actions.show",
      title: t("actions.showActions"),
      description: t("actions.openPalette"),
      shortcut: "mod+k",
      group: t("actions.groupGeneral"),
      run: (context) => { context.openActionPalette(); },
    },
    {
      id: "prompt.focus",
      title: t("actions.focusPrompt"),
      description: t("actions.focusPromptDesc"),
      group: t("actions.groupGeneral"),
      enabled: (context) => context.state.selectedSession !== undefined,
      run: (context) => { context.focusPrompt(); },
    },
    {
      id: "project.add",
      title: t("actions.addProject"),
      group: t("actions.groupProject"),
      run: (context) => context.addProject(),
    },
    {
      id: "auth.login",
      title: t("actions.configureAuth"),
      description: t("actions.configureAuthDesc"),
      group: t("actions.groupGeneral"),
      run: (context) => context.configureAuth(),
    },
    {
      id: "auth.logout",
      title: t("actions.removeAuth"),
      description: t("actions.removeAuthDesc"),
      group: t("actions.groupGeneral"),
      run: (context) => context.logoutAuth(),
    },
    {
      id: "theme.select",
      title: t("actions.selectTheme"),
      description: t("actions.selectThemeDesc"),
      group: t("actions.groupPreferences"),
      run: (context) => { context.openThemePicker(); },
    },
    {
      id: "app.refresh-data",
      title: t("actions.refreshAppData"),
      description: t("actions.refreshAppDataDesc"),
      group: t("actions.groupGeneral"),
      run: (context) => context.refreshAppData(),
    },
    {
      id: "app.reload-page",
      title: t("actions.fullPageReload"),
      description: t("actions.fullPageReloadDesc"),
      group: t("actions.groupGeneral"),
      run: (context) => { context.reloadPage(); },
    },
    {
      id: "view.chat",
      title: t("actions.goToChat"),
      shortcut: "mod+1",
      group: t("actions.groupNavigation"),
      run: (context) => { context.selectMainView("chat"); },
    },
    {
      id: "view.files",
      title: t("actions.goToFiles"),
      shortcut: "mod+2",
      group: t("actions.groupNavigation"),
      enabled: hasWorkspace,
      run: (context) => { context.selectMainView("core:workspace.files"); },
    },
    {
      id: "view.git",
      title: t("actions.goToGit"),
      shortcut: "mod+3",
      group: t("actions.groupNavigation"),
      enabled: hasGitWorkspace,
      run: (context) => { context.selectMainView("core:workspace.git"); },
    },
    {
      id: "view.terminal",
      title: t("actions.goToTerminal"),
      shortcut: "mod+4",
      group: t("actions.groupNavigation"),
      enabled: hasWorkspace,
      run: (context) => { context.selectMainView("core:workspace.terminal"); },
    },
    {
      id: "workspace.refresh-files",
      title: t("actions.refreshFiles"),
      shortcut: "mod+shift+f",
      group: t("actions.groupWorkspace"),
      enabled: hasWorkspace,
      run: (context) => context.refreshFiles(),
    },
    {
      id: "workspace.refresh-git",
      title: t("actions.refreshGit"),
      shortcut: "mod+shift+g",
      group: t("actions.groupWorkspace"),
      enabled: hasGitWorkspace,
      run: (context) => context.refreshGit(),
    },
    {
      id: "workspace.refresh-current",
      title: t("actions.refreshCurrentPanel"),
      shortcut: "mod+shift+r",
      group: t("actions.groupWorkspace"),
      enabled: hasWorkspace,
      run: (context) => context.state.workspaceTool === "core:workspace.git" && context.state.selectedWorkspace?.isGitRepo === true ? context.refreshGit() : context.refreshFiles(),
    },
    {
      id: "workspace.delete",
      title: t("actions.deleteWorkspace"),
      description: t("actions.deleteWorkspaceDesc"),
      group: t("actions.groupWorkspace"),
      enabled: hasDeletableWorkspace,
      run: (context) => context.deleteWorkspace(),
    },
    {
      id: "session.start",
      title: t("actions.startSession"),
      shortcut: "mod+enter",
      group: t("actions.groupSession"),
      enabled: hasWorkspace,
      run: (context) => context.startSession(),
    },
    {
      id: "session.archive",
      title: t("actions.archiveSession"),
      description: t("actions.archiveSessionDesc"),
      group: t("actions.groupSession"),
      enabled: (context) => context.state.selectedSession !== undefined && context.state.selectedSession.archived !== true,
      run: (context) => context.archiveSession(),
    },
    {
      id: "session.stop",
      title: t("actions.stopActiveWork"),
      shortcut: "mod+.",
      group: t("actions.groupSession"),
      enabled: (context) => context.state.selectedSession !== undefined && isSessionActive(context.state.status, context.state.activity),
      run: (context) => context.stopActiveWork(),
    },
  ];
}

function hasWorkspace(context: { state: AppState }): boolean {
  return context.state.selectedWorkspace !== undefined;
}

function hasGitWorkspace(context: { state: AppState }): boolean {
  return context.state.selectedWorkspace?.isGitRepo === true;
}

function hasDeletableWorkspace(context: { state: AppState }): boolean {
  const workspace = context.state.selectedWorkspace;
  return workspace !== undefined && workspace.isGitWorktree && !workspace.isMain && !isWorkspaceDeletionPending(context.state, workspace);
}
