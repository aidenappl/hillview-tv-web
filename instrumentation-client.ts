// Importing the service creates the browser Monitor before the app hydrates, so
// an error thrown during hydration is captured too.
import "./services/monitor.service";
import { guardStorage, recoverFromStaleChunks } from "./lib/browser-recovery";

// Before the app hydrates, so Mux Player on /watch finds a storage it can read.
guardStorage();
recoverFromStaleChunks();
