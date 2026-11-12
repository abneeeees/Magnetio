import { useEffect } from "react";

export function searchBar(callback: (key: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // ctrl k or cmd k
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlK = e.ctrlKey;
      const meta = e.metaKey;

      if (
        ((ctrlK || meta) && key === "k") ||
        (key === "/" &&
          !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName) &&
          !(e.target as HTMLElement).isContentEditable)
      ) {
        e.preventDefault();
        callback(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}

export function useEscapeKey(callback: () => void, enabled: boolean = true) {
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

export function tabChange(callback: (key: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (["m", "s", "w", "h"].includes(key)) {
        callback(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}

export function directMagnet(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "d") {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}
