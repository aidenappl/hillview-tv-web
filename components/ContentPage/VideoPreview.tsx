import Link from "next/link";
import clsx from "clsx";
import { Video } from "../../pages/content";
import ContentImage from "../ContentImage";
import { formatDuration } from "../../lib/video";

type VideoPreviewProps = {
  video: Video;
  featured?: boolean;
};

const VideoPreview = ({ video, featured = false }: VideoPreviewProps) => {
  return (
    <Link href={"/watch?v=" + video.uuid}>
      {/* Outer wrapper: p-4 padding, background animates out from the card */}
      <div className="group relative p-4">
        {/* Blue background — scales out + fades in on hover */}
        <div className="absolute inset-0 scale-95 rounded-2xl bg-primary-100/10 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />

        {/* Inner card */}
        <div
          className={clsx(
            "relative cursor-pointer overflow-hidden rounded-xl shadow-sm ring-1 ring-transparent transition-all duration-300 group-hover:shadow-md group-hover:ring-primary-100/40",
            featured ? "aspect-video sm:aspect-[21/9]" : "aspect-video",
          )}
        >
          {/* Thumbnail */}
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
            <ContentImage
              image={video.thumbnail}
              alt={video.title}
              priority={featured}
            />
          </div>

          {/* Duration badge */}
          {formatDuration(video.duration) && (
            <span className="absolute right-2 top-2 z-10 rounded bg-black/75 px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums text-white">
              {formatDuration(video.duration)}
            </span>
          )}

          {/* Gradient */}
          <div
            className={clsx(
              "absolute inset-0 bg-gradient-to-t",
              featured
                ? "from-black/90 via-black/30 to-transparent"
                : "from-black/80 via-black/25 to-transparent",
            )}
          />

          {/* Bottom content */}
          <div
            className={clsx(
              "absolute bottom-0 left-0 right-0",
              featured ? "p-5 sm:p-7" : "p-4",
            )}
          >
            {featured ? (
              <>
                {video.ft && (
                  <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-wider text-white/60">
                    {video.ft}
                  </p>
                )}
                <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-white sm:text-2xl md:text-3xl">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-white/70 sm:text-base">
                    {video.description}
                  </p>
                )}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-white/30">
                    Watch Now
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Title + date — slides up on hover */}
                <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
                  {video.ft && (
                    <p className="mb-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-white/60">
                      {video.ft}
                    </p>
                  )}
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-base">
                    {video.title}
                  </h3>
                </div>

                {/* Description — expands + fades in on hover */}
                <div className="max-h-0 overflow-hidden transition-[max-height] duration-300 ease-out group-hover:max-h-14">
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/75 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                    {video.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoPreview;
