/** Base URL for guide static assets (files in public/guide/). */
export const GUIDE_ASSETS_BASE = "/guide";

type GuideImageProps = {
  src: string;
  alt: string;
};

/**
 * Renders an image from the guide assets folder (public/guide/).
 * Pass src as path relative to /guide, e.g. "map.png" or "img/parking.png".
 */
const GuideImage = ({ src, alt }: GuideImageProps) => {
  const resolvedSrc = src.startsWith("/") ? src : `${GUIDE_ASSETS_BASE}/${src.replace(/^\//, "")}`;

  return (
    <span className="guide-content-img">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolvedSrc} alt={alt} className="guide-img" loading="lazy" />
    </span>
  );
};

export { GuideImage };
