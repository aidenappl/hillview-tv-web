import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
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

interface ContentPageProps {
  videos: Video[];
}

const Content = (props: ContentPageProps) => {
  let [videos, setVideos] = useState(props.videos);

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
        `https://api.hillview.tv/video/v1.1/list/videos?limit=24&offset=${offset}&search=${query}`
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
      <div className="content-page w-full h-fit flex justify-center items-center">
        <div className="w-11/12 max-w-screen-2xl h-fit">
          {/* Header */}
          <div className="header h-[275px] md:h-[500px] w-full flex justify-center items-center">
            <div className="center-object">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
                Our Content
              </h1>
              <input
                type="text"
                className="mt-8 md:mt-14 w-[320px] sm:w-[450px] md:w-[550px] h-12 rounded-md pl-5 bg-neutral-100 outline outline-neutral-150 mb-10"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />
            </div>
          </div>

          {/* Video List */}
          <div className="video-list h-fit w-full flex justify-around flex-wrap gap-12 sm:gap-10 pb-10">
            {searching ? (
              <div className="flex relative w-full items-center justify-center">
                <svg
                  version="1.1"
                  id="L9"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                  className="fill-black w-20 h-20 stroke-black opacity-30"
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
                        <div className="group video w-[320px] h-[180px] md:w-[560px] md:h-[315px] relative">
                          <div className="video w-full h-full overflow-hidden relative">
                            <div className="video-data absolute top-0 left-0 w-full h-full z-30 p-10 text-white duration-300 ease-in-out opacity-0 sm:group-hover:opacity-100">
                              <h1 className="text-4xl font-semibold pb-5">
                                {i.title}
                              </h1>
                              <p className="line-clamp-5">{i.description}</p>
                            </div>
                            <div className="video-play opacity-1 scale-100 w-full h-full flex justify-center items-center absolute z-20 duration-200 ease-in-out sm:group-hover:scale-75 sm:group-hover:opacity-0">
                              <svg
                                className="z-20 stroke-white fill-white opacity-80 w-[70px] h-[70px] feather feather-play"
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
                            <div className="video-background w-full h-full duration-300 ease-in-out bg-black opacity-0 sm:group-hover:opacity-40 z-10 absolute"></div>
                            <div className="video-thumbnail h-full w-full relative duration-300 ease-in-out sm:group-hover:scale-110">
                              <ContentImage image={i.thumbnail} alt={i.title} />
                            </div>
                          </div>
                          <h1 className="sm:hidden text-md font-medium absolute bottom-[-30px] text-neutral-800">
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
              "w-full h-full flex justify-center items-center py-20" +
              (showLoadBtn ? "" : " hidden") +
              (searching || videos.length < 20 ? " hidden" : "")
            }
          >
            <button
              onClick={() => {
                loadMoreVideos();
              }}
              className="w-[150px] h-[42px] bg-primary-100 text-white rounded-md cursor-pointer outline-none mb-20"
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
      "https://api.hillview.tv/video/v1.1/list/videos?limit=24&offset=0&search="
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

    return {
      props: {
        title: "HillviewTV - Content",
        videos: data,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Content;
