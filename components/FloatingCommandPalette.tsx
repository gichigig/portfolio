"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { profile } from "@/data/profile";
import { flagshipProjects, minorProjects } from "@/data/projects";
import type { CommandResult } from "@/types/portfolio";

type ConsoleEntry = {
  id: number;
  kind: "command" | "output";
  tone: "info" | "success" | "error";
  text: string;
};

const PROMPT = "C:\\Users\\bildad>";

const PROJECT_ALIASES: Record<string, string> = {
  rentals: "smart-rentals-platform",
  hotel: "hotel-operations-suite",
  elearning: "elearning-campus-suite",
};

const SECTION_ALIASES: Record<string, string> = {
  hero: "hero",
  projects: "projects",
  contact: "contact",
};

const initialEntries: ConsoleEntry[] = [
  {
    id: 1,
    kind: "output",
    tone: "info",
    text: "Microsoft Windows [Version 10.0.22631.3593]",
  },
  {
    id: 2,
    kind: "output",
    tone: "info",
    text: "(c) Microsoft Corporation. All rights reserved.",
  },
  {
    id: 3,
    kind: "output",
    tone: "info",
    text: "Type HELP to list available commands for this portfolio.",
  },
];

export default function FloatingCommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<ConsoleEntry[]>(initialEntries);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const appendOutput = useCallback((message: CommandResult) => {
    setEntries((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), kind: "output", tone: message.type, text: message.text },
    ]);
  }, []);

  const appendCommand = useCallback((commandText: string) => {
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        kind: "command",
        tone: "info",
        text: commandText,
      },
    ]);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const openShortcut = (event.ctrlKey || event.metaKey) && key === "k";

      if (openShortcut) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (key === "escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timerId = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timerId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = outputRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [entries, isOpen]);

  const runCommand = useCallback(
    async (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        return;
      }

      appendCommand(trimmed);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(null);

      const command = trimmed.toLowerCase();

      if (command === "clear") {
        setEntries([]);
        return;
      }

      let result: CommandResult = {
        type: "error",
        text: `'${trimmed}' is not recognized as an internal or external command, operable program or batch file.`,
      };
      let action: (() => void) | null = null;

      if (command === "help") {
        result = {
          type: "info",
          text: "Available: help | projects | open rentals|hotel|elearning | minor | goto hero|projects|contact | contact | copy email | clear",
        };
      } else if (command === "projects") {
        result = {
          type: "info",
          text: `Flagship projects: ${flagshipProjects.map((p) => p.title).join(" | ")}`,
        };
      } else if (command === "minor") {
        result = {
          type: "info",
          text: `Minor projects: ${minorProjects.map((p) => p.title).join(" | ")}`,
        };
      } else if (command === "contact") {
        result = {
          type: "info",
          text: `Email: ${profile.email}. Socials: ${profile.socials.map((s) => s.label).join(", ")}`,
        };
      } else if (command === "copy email") {
        if (!navigator.clipboard) {
          result = {
            type: "error",
            text: "Clipboard API is unavailable in this browser context.",
          };
        } else {
          try {
            await navigator.clipboard.writeText(profile.email);
            result = {
              type: "success",
              text: `Copied ${profile.email} to clipboard.`,
            };
          } catch {
            result = { type: "error", text: "Could not copy email to clipboard." };
          }
        }
      } else if (command.startsWith("open ")) {
        const target = command.slice(5).trim();
        const slug = PROJECT_ALIASES[target];

        if (!slug) {
          result = {
            type: "error",
            text: "Unknown project alias. Use rentals, hotel, or elearning.",
          };
        } else {
          action = () => router.push(`/projects/${slug}`);
          result = { type: "success", text: `Opening ${target} project.` };
        }
      } else if (command.startsWith("goto ")) {
        const target = command.slice(5).trim();
        const sectionId = SECTION_ALIASES[target];

        if (!sectionId) {
          result = {
            type: "error",
            text: "Unknown section alias. Use hero, projects, or contact.",
          };
        } else if (pathname !== "/") {
          action = () => router.push(`/#${sectionId}`);
          result = { type: "success", text: `Navigating to ${target} section.` };
        } else {
          const element = document.getElementById(sectionId);

          if (!element) {
            result = {
              type: "error",
              text: `Section '${target}' is unavailable on this page.`,
            };
          } else {
            action = () =>
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            result = { type: "success", text: `Navigating to ${target} section.` };
          }
        }
      }

      appendOutput(result);

      if (action) {
        action();
      }
    },
    [appendCommand, appendOutput, pathname, router],
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const currentInput = input;
      setInput("");
      await runCommand(currentInput);
    },
    [input, runCommand],
  );

  const onInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.ctrlKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        setEntries([]);
        setInput("");
        setHistoryIndex(null);
        return;
      }

      if (commandHistory.length === 0) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        const nextIndex =
          historyIndex === null
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);

        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        if (historyIndex === null) {
          return;
        }

        if (historyIndex >= commandHistory.length - 1) {
          setHistoryIndex(null);
          setInput("");
          return;
        }

        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    },
    [commandHistory, historyIndex],
  );

  return (
    <>
      <button
        type="button"
        aria-label="Toggle command prompt"
        className="cmd-trigger code-text fixed right-5 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[rgb(12_15_20_/_92%)] px-2 text-xs tracking-[0.08em] text-slate-200 transition hover:border-[var(--accent)] hover:text-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        cmd
      </button>

      <aside
        aria-hidden={!isOpen}
        className={`cmd-panel fixed right-5 w-[min(520px,calc(100vw-1.5rem))] shadow-2xl transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="cmd-window">
          <div className="cmd-titlebar">
            <p className="code-text text-[11px] tracking-[0.03em] text-slate-200">
              C:\WINDOWS\system32\cmd.exe
            </p>
            <button
              type="button"
              className="rounded-sm border border-slate-500/40 px-2 py-0.5 text-[10px] text-slate-300 transition-colors hover:border-slate-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>

          <div
            ref={outputRef}
            className="cmd-panel-output min-h-56 overflow-y-auto bg-black px-3 py-3"
          >
            <ul className="space-y-1">
              {entries.map((entry) => {
                if (entry.kind === "command") {
                  return (
                    <li key={entry.id} className="code-text text-[12px] leading-relaxed text-slate-100">
                      <span className="cmd-prompt">{PROMPT}</span>
                      {entry.text}
                    </li>
                  );
                }

                const toneClass =
                  entry.tone === "error"
                    ? "cmd-out-error"
                    : entry.tone === "success"
                      ? "cmd-out-success"
                      : "cmd-out-info";

                return (
                  <li
                    key={entry.id}
                    className={`code-text text-[12px] leading-relaxed ${toneClass}`}
                  >
                    {entry.text}
                  </li>
                );
              })}
            </ul>
          </div>

          <form className="cmd-input-row" onSubmit={onSubmit}>
            <label htmlFor="portfolio-command" className="sr-only">
              Run command prompt instruction
            </label>
            <span className="cmd-prompt code-text text-[12px]">{PROMPT}</span>
            <input
              id="portfolio-command"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onInputKeyDown}
              className="cmd-input code-text w-full text-[12px]"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="off"
            />
          </form>
          <div className="cmd-hint-bar code-text text-[10px] text-slate-500">
            Ctrl/Cmd+K toggle | Up/Down history | Ctrl+L clear
          </div>
        </div>
      </aside>
    </>
  );
}
