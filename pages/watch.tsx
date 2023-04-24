import type { GetServerSideProps, NextPage } from "next";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import qualitySelector from "videojs-hls-quality-selector";
import qualityLevels from "videojs-contrib-quality-levels";
import "video.js/dist/video-js.css";
import { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import VideoPlayer from "../components/Player/Player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

interface GeneralNSM {
  id: number;
  name: string;
  short_name: string;
}

interface Video {
  ft: string;
  id: number;
  uuid: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  download_url?: string;
  allow_downloads: boolean;
  status: GeneralNSM;
  inserted_at: Date;
}

interface PageProps {
  video: Video;
}

const Watch = (props: PageProps) => {
  const router = useRouter();

  const videoRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [player, setPlayer] = useState({} as VideoJsPlayer);

  let liveURL = props.video.url.replaceAll("/manifest/video.m3u8", "/iframe");

  const [shareButtonText, updateShareButtonText] = useState("Share Video");

  useEffect(() => {
    initPlayer();
  }, []);

  const initPlayer = () => {
    if (videoRef.current) {
      const videoJsOptions: VideoJsPlayerOptions = {
        preload: "auto",
        autoplay: "any",
        controls: true,
        fluid: true,
        responsive: true,
        sources: [
          {
            src: liveURL,
            type: "application/x-mpegURL",
          },
        ],
      };

      videojs.registerPlugin("hlsQualitySelector", qualitySelector);
      videojs.registerPlugin("qualityLevels", qualityLevels);

      const p = videojs(
        videoRef.current,
        videoJsOptions,
        function onPlayerReaady() {
          console.log("onPlayerReady");
        }
      );

      setPlayer(p);

      player.qualityLevels();
      player.hlsQualitySelector({ displayCurrentQuality: true });

      return () => {
        if (player) player.dispose();
      };
    }
  };

  const shareLink = () => {
    let fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl);
    updateShareButtonText("Link Copied!");

    setTimeout(() => {
      updateShareButtonText("Share Video");
    }, 3000);
  };

  return (
    <Layout>
      {!props.video ? (
        ""
      ) : (
        <div className="watch-page w-full h-fit flex justify-center items-center">
          <div className="w-11/12 max-w-screen-xl h-fit">
            {/* Header Breadcrumbs */}
            <div className="breadcrumb-container w-full h-[100px] flex items-center ">
              <div
                onClick={() => router.back()}
                className="back-btn relative w-[50px] h-[50px] bg-white rounded-[15px] border-2 border-neutral-150 cursor-pointer flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    _ngcontent-waj-c10=""
                    points="15 18 9 12 15 6"
                  ></polyline>
                </svg>
              </div>
              <p className="text-lg">
                <Link href="/content">
                  <a className="pl-3 text-primary-100 font-semibold cursor-pointer">
                    Videos
                  </a>
                </Link>{" "}
                → {props.video.title}
              </p>
            </div>

            {/* Video Container */}
            <div className="video-container w-full h-fit">
              {/* <VideoPlayer url={props.video.url} /> */}
              <div className="relative pt-[56.25%]">
                <iframe
                  src={
                    liveURL + "?preload=auto&poster=" + props.video.thumbnail
                  }
                  className="border-none absolute top-0 h-full w-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
            </div>

            {/* Title & Video info Container */}
            <div className="title-container w-full h-fit mt-10">
              <div className="title-info-container w-full h-fit relative">
                <h1 className="text-3xl sm:text-5xl font-medium">
                  {props.video.title}
                </h1>
                <div className="title-runner flex items-center w-fit h-[60px] mt-1 mb-6">
                  <div className="avatar rounded-full bg-[url(https://content.hillview.tv/images/mobile/default.jpg)] bg-cover bg-no-repeat bg-center w-[30px] h-[30px]"></div>
                  <p className="ml-3 font-medium text-neutral-800">
                    HillviewTV Team
                  </p>
                  <p className="ml-6 font-light text-neutral-600">
                    {props.video.ft}
                  </p>
                </div>
                <div className="absolute right-0 full-vertical flex items-center gap-4">
                  {props.video.allow_downloads && props.video.download_url ? (
                    <div
                      className="cursor-pointer group"
                      onClick={() => {
                        // new JsFileDownloader({
                        // 	url: props.video
                        // 		.download_url,
                        // })
                        // 	.then(function () {
                        // 		// Called when download ended
                        // 	})
                        // 	.catch(function (error) {
                        // 		// Called when an error occurred
                        // 	});
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="text-xl text-neutral-600 group-hover:text-neutral-900 transition cursor-pointer"
                      />
                      <a
                        href={props.video.download_url}
                        className="hidden"
                        id="download-video-a"
                        download
                      />
                    </div>
                  ) : null}
                  <button
                    onClick={() => {
                      shareLink();
                    }}
                    className="hidden sm:block w-[150px] h-[45px] bg-primary-100 duration-200 text-white rounded-sm hover:bg-[#2b55c5]"
                  >
                    {shareButtonText}
                  </button>
                </div>
              </div>
              <div className="hr w-full h-[2px] bg-neutral-200"></div>
              <div className="w-full h-fit py-10 whitespace-pre-wrap">
                <p>{props.video.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    let q = context.query.v;
    const response = await fetch(
      "https://api.hillview.tv/video/v1.1/video/" + q
    );

    if (response.ok) {
      const data = await response.json();
      data.ft = DateTime.fromISO(data.inserted_at.toString()).toFormat(
        "MMMM dd, yyyy"
      );
      return {
        props: {
          title: data.title,
          image: data.thumbnail,
          description: data.description,
          video: data,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/content",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default Watch;
