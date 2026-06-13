import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useLiveStatus } from "../useLiveStatus";

interface NavbarProps {
  hideLinks: boolean;
}

const Navbar = (props: NavbarProps) => {
  const { hideLinks } = props;

  const router = useRouter();
  const isLive = useLiveStatus();
  const navButtons = [
    { title: "Home", url: "/" },
    { title: "Our Content", url: "/content" },
    { title: "Playlists", url: "/playlists" },
    { title: "Tune In", url: "https://watch.hillview.tv/" },
  ];

  const [activeUrl, setActiveUrl] = useState("");
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    setActiveUrl(router.pathname);
  }, [router.pathname]);

  return (
    <div className="z-20 h-[56px] w-screen shrink-0 sm:h-[64px] md:h-[72px]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-primary-100"
      >
        Skip to content
      </a>

      {/* Main bar */}
      <div className="relative z-20 flex h-full w-full items-center border-b border-neutral-150 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
            <Image
              src="/assets/logos/sun.png"
              alt="HillviewTV"
              width={44}
              height={44}
              className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 md:h-10 md:w-10"
            />
            <span className="text-lg font-semibold tracking-[-0.01em] text-header-100 sm:text-xl md:text-2xl">
              Hillview<span className="text-blue-600">TV</span>
            </span>
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-red-600">
                <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                Live
              </span>
            )}
          </Link>

          {hideLinks ? null : (
            <>
              {/* Mobile right: live CTA + hamburger */}
              <div className="flex items-center gap-3 md:hidden">
                {isLive && (
                  <a
                    href="https://watch.hillview.tv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)] transition-all duration-200 hover:bg-red-600"
                  >
                    <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    Watch Live
                  </a>
                )}
                <button
                  type="button"
                  className="p-1 text-neutral-600"
                  aria-label="Toggle navigation menu"
                  aria-expanded={showMobileNav}
                  onClick={() => setShowMobileNav(!showMobileNav)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={clsx("h-6 w-6", showMobileNav && "hidden")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={clsx(
                      "h-6 w-6",
                      showMobileNav ? "block" : "hidden",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Desktop nav */}
              <div className="hidden items-center gap-1 md:flex">
                {navButtons.map((i) => (
                  <Link
                    href={i.url}
                    key={i.url}
                    className={clsx(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 lg:px-4 lg:text-base",
                      activeUrl === i.url
                        ? "bg-primary-100/8 text-primary-100"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                  >
                    {i.title}
                  </Link>
                ))}
                {isLive && (
                  <a
                    href="https://watch.hillview.tv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)] transition-all duration-200 hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]"
                  >
                    <span className="live-dot inline-block h-2 w-2 rounded-full bg-white" />
                    We&apos;re Live
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={clsx(
          "relative left-0 z-10 w-full border-b border-neutral-150 bg-white/95 backdrop-blur-md transition-all duration-200 ease-in-out md:hidden",
          showMobileNav ? "shadow-lg" : "hidden",
        )}
      >
        <div className="flex flex-col px-4 pb-3 pt-1">
          {navButtons.map((i) => (
            <Link
              href={i.url}
              key={i.url}
              onClick={() => setShowMobileNav(false)}
              className={clsx(
                "rounded-lg px-3 py-3.5 text-base font-medium transition-colors duration-150",
                activeUrl === i.url
                  ? "text-primary-100"
                  : "text-neutral-700 hover:text-neutral-900",
              )}
            >
              {i.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        role="presentation"
        className={clsx(
          "fixed inset-0 z-[1]",
          showMobileNav ? "pointer-events-auto" : "pointer-events-none",
        )}
        onClick={() => setShowMobileNav(false)}
      />
    </div>
  );
};

export default Navbar;
