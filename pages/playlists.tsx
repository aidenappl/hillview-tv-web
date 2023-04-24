import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Image from "next/image";
import ContentImage from "../components/ContentImage";
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
      <div className="playlist-page w-full h-fit flex justify-center items-center relative">
        <div className="w-11/12 max-w-screen-2xl h-fit">
          {/* Header */}
          <div className="header h-[150px] md:h-[350px] w-full flex justify-center items-center">
            <div className="center-object">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
                Playlists
              </h1>
              <p className="pt-2 md:pt-4 text-[#9493a3] md:text-xl">
                A more curated look at our content
              </p>
            </div>
          </div>
          {/* Content */}
          <div className="content w-full h-fit flex justify-center">
            <div className="w-full max-w-[900px] h-fit flex flex-col gap-4">
              {props.playlists.map((i) => {
                return (
                  <Link href={"/playlist/" + i.route} key={i.id}>
                    <div className="cursor-pointer p-3 w-full bg-neutral-50 rounded-lg shadow-md border-2 border-neutral-100 flex items-center relative">
                      <div className="avatar w-[80px] sm:w-[100px] h-[65px] rounded-lg relative overflow-hidden block flex-shrink-0">
                        <ContentImage image={i.banner_image} alt={i.name} />
                      </div>
                      <h1 className="pr-2 line-clamp-1 font-medium overflow-ellipsis max-w-full text-lg sm:text-xl ml-5 w-[calc(100%-100px)]">
                        {i.name}
                      </h1>
                      <button className="hidden sm:block px-5 whitespace-nowrap py-2 bg-primary-100 rounded-md text-white font-normal">
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
    const response = await fetch(
      "https://api.hillview.tv/video/v1.1/list/playlists?limit=24&offset=0"
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
        title: "HillviewTV - Playlists",
        playlists: data,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default Playlists;
