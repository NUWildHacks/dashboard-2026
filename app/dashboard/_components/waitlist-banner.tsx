import { Hourglass } from "lucide-react";

/**
 * PLACEHOLDER: the banner for waitlisted users. Replace this component with the final design.
 * The dashboard layout renders it full width at the top of every dashboard page. The banner can
 * be any height (DashboardBannerSlot measures it), and it must not fetch data.
 *
 * Design: the brand yellow (Tailwind yellow-400 is the same color as --chart-2) with near-black
 * text in both themes, for high contrast. Dark mode uses a slightly darker yellow so the banner
 * does not glare. No animation.
 */
const WaitlistBanner = () => {
  return (
    <div
      role="status"
      className="w-full border-b-2 border-yellow-600 bg-yellow-400 px-4 py-3 text-yellow-950 dark:border-yellow-700 dark:bg-yellow-500"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        <Hourglass
          aria-hidden="true"
          className="size-5 shrink-0"
        />
        <p className="text-sm">
          <span className="font-bold">
            You are on the waitlist.
          </span>{" "}
          The event is full right now, but please stay tuned
          for updates!
        </p>
      </div>
    </div>
  );
};

export default WaitlistBanner;
