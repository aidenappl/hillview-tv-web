// Browser hardening that has to run before the app hydrates (imported from
// instrumentation-client.ts).

/**
 * A Storage that keeps values in memory for the page's lifetime. Used when the
 * browser refuses storage access.
 */
const memoryStorage = (): Storage => {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(String(key)) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(String(key));
    },
    setItem: (key, value) => {
      items.set(String(key), String(value));
    },
  };
};

/**
 * Safari with "Block all cookies", Firefox with site data disabled and some
 * sandboxed iframes throw "SecurityError: The operation is insecure." on any
 * access to window.localStorage / sessionStorage. Mux Player (media-chrome)
 * reads its subtitle, volume and muted preferences from localStorage without a
 * guard, which broke /watch for those visitors. Swap in an in-memory store so
 * those reads succeed; nothing this app keeps there needs to survive a reload.
 */
export const guardStorage = (): void => {
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      const s = window[name];
      const probe = "__hillview_storage_probe__";
      s.setItem(probe, "1");
      s.removeItem(probe);
    } catch {
      try {
        Object.defineProperty(window, name, {
          configurable: true,
          value: memoryStorage(),
        });
      } catch {
        // The property can't be replaced: nothing more we can do.
      }
    }
  }
};

// Turbopack's error when a page from the previous deploy asks for a module
// whose chunk this deploy no longer serves; webpack-style ChunkLoadErrors too.
const STALE_CHUNK =
  /module factory is not available|ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module/i;
const RELOAD_KEY = "hillview:stale-chunk-reload";
const RELOAD_WINDOW_MS = 60_000;

export const isStaleChunkError = (message: unknown): boolean =>
  typeof message === "string" && STALE_CHUNK.test(message);

/**
 * After a deploy, a tab still running the old build fails to load modules the
 * new build no longer serves. Reload once to pick up the new build; a second
 * failure within a minute is a real error and is left to Monitor.
 */
export const recoverFromStaleChunks = (): void => {
  const handle = (message: unknown) => {
    if (!isStaleChunkError(message)) return;
    try {
      const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
      if (Date.now() - last < RELOAD_WINDOW_MS) return;
      window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      return; // can't remember the reload: don't risk a loop
    }
    window.location.reload();
  };
  window.addEventListener("error", (e) =>
    handle(e.error?.message ?? e.message),
  );
  window.addEventListener("unhandledrejection", (e) =>
    handle(
      (e.reason as { message?: unknown } | undefined)?.message ?? e.reason,
    ),
  );
};
