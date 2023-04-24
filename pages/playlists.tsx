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
          <div className="header h-[150px] md:h-[400px] w-full flex justify-center items-center">
            <div className="center-object">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
                Playlists
              </h1>
            </div>
          </div>
          {/* Content */}
          <div className="content w-full h-fit flex justify-center">
            <div className="w-fit h-fit">
              {props.playlists.map((i) => {
                return (
                  <Link href={"/playlist/" + i.route} key={i.id}>
                    <a>
                      <div className="w-full sm:w-[750px] h-[85px] bg-neutral-50 basis-5 mb-6 rounded-lg shadow-md border-2 border-neutral-100 flex items-center relative">
                        <div className="avatar w-[80px] sm:w-[120px] h-[70px] rounded-lg ml-1 relative overflow-hidden block">
                          <ContentImage image={i.banner_image} alt={i.name} />
                        </div>
                        <h1 className="font-medium text-lg sm:text-xl ml-5 w-[calc(100%-100px)]">
                          {i.name}
                        </h1>
                        <button className="w-[130px] h-[40px] bg-primary-100 rounded-md text-white font-normal">
                          View Playlist
                        </button>
                      </div>
                    </a>
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
