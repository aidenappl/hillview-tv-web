import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import toast from "react-hot-toast";

import QueryVideo from "../hooks/QueryVideo";
import { FetchAPI } from "../services/http/requestHandler";
import JsonLd from "../components/JsonLd";
import {
  getEmbedUrl,
  getContentUrl,
  toIso8601Duration,
  formatDuration,
} from "../lib/video";

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
  cloudflare_id?: string;
  download_url?: string;
  allow_downloads: boolean;
  duration?: number;
  views?: number;
  status: GeneralNSM;
  inserted_at: Date;
}

interface PageProps {
  video: Video;
  canonicalUrl: string;
}

type PlayerSource = { type: "iframe"; src: string } | { type: "unavailable" };

const resolvePlayerSource = (video: Video): PlayerSource => {
  const embed = getEmbedUrl(video);
  if (!embed) {
    console.error("Unrecognized video URL format:", video.url);
    return { type: "unavailable" };
  }

  // Cloudflare's iframe player takes poster + sizing params; others embed clean.
  if (
    embed.includes("cloudflarestream.com") ||
    embed.includes("videodelivery.net")
  ) {
    const params = new URLSearchParams({
      preload: "auto",
      poster: video.thumbnail ?? "",
      fit: "clip",
      width: "1280",
      height: "720",
    });
    return { type: "iframe", src: `${embed}?${params.toString()}` };
  }

  return { type: "iframe", src: embed };
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy fallback
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
};

const Watch = (props: PageProps) => {
  const router = useRouter();

  const uploadDate = new Date(props.video.inserted_at);
  const embedUrl = getEmbedUrl(props.video);
  const contentUrl = getContentUrl(props.video);
  const isoDuration = toIso8601Duration(props.video.duration);
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: props.video.title,
    description: props.video.description,
    thumbnailUrl: props.video.thumbnail,
    ...(isNaN(uploadDate.getTime())
      ? {}
      : { uploadDate: uploadDate.toISOString() }),
    ...(embedUrl ? { embedUrl } : {}),
    ...(contentUrl ? { contentUrl } : {}),
    ...(isoDuration ? { duration: isoDuration } : {}),
    ...(props.video.views && props.video.views > 0
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "https://schema.org/WatchAction" },
            userInteractionCount: props.video.views,
          },
        }
      : {}),
    url: props.canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "HillviewTV",
      url: "https://hillview.tv",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hillview.tv" },
      { "@type": "ListItem", position: 2, name: "Content", item: "https://hillview.tv/content" },
      { "@type": "ListItem", position: 3, name: props.video.title, item: props.canonicalUrl },
    ],
  };

  const player = resolvePlayerSource(props.video);

  const [shareButtonText, setShareButtonText] = useState("Share");

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

  const handleDownload = (url: string) => {
    if (!url) return;
    recordDownload();
    const href =
      "/api/download?url=" +
      encodeURIComponent(url) +
      "&filename=" +
      encodeURIComponent(props.video.title);
    const link = document.createElement("a");
    link.href = href;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Download started — check your browser's downloads.");
  };

  const shareLink = async () => {
    const copied = await copyToClipboard(window.location.href);
    if (!copied) {
      toast.error(
        "Couldn't copy the link — please copy it from the address bar.",
      );
      return;
    }
    setShareButtonText("Copied!");
    setTimeout(() => setShareButtonText("Share"), 3000);
  };

  return (
    <Layout>
      <JsonLd data={[videoJsonLd, breadcrumbJsonLd]} />

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        {/* ── Video player ── */}
        {player.type === "iframe" ? (
          <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-neutral-150">
            <div className="relative pt-[56.25%]">
              <iframe
                src={player.src}
                className="absolute inset-0 h-full w-full border-none"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-150 bg-neutral-50 px-6 py-24 text-center">
            <p className="text-base font-semibold text-header-100">
              This video is currently unavailable
            </p>
            <p className="text-sm text-neutral-400">
              Please check back later, or browse the rest of our content.
            </p>
            <Link
              href="/content"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-100 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#0d6efd]"
            >
              Browse Content
            </Link>
          </div>
        )}

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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {shareButtonText}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-7 w-7 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-1 ring-neutral-150"
              style={{
                backgroundImage:
                  "url(https://content.hillview.tv/images/mobile/default.jpg)",
              }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-neutral-700">
              HillviewTV Team
            </span>
            <span className="text-neutral-300" aria-hidden="true">
              ·
            </span>
            <span className="text-sm text-neutral-400">{props.video.ft}</span>
            {formatDuration(props.video.duration) && (
              <>
                <span className="text-neutral-300" aria-hidden="true">
                  ·
                </span>
                <span className="text-sm tabular-nums text-neutral-400">
                  {formatDuration(props.video.duration)}
                </span>
              </>
            )}
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
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );
  try {
    const raw = context.query.v;
    const q = Array.isArray(raw) ? raw[0] : raw;
    const data = await QueryVideo(q);

    if (data) {
      const inserted = DateTime.fromISO(data.inserted_at.toString());
      data.ft = inserted.isValid ? inserted.toFormat("MMMM dd, yyyy") : "";
      const canonicalUrl = `https://hillview.tv/watch?v=${data.uuid}`;
      const embedUrl = getEmbedUrl(data);
      return {
        props: {
          title: data.title + " - HillviewTV",
          image: data.thumbnail,
          imageWidth: 1280,
          imageHeight: 720,
          ...(embedUrl
            ? { videoUrl: embedUrl, videoWidth: 1280, videoHeight: 720 }
            : {}),
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
    console.error("Error loading watch page:", error);
    return {
      redirect: { destination: "/content", permanent: false },
    };
  }
};

export default Watch;
