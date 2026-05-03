import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import ContentImage from "../components/ContentImage";
import QueryPlaylists from "../hooks/QueryPlaylists";

export interface Playlist {
  id: number;
  name: string;
  description: string;
  banner_image: string;
  route: string;
  inserted_at: Date;
  videos: Video[];
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

interface PlaylistsPageProps {
  playlists: Playlist[];
}

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
  <Link href={"/playlist/" + playlist.route}>
    <div className="group relative p-3">
      {/* Blue background — scales out on hover */}
      <div className="absolute inset-0 scale-95 rounded-2xl bg-primary-100/10 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />

      {/* Horizontal card */}
      <div className="relative flex items-center gap-4 rounded-xl border border-neutral-150 bg-white p-3 shadow-sm transition-all duration-300 group-hover:border-primary-100/30 group-hover:shadow-md sm:gap-5">
        {/* Thumbnail */}
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-sm sm:w-44 md:w-52">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
            <ContentImage image={playlist.banner_image} alt={playlist.name} />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-header-100 transition-colors duration-200 group-hover:text-primary-100 sm:text-lg">
              {playlist.name}
            </h3>
            <span className="mt-0.5 shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[0.65rem] font-semibold text-neutral-500">
              {playlist.videos.length}{" "}
              {playlist.videos.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {playlist.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {playlist.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View Playlist
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const Playlists = (props: PlaylistsPageProps) => {
  const totalVideos = props.playlists.reduce(
    (sum, p) => sum + p.videos.length,
    0,
  );

  return (
    <Layout>
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-screen-2xl px-4 pb-24 sm:px-6 md:px-8">

          {/* Page header */}
          <div className="pb-10 pt-12 text-center md:pb-12 md:pt-16">
            <h1 className="text-4xl font-bold tracking-tight text-header-100 sm:text-5xl md:text-6xl">
              Playlists
            </h1>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              {props.playlists.length} playlists &middot; {totalVideos} videos
            </p>
          </div>

          {/* Section label */}
          <div className="mb-1 flex items-center gap-4">
            <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-400">
              All Playlists
            </span>
            <div className="h-px w-full bg-neutral-150" />
          </div>

          {/* Horizontal list — 1 col on mobile, 2 cols on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {props.playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  _context: GetServerSidePropsContext,
) => {
  try {
    const response = await QueryPlaylists();

    if (response.length === 0) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        title: "HillviewTV - Playlists",
        description:
          "Explore curated playlists from HillviewTV covering Hillview Middle School productions, announcements, and special broadcasts.",
        image: "https://content.hillview.tv/thumbnails/default.jpg",
        url: "https://hillview.tv/playlists",
        playlists: response,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Playlists;
