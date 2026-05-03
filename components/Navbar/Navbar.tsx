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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-primary-100">
        Skip to content
      </a>
      <div className="relative z-20 flex h-full w-full items-center justify-between bg-white/70 px-4 backdrop-blur-md sm:px-5 md:mx-auto md:w-11/12 md:max-w-screen-2xl md:bg-transparent md:px-0 md:backdrop-blur-none">
        <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
          <Image
            src="/assets/logos/sun.png"
            alt="HillviewTV"
            width={44}
            height={44}
            className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 md:h-11 md:w-11"
          />
          <h1 className="text-lg font-semibold tracking-[-0.01em] text-header-100 sm:text-xl md:text-2xl">
            Hillview<span className="text-blue-600">TV</span>
          </h1>
          {isLive && (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-red-600 sm:gap-1.5 sm:px-2 sm:text-[0.6rem] md:px-2.5 md:text-[0.7rem]">
              <span className="live-dot inline-block h-1 w-1 rounded-full bg-red-500 sm:h-1.5 sm:w-1.5" />
              Live
            </span>
          )}
        </Link>
        {hideLinks ? (
          ""
        ) : (
          <>
            <div className="mobile-nav flex items-center gap-3 md:hidden">
              {isLive && (
                <a
                  href="https://watch.hillview.tv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)] transition-all duration-200 hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]"
                >
                  <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  Watch Live
                </a>
              )}
              <button
                type="button"
                className="nav-icon p-1"
                aria-label="Toggle navigation menu"
                aria-expanded={showMobileNav}
                onClick={() => {
                  setShowMobileNav(!showMobileNav);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={clsx(
                    "block h-6 w-6 sm:h-7 sm:w-7",
                    showMobileNav && "hidden",
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
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={clsx(
                    "h-6 w-6 sm:h-7 sm:w-7",
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
            <div className="mt-0.5 hidden items-center justify-center gap-8 md:flex lg:gap-10">
              {navButtons.map((i) => {
                return (
                  <Link
                    href={i.url}
                    key={i.url}
                    className={clsx(
                      "text-sm font-medium transition-colors duration-200 lg:text-base",
                      activeUrl === i.url
                        ? "text-primary-100"
                        : "text-neutral-500 hover:text-neutral-900",
                    )}
                  >
                    {i.title}
                  </Link>
                );
              })}
              {isLive && (
                <a
                  href="https://watch.hillview.tv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)] transition-all duration-200 hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]"
                >
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-white" />
                  We&apos;re Live
                </a>
              )}
            </div>
          </>
        )}
      </div>
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent sm:mx-5 md:mx-auto md:w-11/12 md:max-w-screen-2xl" />
      <div
        className={clsx(
          "fs-nav relative left-0 z-10 h-fit w-full bg-white/90 backdrop-blur-md duration-200 ease-in-out md:hidden",
          showMobileNav ? "top-[0px] shadow-lg" : "top-[-100vh] shadow-none",
        )}
      >
        <div className="nav-button-container flex w-full flex-wrap pb-1">
          {navButtons.map((i) => {
            return (
              <Link
                href={i.url}
                key={i.url}
                className={clsx(
                  "h-fit w-full py-5 text-center text-lg font-medium transition-colors duration-200",
                  activeUrl === i.url
                    ? "text-primary-100"
                    : "text-neutral-700 hover:text-neutral-900",
                )}
              >
                {i.title}
              </Link>
            );
          })}
        </div>
      </div>
      <div
        role="presentation"
        className={clsx(
          "fs-dark absolute left-0 top-0 z-[1] h-[100vh] w-full",
          showMobileNav ? "pointer-events-auto" : "pointer-events-none",
        )}
        onClick={() => {
          setShowMobileNav(false);
        }}
      ></div>
    </div>
  );
};

export default Navbar;
