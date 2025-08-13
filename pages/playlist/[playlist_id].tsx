import type { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Link from "next/link";
import ContentImage from "../../components/ContentImage";
import { Video } from "../content";
import QueryPlaylist from "../../hooks/QueryPlaylist";
import VideoPreview from "../../components/ContentPage/VideoPreview";

interface PlaylistPageProps {
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

const Playlist = (props: PlaylistPageProps) => {
  return (
    <Layout>
      <div className="content-page flex h-fit w-full items-center justify-center pb-[100px]">
        <div className="h-fit w-11/12 max-w-screen-2xl">
          {/* Header */}
          <div className="header flex h-[275px] w-full items-center justify-center md:h-[400px]">
            <div className="center-object items-center pb-20">
              <h1 className="text-center text-4xl font-semibold sm:text-5xl md:text-6xl">
                {props.playlist.name}
              </h1>
              <Link href={"/playlists"}>
                <a className="full-x-center absolute mt-8">
                  <button className="h-[40px] w-[130px] rounded-md bg-primary-100 font-normal text-white">
                    Go Back
                  </button>
                </a>
              </Link>
            </div>
          </div>

          {/* Video List */}
          <div className="video-list flex h-fit w-full flex-wrap justify-around gap-12 pb-10 sm:gap-10">
            {props.playlist.videos.map((i) => {
              return <VideoPreview key={i.id} video={i} />;
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

    const response = await QueryPlaylist(route);

    if (!response) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        playlist: response,
        title: response.name,
        description: response.description,
        image: response.banner_image,
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
