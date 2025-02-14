import type { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import axios from "axios";
import ContentImage from "../components/ContentImage";

interface GeneralNSM {
  id: number;
  name: string;
  short_name: string;
}

export interface Video {
  id: number;
  uuid: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  status: GeneralNSM;
  inserted_at: Date;
}

export interface Rank {
  rank: number;
  video: Video;
}

interface ContentPageProps {
  videos: Video[];
  highlightedVideos: Rank[];
}

const Content = (props: ContentPageProps) => {
  let [videos, setVideos] = useState(props.videos);
  let [highlightedVideos, setHighlightedVideos] = useState(
    props.highlightedVideos,
  );

  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeout, setTimer] = useState(null as any);
  const [showLoadBtn, setShowLoadBtn] = useState(true);

  const resetSearch = () => {
    setSearchQuery("");
    setSearching(false);
    setVideos(props.videos);
  };

  const loadMoreVideos = async () => {
    try {
      const response = await QueryVideos("", videos.length.toString());
      console.log(response, videos);
      setVideos([...videos, ...response]);
      console.log(videos);
    } catch (error) {
      console.log(error);
    }
  };

  const QueryVideos = async (query: string, offset: string) => {
    try {
      const response = await axios.get(
        `https://api.hillview.tv/video/v1.1/list/videos?limit=24&offset=${offset}&search=${query}&sort=desc&by=views`,
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async (e: any) => {
    try {
      setSearchQuery(e.target.value);
      let value = e.target.value.trim();

      if (value.length > 0) {
        setSearching(true);
        clearTimeout(timeout);
        const newTimer = setTimeout(async () => {
          const response: Video[] = await QueryVideos(value, "0");
          setVideos(response);
          setSearching(false);
        }, 500);
        setTimer(newTimer);
      } else {
        resetSearch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="content-page flex h-fit w-full items-center justify-center">
        <div className="h-fit w-11/12 max-w-screen-2xl">
          {/* Header */}
          <div className="header mt-10 flex w-full items-center justify-center md:mt-14">
            <div className="center-object">
              <h1 className="text-center text-4xl font-semibold sm:text-5xl md:text-6xl">
                Our Content
              </h1>
              <input
                type="text"
                className="mt-8 h-12 w-[320px] rounded-md bg-neutral-100 pl-5 outline outline-neutral-150 sm:w-[450px] md:mt-10 md:w-[550px]"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />
            </div>
          </div>

          {/* Highlighted List */}
          <h1
            className="py-16 text-center text-2xl font-semibold text-slate-600 sm:text-3xl md:text-4xl"
            hidden={searchQuery.length > 0 || highlightedVideos == null}
          >
            Highlighted Content
          </h1>
          <div
            className="video-list flex h-fit w-full flex-wrap justify-around gap-12 pb-10 sm:gap-10"
            hidden={searchQuery.length > 0 || highlightedVideos == null}
          >
            <>
              {searchQuery.length == 0 &&
              highlightedVideos != null &&
              highlightedVideos.length > 0
                ? highlightedVideos.map((i) => {
                    return (
                      <Link href={"/watch?v=" + i.video.uuid} key={i.video.url}>
                        <a>
                          <div className="video group relative h-[180px] w-[320px] md:h-[275px] md:w-[460px]">
                            <div className="video relative h-full w-full overflow-hidden">
                              <div className="video-data absolute left-0 top-0 z-30 h-full w-full p-10 text-white opacity-0 duration-300 ease-in-out sm:group-hover:opacity-100">
                                <h1 className="pb-3 text-3xl font-semibold">
                                  {i.video.title}
                                </h1>
                                <p className="line-clamp-5 text-sm">
                                  {i.video.description}
                                </p>
                              </div>
                              <div className="video-play opacity-1 absolute z-20 flex h-full w-full scale-100 items-center justify-center duration-200 ease-in-out sm:group-hover:scale-75 sm:group-hover:opacity-0">
                                <svg
                                  className="feather feather-play z-20 h-[70px] w-[70px] fill-white stroke-white opacity-80"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                              <div className="video-background absolute z-10 h-full w-full bg-black opacity-0 duration-300 ease-in-out sm:group-hover:opacity-40"></div>
                              <div className="video-thumbnail relative h-full w-full duration-300 ease-in-out sm:group-hover:scale-110">
                                <ContentImage
                                  image={i.video.thumbnail}
                                  alt={i.video.title}
                                />
                              </div>
                            </div>
                            <h1 className="text-md text-nowrap absolute bottom-[-30px] font-semibold text-neutral-800">
                              {i.video.title}
                            </h1>
                          </div>
                        </a>
                      </Link>
                    );
                  })
                : null}
            </>
          </div>
          {/* All Videos */}
          <h1
            className="pb-14 pt-6 text-center text-2xl font-semibold text-slate-600 sm:text-3xl md:text-4xl"
            hidden={searchQuery.length > 0 || highlightedVideos == null}
          >
            All Videos
          </h1>
          <div className="video-list flex h-fit w-full flex-wrap justify-around gap-12 pb-10 sm:gap-10">
            {searching ? (
              <div className="relative flex w-full items-center justify-center">
                <svg
                  version="1.1"
                  id="L9"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                  className="h-20 w-20 fill-black stroke-black opacity-30"
                >
                  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      dur="0.7s"
                      from="0 50 50"
                      to="360 50 50"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            ) : (
              <>
                {videos.map((i) => {
                  return (
                    <Link href={"/watch?v=" + i.uuid} key={i.url}>
                      <a>
                        <div className="video group relative h-[180px] w-[320px] md:h-[315px] md:w-[560px]">
                          <div className="video relative h-full w-full overflow-hidden">
                            <div className="video-data absolute left-0 top-0 z-30 h-full w-full p-10 text-white opacity-0 duration-300 ease-in-out sm:group-hover:opacity-100">
                              <h1 className="pb-5 text-4xl font-semibold">
                                {i.title}
                              </h1>
                              <p className="line-clamp-5">{i.description}</p>
                            </div>
                            <div className="video-play opacity-1 absolute z-20 flex h-full w-full scale-100 items-center justify-center duration-200 ease-in-out sm:group-hover:scale-75 sm:group-hover:opacity-0">
                              <svg
                                className="feather feather-play z-20 h-[70px] w-[70px] fill-white stroke-white opacity-80"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                            </div>
                            <div className="video-background absolute z-10 h-full w-full bg-black opacity-0 duration-300 ease-in-out sm:group-hover:opacity-40"></div>
                            <div className="video-thumbnail relative h-full w-full duration-300 ease-in-out sm:group-hover:scale-110">
                              <ContentImage image={i.thumbnail} alt={i.title} />
                            </div>
                          </div>
                          <h1 className="text-md text-nowrap absolute bottom-[-30px] font-medium text-neutral-800 sm:hidden">
                            {i.title}
                          </h1>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </>
            )}
          </div>
          <div
            className={
              "flex h-full w-full items-center justify-center py-20" +
              (showLoadBtn ? "" : " hidden") +
              (searching || videos.length < 20 ? " hidden" : "")
            }
          >
            <button
              onClick={() => {
                loadMoreVideos();
              }}
              className="mb-20 h-[42px] w-[150px] cursor-pointer rounded-md bg-primary-100 text-white outline-none"
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    const response = await fetch(
      "https://api.hillview.tv/video/v1.1/list/videos?limit=24&offset=0&search=",
    );

    if (!response.ok) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const data = await response.json();

    const response2 = await fetch(
      "https://api.hillview.tv/video/v1.1/spotlight?limit=24&offset=0&search=",
    );

    if (!response2.ok) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const data2 = await response2.json();

    return {
      props: {
        title: "HillviewTV - Content",
        videos: data,
        highlightedVideos: data2.data,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Content;
