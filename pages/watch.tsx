import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import toast from "react-hot-toast";

import QueryVideo from "../hooks/QueryVideo";
import { FetchAPI } from "../services/http/requestHandler";
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
  canonicalUrl: string;
}

const Watch = (props: PageProps) => {
  const router = useRouter();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: props.video.title,
    description: props.video.description,
    thumbnailUrl: props.video.thumbnail,
    uploadDate: new Date(props.video.inserted_at).toISOString(),
    url: props.canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "HillviewTV",
      url: "https://hillview.tv",
    },
  };


  let liveURL = props.video.url;

  if (
    props.video.url.includes("customer-nakrsdfbtn3mdz5z.cloudflarestream.com") ||
    props.video.url.includes("cloudflarestream.com") ||
    props.video.url.includes("videodelivery.net")
  ) {
    liveURL = liveURL.replaceAll("/manifest/video.m3u8", "/iframe");
  } else if (props.video.url.includes("vimeo")) {
    const match = liveURL.match(/\/external\/(\d+)\.m3u8/);
    if (match && match.length >= 2) {
      liveURL = "https://player.vimeo.com/video/" + match[1];
    } else {
      console.error("Vimeo URL not parseable:", liveURL);
    }
  }

  const [shareButtonText, setShareButtonText] = useState("Share");
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  useEffect(() => {
    const recordView = async () => {
      try {
        await FetchAPI({
          method: "POST",
          url: `/video/v1.1/recordView/${props.video.uuid}`,
        });
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };
    recordView();
  }, [props.video.uuid]);

  const recordDownload = async () => {
    try {
      await FetchAPI({
        method: "POST",
        url: `/video/v1.1/recordDownload/${props.video.uuid}`,
      });
    } catch (error) {
      console.error("Error recording download:", error);
    }
  };

  const handleDownload = async (url: string) => {
    if (!url) return;
    recordDownload();
    if (url.includes("customer-nakrsdfbtn3mdz5z.cloudflarestream.com")) {
      window.open(url, "_blank");
      return;
    }
    if (downloadInProgress) return;
    setDownloadInProgress(true);
    const startTime = Date.now();
    let lastProgress = 0;

    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: { Accept: "video/mp4", "Content-Type": "video/mp4" },
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 0;
          if (total === 0) return;
          const pct = Math.round((progressEvent.loaded / total) * 100);
          setProgress(pct);
          if (pct !== lastProgress) {
            const elapsed = Date.now() - startTime;
            setEta((elapsed / pct) * (100 - pct));
          }
          lastProgress = pct;
        },
      });

      const blob = response.data;
      const urlObject = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObject;
      link.download = props.video.title.replaceAll(" ", "_") + ".mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlObject);
      setDownloadInProgress(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download failed. Please try again.");
      setDownloadInProgress(false);
    }
  };

  const formatEta = (ms: number) => {
    if (progress === 0) return "Calculating…";
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    if (minutes === 0) return remaining < 30 ? "Less than a minute remaining" : `About ${remaining} seconds remaining`;
    return `About ${minutes} minute${minutes !== 1 ? "s" : ""} remaining`;
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareButtonText("Copied!");
    setTimeout(() => setShareButtonText("Share"), 3000);
  };

  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {/* ── Download progress overlay ── */}
      {downloadInProgress && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-neutral-150 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold text-header-100">Downloading video…</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              Exporting at the highest quality available. This may take a moment.
            </p>
            <div className="mt-4 overflow-hidden rounded-full bg-neutral-100" style={{ height: 6 }}>
              <div
                className="h-full rounded-full bg-primary-100 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-neutral-400">{formatEta(eta)}</p>
              <p className="text-xs font-semibold text-header-100">{progress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-20 pt-8 sm:pt-10">
        {/* ── Back link ── */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors duration-150 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* ── Video player ── */}
        <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-neutral-150">
          <div className="relative pt-[56.25%]">
            <iframe
              src={
                liveURL +
                "?preload=auto&poster=" +
                props.video.thumbnail +
                "&fit=clip&width=1280&height=720"
              }
              className="absolute inset-0 h-full w-full border-none"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* ── Title & meta ── */}
        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-header-100 sm:text-3xl lg:text-4xl">
              {props.video.title}
            </h1>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2">
              {props.video.allow_downloads && props.video.download_url && (
                <button
                  onClick={() => handleDownload(props.video.download_url!)}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              )}
              <button
                onClick={shareLink}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#0d6efd]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareButtonText}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-7 w-7 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-1 ring-neutral-150"
              style={{ backgroundImage: "url(https://content.hillview.tv/images/mobile/default.jpg)" }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-neutral-700">HillviewTV Team</span>
            <span className="text-neutral-300" aria-hidden="true">·</span>
            <span className="text-sm text-neutral-400">{props.video.ft}</span>
          </div>

          {/* Divider */}
          <div className="mt-5 border-t border-neutral-150" />

          {/* Description */}
          {props.video.description && (
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-500">
              {props.video.description}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const raw = context.query.v;
    const q = Array.isArray(raw) ? raw[0] : raw;
    const data = await QueryVideo(q);

    if (data) {
      data.ft = DateTime.fromISO(data.inserted_at.toString()).toFormat("MMMM dd, yyyy");
      const canonicalUrl = `https://hillview.tv/watch?v=${data.uuid}`;
      return {
        props: {
          title: data.title + " - HillviewTV",
          image: data.thumbnail,
          description: data.description,
          url: canonicalUrl,
          ogType: "video.other",
          video: data,
          canonicalUrl,
        },
      };
    } else {
      return {
        redirect: { destination: "/content", permanent: false },
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default Watch;
