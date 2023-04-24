import type { GetServerSideProps, NextPage } from "next";
import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { Video } from "../content";

interface PlaylsitPageProps {
  playlist: Playlist;
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

interface GeneralNSM {
  id: number;
  name: string;
  short_name: string;
}

const Playlist = (props: PlaylsitPageProps) => {
  return (
    <Layout>
      <div className="content-page w-full h-fit flex justify-center items-center pb-[100px]">
        <div className="w-11/12 max-w-screen-2xl h-fit">
          {/* Header */}
          <div className="header h-[275px] md:h-[400px] w-full flex justify-center items-center">
            <div className="center-object pb-20 items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
                {props.playlist.name}
              </h1>
              <Link href={"/playlists"}>
                <a className="full-x-center absolute mt-8">
                  <button className="w-[130px] h-[40px] bg-primary-100 rounded-md text-white font-normal">
                    Go Back
                  </button>
                </a>
              </Link>
            </div>
          </div>

          {/* Video List */}
          <div className="video-list h-fit w-full flex justify-around flex-wrap gap-12 sm:gap-10 pb-10">
            {props.playlist.videos.map((i) => {
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    let route = context.params.playlist_id;

    const response = await fetch(
      `https://api.hillview.tv/video/v1.1//read/playlist?route=${route}`
    );

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const playlist = await response.json();

    return {
      props: {
        playlist: playlist,
        title: playlist.name,
        description: playlist.description,
        image: playlist.banner_image,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default Playlist;
