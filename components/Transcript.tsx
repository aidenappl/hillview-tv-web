import { useEffect, useRef } from "react";
import { Cue, VttNode, formatTimestamp } from "../lib/video";

// Render a parsed cue payload tree to safe React elements (no dangerouslySetInnerHTML).
const renderNodes = (nodes: VttNode[]): React.ReactNode =>
  nodes.map((node, i) => {
    if (node.type === "text") return node.value;
    const children = renderNodes(node.children);
    switch (node.tag) {
      case "b":
        return <b key={i}>{children}</b>;
      case "i":
        return <i key={i}>{children}</i>;
      case "u":
        return <u key={i}>{children}</u>;
      case "lang":
        return (
          <span key={i} lang={node.annotation}>
            {children}
          </span>
        );
      case "c":
        return (
          <span key={i} className={node.classes.map((c) => `vtt-${c}`).join(" ")}>
            {children}
          </span>
        );
      case "ruby":
        return <ruby key={i}>{children}</ruby>;
      case "rt":
        return <rt key={i}>{children}</rt>;
      default:
        // voice (<v>) and any unknown tag: render children inline
        return <span key={i}>{children}</span>;
    }
  });

type TranscriptProps = {
  cues: Cue[];
  activeIndex: number;
  onSeek?: (seconds: number) => void;
};

const Transcript = ({ cues, activeIndex, onSeek }: TranscriptProps) => {
  const scrollRef = useRef<HTMLOListElement | null>(null);
  const activeRef = useRef<HTMLLIElement | null>(null);
  const lastManualScroll = useRef(0);
  const programmaticScroll = useRef(false);

  // Auto-scroll the active cue into view, unless the user scrolled recently.
  useEffect(() => {
    if (activeIndex < 0 || !activeRef.current) return;
    if (Date.now() - lastManualScroll.current < 4000) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    programmaticScroll.current = true;
    activeRef.current.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
    // Release the programmatic flag after the scroll settles.
    window.setTimeout(() => (programmaticScroll.current = false), 600);
  }, [activeIndex]);

  const onScroll = () => {
    if (programmaticScroll.current) return;
    lastManualScroll.current = Date.now();
  };

  const interactive = !!onSeek;

  return (
    <ol
      ref={scrollRef}
      onScroll={onScroll}
      className="max-h-[28rem] space-y-0.5 overflow-y-auto px-2 pb-4 pt-1 sm:px-3"
    >
      {cues.map((cue, i) => {
        const isActive = i === activeIndex;
        const showSpeaker = cue.voice && cue.voice !== cues[i - 1]?.voice;
        const Row = (
          <>
            <span
              className={
                "shrink-0 pt-0.5 font-mono text-xs font-semibold tabular-nums " +
                (interactive ? "text-primary-100" : "text-neutral-400")
              }
            >
              {formatTimestamp(cue.start)}
            </span>
            <span className="min-w-0 text-left text-sm leading-relaxed text-neutral-600">
              {showSpeaker && (
                <span className="mr-1 font-semibold text-header-100">
                  {cue.voice}:
                </span>
              )}
              {renderNodes(cue.nodes)}
            </span>
          </>
        );
        return (
          <li
            key={i}
            ref={isActive ? activeRef : undefined}
            aria-current={isActive ? "true" : undefined}
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 40px" }}
            className={
              "rounded-lg transition-colors " +
              (isActive ? "bg-primary-100/10" : "")
            }
          >
            {interactive ? (
              <button
                type="button"
                onClick={() => onSeek!(cue.start)}
                aria-label={`Jump to ${formatTimestamp(cue.start)}`}
                className="flex w-full gap-3 px-2 py-1.5 text-left hover:bg-white/60"
              >
                {Row}
              </button>
            ) : (
              <div className="flex gap-3 px-2 py-1.5">{Row}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Transcript;
