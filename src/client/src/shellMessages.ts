import { textMessage } from "./chatMessages";
import type { ChatLine } from "./components/shared";
import type { SessionUiEvent } from "./sessionSocket";
import { t } from "./i18n/index.js";

export function shellStartMessage(command: string, excludeFromContext?: boolean): ChatLine {
  return textMessage("bash", `${excludeFromContext === true ? "excluded from context\n\n" : ""}$ ${command}`);
}

export function appendShellChunk(messages: ChatLine[], chunk: string): ChatLine[] {
  const last = messages.at(-1);
  const lastPart = last?.parts.at(-1);
  if (last?.role !== "bash" || lastPart?.type !== "text") return [...messages, textMessage("bash", chunk)];
  const separator = hasShellOutput(lastPart.text) ? "" : "\n\n";
  return [...messages.slice(0, -1), { ...last, parts: [...last.parts.slice(0, -1), { ...lastPart, text: lastPart.text + separator + chunk }] }];
}

export function finalizeShellMessage(messages: ChatLine[], event: Extract<SessionUiEvent, { type: "shell.end" }>): ChatLine[] {
  const last = messages.at(-1);
  const lastPart = last?.parts.at(-1);
  if (last?.role !== "bash" || lastPart?.type !== "text") return messages;
  const notes: string[] = [];
  if (!lastPart.text.includes("\n\n") && (event.output === undefined || event.output === "")) notes.push(t("shell.noOutput"));
  if (event.isError === true) notes.push(event.output ?? t("shell.commandFailed"));
  if (event.exitCode != null) notes.push(`exit ${String(event.exitCode)}`);
  if (event.cancelled === true) notes.push(t("shell.cancelled"));
  if (event.truncated === true) notes.push(t("shell.truncated"));
  if (event.fullOutputPath !== undefined && event.fullOutputPath !== "") notes.push(`${t("shell.fullOutput")}: ${event.fullOutputPath}`);
  if (notes.length === 0) return messages;
  return [...messages.slice(0, -1), { ...last, parts: [...last.parts.slice(0, -1), { ...lastPart, text: `${lastPart.text}\n\n${notes.join("\n")}` }] }];
}

function hasShellOutput(text: string): boolean {
  const outputStart = text.lastIndexOf("\n\n");
  const promptStart = text.lastIndexOf("$ ");
  return outputStart > promptStart;
}
