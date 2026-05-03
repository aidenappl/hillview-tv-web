import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
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

export interface Spotlight {
  position: number;
  video: Video;
}

interface ContentPageProps {
  videos: Video[];
  highlightedVideos: Spotlight[];
}

const SectionLabel = ({ title }: { title: string }) => (
  <div className="mb-5 flex items-center gap-4">
    <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-400">
      {title}
    </span>
    <div className="h-px w-full bg-neutral-150" />
  </div>
);

const Content = (props: ContentPageProps) => {
  const [videos, setVideos] = useState(props.videos);
  const [highlightedVideos, _setHighlightedVideos] = useState(
    props.highlightedVideos,
  );

  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeout, setTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("Search failed. Please try again.");
      setSearching(false);
    }
  };

  const isSearching = searchQuery.length > 0;
  const showHighlighted =
    !isSearching && highlightedVideos?.length > 0;

  return (
    <Layout>
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-screen-2xl px-4 pb-24 sm:px-6 md:px-8">

          {/* Page header */}
          <div className="pb-10 pt-12 text-center md:pb-12 md:pt-16">
            <h1 className="text-4xl font-bold tracking-tight text-header-100 sm:text-5xl md:text-6xl">
              Our Content
            </h1>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              Every production from the HillviewTV team
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 w-full max-w-md md:mt-10">
              <label htmlFor="search-videos" className="sr-only">
                Search videos
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                id="search-videos"
                type="text"
                className="h-12 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-10 text-sm shadow-sm placeholder:text-neutral-400 transition"
                placeholder="Search productions…"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={resetSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 transition hover:text-neutral-700"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Highlighted Content */}
          {showHighlighted && (
            <section className="mb-14">
              <SectionLabel title="Highlighted" />
              {highlightedVideos.length === 1 ? (
                <VideoPreview video={highlightedVideos[0].video} featured />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div className={clsx(highlightedVideos.length > 1 && "lg:col-span-2")}>
                    <VideoPreview video={highlightedVideos[0].video} featured />
                  </div>
                  {highlightedVideos.slice(1).map((i) => (
                    <VideoPreview key={i.video.id} video={i.video} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* All Videos */}
          <section>
            <SectionLabel
              title={
                isSearching ? `Results for "${searchQuery}"` : "All Videos"
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {searching ? (
                <div className="col-span-full flex justify-center py-20">
                  <SearchSpinner />
                </div>
              ) : videos.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-sm text-neutral-400">
                    No videos found for &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              ) : (
                videos.map((vid) => <VideoPreview key={vid.id} video={vid} />)
              )}
            </div>
          </section>

          {/* Load more */}
          {showLoadBtn && !searching && videos.length >= 24 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMoreVideos}
                className="rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow"
              >
                Load more videos
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  _context: GetServerSidePropsContext,
) => {
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
        title: "HillviewTV - All Videos",
        description:
          "Browse all videos from HillviewTV — daily announcements, PAC Broadcasts, and more from Hillview Middle School.",
        image: "https://content.hillview.tv/thumbnails/default.jpg",
        url: "https://hillview.tv/content",
        videos: videos,
        highlightedVideos: spotlight,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Content;
