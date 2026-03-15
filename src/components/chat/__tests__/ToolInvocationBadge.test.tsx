import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { getToolLabel, ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// getToolLabel unit tests
test("str_replace_editor + create → Creating {filename}", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/Button.tsx" })).toBe("Creating Button.tsx");
});

test("str_replace_editor + str_replace → Editing {filename}", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.tsx" })).toBe("Editing App.tsx");
});

test("str_replace_editor + insert → Editing {filename}", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/App.tsx" })).toBe("Editing App.tsx");
});

test("str_replace_editor + view → Reading {filename}", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "src/index.tsx" })).toBe("Reading index.tsx");
});

test("str_replace_editor + undo_edit → Undoing edit in {filename}", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "src/App.tsx" })).toBe("Undoing edit in App.tsx");
});

test("file_manager + rename → Renaming {filename}", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/OldName.tsx" })).toBe("Renaming OldName.tsx");
});

test("file_manager + delete → Deleting {filename}", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/OldFile.tsx" })).toBe("Deleting OldFile.tsx");
});

test("unknown toolName → raw toolName fallback", () => {
  expect(getToolLabel("some_unknown_tool", { command: "do_something" })).toBe("some_unknown_tool");
});

test("missing args.path → uses 'file' as filename", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
});

// ToolInvocationBadge render tests
test("pending state shows spinner and correct label", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/Button.tsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
  const greenDot = document.querySelector(".bg-emerald-500");
  expect(greenDot).toBeNull();
});

test("done state shows green dot, no spinner, correct label", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/Button.tsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  const greenDot = document.querySelector(".bg-emerald-500");
  expect(greenDot).not.toBeNull();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});

test("done state with falsy result treated as pending (spinner shown)", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/Button.tsx" }}
      state="result"
      result=""
    />
  );

  const spinner = document.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
  const greenDot = document.querySelector(".bg-emerald-500");
  expect(greenDot).toBeNull();
});
