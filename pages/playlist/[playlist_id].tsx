import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Video } from "../content";
import QueryPlaylist from "../../hooks/QueryPlaylist";
import VideoPreview from "../../components/ContentPage/VideoPreview";

interface PlaylistPageProps {
  playlist: Playlist;
  canonicalUrl: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  banner_image: string;
  route: string;
  inserted_at: Date;
  videos: Video[];
}

const Playlist = (props: PlaylistPageProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: props.playlist.name,
    description: props.playlist.description,
    url: props.canonicalUrl,
    itemListElement: props.playlist.videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://hillview.tv/watch?v=${v.uuid}`,
      name: v.title,
    })),
  };

  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-screen-2xl px-4 pb-24 sm:px-6 md:px-8">
          {/* Hero banner */}
          <div className="relative mt-8 overflow-hidden rounded-2xl md:mt-10">
            {/* Banner image */}
            <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
              <Image
                src={props.playlist.banner_image}
                alt={props.playlist.name}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1536px) 100vw, 1536px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
              {/* Back link */}
              <div>
                <Link
                  href="/playlists"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  All Playlists
                </Link>
              </div>

              {/* Title + meta at bottom */}
              <div>
                <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl">
                  {props.playlist.name}
                </h1>
                {props.playlist.description && (
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/70 sm:text-base">
                    {props.playlist.description}
                  </p>
                )}
                <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-widest text-white/50">
                  {props.playlist.videos.length}{" "}
                  {props.playlist.videos.length === 1 ? "video" : "videos"}
                </p>
              </div>
            </div>
          </div>

          {/* Section label */}
          <div className="mb-1 mt-10 flex items-center gap-4">
            <span className="shrink-0 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-400">
              Videos
            </span>
            <div className="h-px w-full bg-neutral-150" />
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {props.playlist.videos.map((video) => (
              <VideoPreview key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const route = context.params!.playlist_id as string;
    const response = await QueryPlaylist(route);

    if (!response) {
      return { notFound: true };
    }

    const canonicalUrl = `https://hillview.tv/playlist/${response.route}`;
    return {
      props: {
        playlist: response,
        title: response.name + " - HillviewTV",
        description: response.description,
        image: response.banner_image,
        url: canonicalUrl,
        canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return { notFound: true };
  }
};

export default Playlist;
