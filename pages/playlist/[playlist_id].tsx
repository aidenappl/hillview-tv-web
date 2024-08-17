import type { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
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
      <div className="content-page flex h-fit w-full items-center justify-center pb-[100px]">
        <div className="w-11/12 h-fit max-w-screen-2xl">
          {/* Header */}
          <div className="header flex h-[275px] w-full items-center justify-center md:h-[400px]">
            <div className="items-center pb-20 center-object">
              <h1 className="text-4xl font-semibold text-center sm:text-5xl md:text-6xl">
                {props.playlist.name}
              </h1>
              <Link href={"/playlists"}>
                <a className="absolute mt-8 full-x-center">
                  <button className="h-[40px] w-[130px] rounded-md bg-primary-100 font-normal text-white">
                    Go Back
                  </button>
                </a>
              </Link>
            </div>
          </div>

          {/* Video List */}
          <div className="flex flex-wrap justify-around w-full gap-12 pb-10 video-list h-fit sm:gap-10">
            {props.playlist.videos.map((i) => {
              return (
                <Link href={"/watch?v=" + i.uuid} key={i.url}>
                  <a>
                    <div className="video group relative h-[180px] w-[320px] md:h-[315px] md:w-[560px]">
                      <div className="relative w-full h-full overflow-hidden video">
                        <div className="absolute top-0 left-0 z-30 w-full h-full p-10 text-white duration-300 ease-in-out opacity-0 video-data sm:group-hover:opacity-100">
                          <h1 className="pb-5 text-4xl font-semibold">
                            {i.title}
                          </h1>
                          <p className="line-clamp-5">{i.description}</p>
                        </div>
                        <div className="absolute z-20 flex items-center justify-center w-full h-full duration-200 ease-in-out scale-100 video-play opacity-1 sm:group-hover:scale-75 sm:group-hover:opacity-0">
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
                        <div className="absolute z-10 w-full h-full duration-300 ease-in-out bg-black opacity-0 video-background sm:group-hover:opacity-40"></div>
                        <div className="relative w-full h-full duration-300 ease-in-out video-thumbnail sm:group-hover:scale-110">
                          <ContentImage image={i.thumbnail} alt={i.title} />
                        </div>
                      </div>
                      <h1 className="text-md absolute bottom-[-30px] font-medium text-neutral-800 sm:hidden">
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
      `https://api.hillview.tv/video/v1.1//read/playlist?route=${route}`,
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
