import Link from "next/link";
import { Video } from "../../pages/content";
import ContentImage from "../ContentImage";

type VideoPreviewProps = {
  video: Video;
};

const VideoPreview = (props: VideoPreviewProps) => {
  return (
    <Link href={"/watch?v=" + props.video.uuid} key={props.video.url}>
      <a>
        <div className="video group relative h-[180px] w-[320px] shadow-md md:h-[275px] md:w-[460px]">
          <div className="video relative h-full w-full overflow-hidden">
            <div className="video-data absolute left-0 top-0 z-30 h-full w-full p-10 text-white opacity-0 duration-300 ease-in-out sm:group-hover:opacity-100">
              <h1 className="pb-3 text-3xl font-semibold">
                {props.video.title}
              </h1>
              <p className="line-clamp-5 text-sm">{props.video.description}</p>
            </div>
            <div className="video-play opacity-1 absolute z-20 flex h-full w-full scale-100 items-center justify-center duration-200 ease-in-out sm:group-hover:scale-75 sm:group-hover:opacity-0">
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
            <div className="video-background absolute z-10 h-full w-full bg-black opacity-0 duration-300 ease-in-out sm:group-hover:opacity-70"></div>
            <div className="video-thumbnail relative h-full w-full duration-300 ease-in-out sm:group-hover:scale-110">
              <ContentImage
                image={props.video.thumbnail}
                alt={props.video.title}
              />
            </div>
          </div>
          <h1 className="text-md absolute bottom-[-30px] w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-nowrap font-medium text-neutral-700">
            {props.video.title}
          </h1>
        </div>
      </a>
    </Link>
  );
};

export default VideoPreview;
