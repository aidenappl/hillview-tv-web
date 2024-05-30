import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

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

  console.log(props.video.url);
  let liveURL = props.video.url;

  if (
    props.video.url.includes(
      "customer-nakrsdfbtn3mdz5z.cloudflarestream.com"
    ) ||
    props.video.url.includes("cloudflarestream.com") ||
    props.video.url.includes("videodelivery.net")
  ) {
    // Cloudflare Video
    liveURL = liveURL.replaceAll("/manifest/video.m3u8", "/iframe");
  } else if (props.video.url.includes("vimeo")) {
    // Vimeo Video
    const regex = /\/external\/(\d+)\.m3u8/;
    const match = liveURL.match(regex);
    if (match === null || match.length < 2) {
      console.error("Vimeo URL not found");
    }
    liveURL = "https://player.vimeo.com/video/" + match![1];
  }

  const [shareButtonText, updateShareButtonText] = useState("Share Video");
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  useEffect(() => {
    recordView();
  }, []);

  const handleDownload = async (url: string) => {
    if (url === undefined) return;
    if (url.includes("customer-nakrsdfbtn3mdz5z.cloudflarestream.com")) {
      console.log("Opening in new tab");
      window.open(url, "_blank");
      return;
    }
    if (downloadInProgress) return;
    setDownloadInProgress(true);
    let startTime = Date.now();
    let lastProgress = 0;

    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Accept: "video/mp4",
          "Content-Type": "video/mp4",
        },
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(progress);
          if (progress != lastProgress) {
            const elapsedTime = Date.now() - startTime!;
            const remainingTime = (elapsedTime / progress) * (100 - progress);
            setEta(remainingTime);
          }
          lastProgress = progress;
        },
      });
      console.log(response);

      const blob = response.data;
      const urlObject = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObject;
      link.download = props.video.title.replaceAll(" ", "_") + ".mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloadInProgress(false);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const formatTime = (milliseconds: any) => {
    const seconds = Math.round(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (progress === 0) {
      return "Calculating...";
    }
    if (minutes === 0) {
      if (remainingSeconds < 30) {
        return `Less than a minute remaining...`;
      }
      return `About ${remainingSeconds} seconds remaining...`;
    }
    return `About ${minutes} minutes remaining...`;
  };

  const recordView = async () => {
    try {
      let response = await axios({
        method: "POST",
        url: `https://api.hillview.tv/video/v1.1/recordView/${props.video.uuid}`,
      });
      if (response.status === 204) {
        console.log("View Recorded");
      } else {
        console.log("View Not Recorded");
      }
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <Layout>
      {downloadInProgress ? (
        <div className="w-full h-screen fixed top-0 left-0 flex items-end justify-center z-10 pointer-events-none">
          <div className="bg-white px-6 py-5 rounded-md shadow-lg border-[1px] border-slate-100 w-4/5 max-w-[700px] mb-10 flex flex-col gap-1">
            <h2 className="font-semibold text-slate-900">
              Downloading Video...
            </h2>
            <p className="text-slate-500 font-light">
              We are currently exporting your video. This can take some time as
              we try to give you the highest quality possible.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-full h-[30px] border-2 border-[#739dd8] relative rounded-md overflow-hidden">
                <div
                  id="progress-bar"
                  className={`z-10 h-full bg-primary-100 absolute top-0 left-0`}
                ></div>
              </div>
              <p className="font-semibold">{progress}%</p>
            </div>
            <p className="whitespace-nowrap text-slate-700">
              {formatTime(eta)}
            </p>
          </div>
        </div>
      ) : null}
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
                <h1 className="text-3xl sm:text-5xl font-medium w-full pr-[150px]">
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
                      className="cursor-pointer group w-[20px] h-[20px]"
                      onClick={async () => {
                        try {
                          handleDownload(props.video.download_url!);
                        } catch (error) {
                          console.error(
                            "Error downloading the MP4 file:",
                            error
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="text-xl text-neutral-600 group-hover:text-neutral-900 transition cursor-pointer"
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
