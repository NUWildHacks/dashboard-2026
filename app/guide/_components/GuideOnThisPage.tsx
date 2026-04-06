"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

const SCROLL_DURATION_MS = 880;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const isScrollableElement = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const canScroll = styles.overflowY === "auto" || styles.overflowY === "scroll" || styles.overflowY === "overlay";
  return canScroll && element.scrollHeight > element.clientHeight + 1;
};

const getScrollableAncestor = (element: HTMLElement): HTMLElement | null => {
  let current: HTMLElement | null = element.parentElement;

  while (current) {
    if (isScrollableElement(current)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const GuideOnThisPage = () => {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const animateScrollPosition = useCallback(
    (getPosition: () => number, setPosition: (value: number) => void, destination: number) => {
      stopAnimation();

      const origin = getPosition();
      const delta = destination - origin;
      if (Math.abs(delta) < 1) {
        return;
      }

      const startedAt = performance.now();

      const step = (timestamp: number) => {
        const elapsed = timestamp - startedAt;
        const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
        const eased = easeInOutCubic(progress);

        setPosition(origin + delta * eased);

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [stopAnimation]
  );

  const onTocClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      const nextHash = `#${id}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        target.scrollIntoView({ block: "start" });
        return;
      }

      const scrollContainer = getScrollableAncestor(target);
      if (scrollContainer) {
        const offset = 14;
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const destination = Math.max(0, scrollContainer.scrollTop + (targetRect.top - containerRect.top) - offset);

        animateScrollPosition(
          () => scrollContainer.scrollTop,
          (value) => {
            scrollContainer.scrollTop = value;
          },
          destination
        );
        return;
      }

      const topbarHeight = (document.querySelector(".guide-topbar") as HTMLElement | null)?.offsetHeight ?? 0;
      const destination = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topbarHeight - 12);

      animateScrollPosition(
        () => window.scrollY,
        (value) => window.scrollTo({ top: value, left: 0 }),
        destination
      );
    },
    [animateScrollPosition]
  );

  useEffect(() => {
    const article = document.getElementById("guide-content-article");
    if (!article) {
      return;
    }

    const headings = Array.from(article.querySelectorAll("h1, h2, h3")) as HTMLHeadingElement[];
    const seenIds = new Map<string, number>();

    const nextItems: TocItem[] = headings
      .map((heading, index) => {
        const text = heading.textContent?.trim();
        if (!text) {
          return null;
        }

        const baseId = heading.id || slugify(text) || `section-${index + 1}`;
        const seen = (seenIds.get(baseId) ?? 0) + 1;
        seenIds.set(baseId, seen);
        const id = seen > 1 ? `${baseId}-${seen}` : baseId;

        heading.id = id;

        const level = Number(heading.tagName.slice(1));
        if (level !== 2 && level !== 3) {
          return null;
        }

        return {
          id,
          title: text,
          level,
        } as TocItem;
      })
      .filter((item): item is TocItem => item !== null);

    const frame = window.requestAnimationFrame(() => {
      setItems(nextItems);

      const requestedId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!requestedId) {
        return;
      }

      const target = document.getElementById(requestedId);
      if (target) {
        target.scrollIntoView({ block: "start" });
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => stopAnimation, [stopAnimation]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="guide-toc" aria-label="On this page">
      <p className="guide-toc-title">On this page</p>
      <ul className="guide-toc-list">
        {items.map((item) => (
          <li key={item.id} className={`guide-toc-item guide-toc-item-level-${item.level}`}>
            <a href={`#${item.id}`} className="guide-toc-link" onClick={(event) => onTocClick(event, item.id)}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export { GuideOnThisPage };
