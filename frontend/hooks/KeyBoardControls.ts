import { useEffect } from "react";

export function useSearchBar(callback: (key: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement;

      const isInput = ["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;

      if (((e.ctrlKey || e.metaKey) && key === "k") || (key === "/" && !isInput)) {
        e.preventDefault();
        callback(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, enabled]);
}

export function useEscapeKey(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, enabled]);
}

export function useTabChange(callback: (key: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement;

      if (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable) return;

      if (["m", "s", "w", "h", "d"].includes(key)) {
        callback(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, enabled]);
}
