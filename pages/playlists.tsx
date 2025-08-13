import type { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import ContentImage from "../components/ContentImage";
import QueryPlaylists from "../hooks/QueryPlaylists";
interface PlaylistsPageProps {
  playlists: Playlist[];
}

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

const Playlists = (props: PlaylistsPageProps) => {
  return (
    <Layout>
      <div className="playlist-page relative flex h-fit w-full items-center justify-center">
        <div className="h-fit w-11/12 max-w-screen-2xl">
          {/* Header */}
          <div className="header flex h-[150px] w-full items-center justify-center md:h-[350px]">
            <div className="center-object">
              <h1 className="text-center text-4xl font-semibold sm:text-5xl md:text-6xl">
                Playlists
              </h1>
              <p className="pt-2 text-[#9493a3] md:pt-4 md:text-xl">
                A more curated look at our content
              </p>
            </div>
          </div>
          {/* Content */}
          <div className="content flex h-fit w-full justify-center">
            <div className="flex h-fit w-full max-w-[900px] flex-col gap-4 pb-[100px]">
              {props.playlists.map((i) => {
                return (
                  <Link href={"/playlist/" + i.route} key={i.id}>
                    <div className="relative flex w-full cursor-pointer items-center rounded-lg border-2 border-neutral-100 bg-neutral-50 p-3 shadow-md">
                      <div className="avatar relative block h-[65px] w-[80px] flex-shrink-0 overflow-hidden rounded-lg sm:w-[100px]">
                        <ContentImage image={i.banner_image} alt={i.name} />
                      </div>
                      <h1 className="ml-5 line-clamp-1 w-[calc(100%-100px)] max-w-full overflow-ellipsis pr-2 text-lg font-medium sm:text-xl">
                        {i.name}
                      </h1>
                      <button className="hidden whitespace-nowrap rounded-md bg-primary-100 px-5 py-2 font-normal text-white sm:block">
                        View Playlist
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
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
        playlists: response,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Playlists;
