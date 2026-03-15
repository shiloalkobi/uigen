"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const filename = (typeof args.path === "string" ? args.path : "").split("/").pop() || "file";
  const command = args.command;

  if (toolName === "str_replace_editor") {
    if (command === "create") return `Creating ${filename}`;
    if (command === "str_replace" || command === "insert") return `Editing ${filename}`;
    if (command === "view") return `Reading ${filename}`;
    if (command === "undo_edit") return `Undoing edit in ${filename}`;
  }

  if (toolName === "file_manager") {
    if (command === "rename") return `Renaming ${filename}`;
    if (command === "delete") return `Deleting ${filename}`;
  }

  return toolName;
}

export function ToolInvocationBadge({ toolName, args, state, result }: ToolInvocationBadgeProps) {
  const isDone = state === "result" && Boolean(result);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone
        ? <div className="w-2 h-2 rounded-full bg-emerald-500" />
        : <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      }
      <span className="text-neutral-700">{getToolLabel(toolName, args)}</span>
    </div>
  );
}
