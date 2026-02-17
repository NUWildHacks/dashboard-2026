import type { ReactNode } from "react";

type CalloutKind = "info" | "warning" | "error" | "note" | "highlight";

type CalloutProps = {
  readonly type?: CalloutKind;
  readonly emoji?: string;
  readonly children: ReactNode;
};

const emojiByKind: Record<CalloutKind, string> = {
  info: "ℹ️",
  warning: "⚠️",
  error: "🚫",
  note: "📝",
  highlight: "🎉",
};

const Callout = ({ type = "info", emoji, children }: CalloutProps) => {
  const glyph = emoji ?? emojiByKind[type];

  return (
    <div className={`guide-callout guide-callout-${type}`} role="note">
      <span aria-hidden className="guide-callout-icon">
        {glyph}
      </span>
      <div className="guide-callout-body">{children}</div>
    </div>
  );
};

export { Callout };
