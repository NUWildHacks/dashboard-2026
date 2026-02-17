"use client";

import type { InlineSegment } from "../types";

type InlineSegmentsProps = {
  readonly segments: InlineSegment[];
};

export const InlineSegments = ({ segments }: InlineSegmentsProps) => {
  if (!Array.isArray(segments) || segments.length === 0) {
    return null;
  }

  return (
    <>
      {segments.map((segment, index) => {
        const key = `${segment.content}-${index}`;
        const isExternal = segment.href ? segment.href.startsWith("http") : false;
        const content = segment.bold ? <strong>{segment.content}</strong> : segment.content;

        if (segment.href) {
          const externalProps = isExternal ? { target: "_blank", rel: "noreferrer" } : undefined;

          return (
            <a key={key} href={segment.href} {...externalProps}>
              {content}
            </a>
          );
        }

        return <span key={key}>{content}</span>;
      })}
    </>
  );
};
