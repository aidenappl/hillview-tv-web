import type { GetServerSideProps } from "next";
import { useState } from "react";
import Layout from "../components/Layout";

import VideoPreview from "../components/ContentPage/VideoPreview";
import SearchSpinner from "../components/ContentPage/Searching";
import QueryVideos from "../hooks/QueryVideos";
import QuerySpotlight from "../hooks/QuerySpotlight";

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

  // Frontend Params
  ft?: string; // Formatted time
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
  const [videos, setVideos] = useState(props.videos);
  const [highlightedVideos, _setHighlightedVideos] = useState(
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
      const response = await QueryVideos("", 24, videos.length);
      if (response.length < 24) setShowLoadBtn(false);
      setVideos([...videos, ...response]);
    } catch (error) {
      console.error("Error loading more videos:", error);
    }
  };

  const handleSearch = async (e: any) => {
    try {
      setSearchQuery(e.target.value);
      const value = e.target.value.trim();

      if (value.length > 0) {
        setSearching(true);
        clearTimeout(timeout);
        const newTimer = setTimeout(async () => {
          const response: Video[] = await QueryVideos(value, 24, 0);
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
                    return <VideoPreview key={i.video.id} video={i.video} />;
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
              <SearchSpinner />
            ) : (
              <>
                {videos.map((vid) => {
                  return <VideoPreview key={vid.id} video={vid} />;
                })}
              </>
            )}
          </div>
          <div
            className={
              "flex h-full w-full items-center justify-center py-20" +
              (showLoadBtn ? "" : " hidden") +
              (searching || videos.length < 24 ? " hidden" : "")
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

export const getServerSideProps: GetServerSideProps = async (_context: any) => {
  try {
    const videos = await QueryVideos();

    if (videos.length === 0) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const spotlight = await QuerySpotlight();

    return {
      props: {
        title: "HillviewTV - Content",
        videos: videos,
        highlightedVideos: spotlight,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Content;
