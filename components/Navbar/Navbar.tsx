import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface NavbarProps {
  hideLinks: boolean;
}

interface GeneralNSM {
  id: number;
  name: string;
  short_name: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  status: GeneralNSM;
  inserted_at: Date;
}

const Navbar = (props: NavbarProps) => {
  const { hideLinks } = props;

  const router = useRouter();
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
    <div className="z-20 h-[100px] w-screen shrink-0">
      <div className="relative z-20 flex h-full w-full items-center justify-between border-b-2 border-neutral-100 bg-white px-5 sm:mx-auto sm:w-11/12 sm:max-w-screen-2xl sm:px-0">
        <Link href="/">
          <a>
            <h1 className="text-2xl font-semibold text-header-100">
              HillviewTV
            </h1>
          </a>
        </Link>
        {hideLinks ? (
          ""
        ) : (
          <>
            <div className="mobile-nav flex md:hidden">
              <div
                className="nav-icon"
                onClick={() => {
                  setShowMobileNav(!showMobileNav);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={"block h-7 w-7 " + (showMobileNav ? "hidden" : "")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={"h-7 w-7 " + (showMobileNav ? "block" : "hidden")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-0.5 hidden items-center justify-center gap-10 md:flex">
              {navButtons.map((i) => {
                return (
                  <Link href={i.url} key={i.url}>
                    <a
                      className={
                        "font-inter text-base font-medium transition " +
                        (activeUrl === i.url
                          ? "text-primary-100"
                          : "text-neutral-500 hover:text-neutral-900")
                      }
                    >
                      {i.title}
                    </a>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div
        className={
          "fs-nav relative left-0 z-10 h-fit w-full bg-white duration-200 ease-in-out md:hidden " +
          (showMobileNav ? "top-[0px] shadow-lg" : "top-[-350px] shadow-none")
        }
      >
        <div className="nav-button-container flex w-full flex-wrap pb-1">
          {navButtons.map((i) => {
            return (
              <Link href={i.url} key={i.url}>
                <a className="h-fit w-full py-6 text-center text-xl font-medium">
                  {i.title}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      <div
        className={
          "fs-dark absolute left-0 top-0 z-[1] h-[100vh] w-full " +
          (showMobileNav ? "pointer-events-auto" : "pointer-events-none")
        }
        onClick={() => {
          setShowMobileNav(false);
        }}
      ></div>
    </div>
  );
};

export default Navbar;
