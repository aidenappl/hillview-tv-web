import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { loadComponents } from "next/dist/server/load-components";

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

  const [searchResults, setSearchResults] = useState([] as Video[]);
  const [activeUrl, setActiveUrl] = useState("");
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInput = useRef(null as any);

  const [timer, setTimer] = useState(null as any);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    setActiveUrl(router.pathname);
    resetSearch();
  }, [router.pathname]);

  const search = async (query: string) => {
    try {
      if (query.length > 0) {
        const response: any = await axios.get(
          "https://api.hillview.tv/video/v1.1/list/videos?limit=5&offset=0&search=" +
            query
        );
        return response.data ? response.data : [];
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSearch = async (e: any) => {
    try {
      setSearchQuery(e.target.value);
      clearTimeout(timer);
      let value = e.target.value.trim();

      if (value.length > 0) {
        setSearchResults([]);
        setShowResults(true);
        setSearching(true);
        const newTimer = setTimeout(async () => {
          setSearching(false);
          let results = await search(value);
          setSearchResults(results);
        }, 500);

        setTimer(newTimer);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setSearching(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-[100px] z-20 shrink-0">
      <div className="z-20 bg-white relative w-full px-5 sm:px-0 sm:w-11/12 sm:max-w-screen-2xl sm:mx-auto flex items-center justify-between h-full border-b-2 border-neutral-100">
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
                  className={"h-7 w-7 block " + (showMobileNav ? "hidden" : "")}
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
            <div className="hidden md:flex items-center justify-center mt-0.5 gap-10">
              {navButtons.map((i) => {
                return (
                  <Link href={i.url} key={i.url}>
                    <a
                      className={
                        "font-medium text-base font-inter transition " +
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
          "fs-nav md:hidden relative left-0 w-full h-fit bg-white z-10 duration-200 ease-in-out " +
          (showMobileNav ? "top-[0px] shadow-lg" : "top-[-350px] shadow-none")
        }
      >
        <div className="nav-button-container w-full flex flex-wrap pb-1">
          {navButtons.map((i) => {
            return (
              <Link href={i.url} key={i.url}>
                <a className="w-full h-fit text-center py-6 font-medium text-xl">
                  {i.title}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      <div
        className={
          "fs-dark w-full h-[100vh] absolute top-0 left-0 z-[1] " +
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
