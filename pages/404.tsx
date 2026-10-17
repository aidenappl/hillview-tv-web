import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";

const NotFound: NextPage = () => {
  return (
    <Layout>
      <section className="relative flex flex-1 items-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Sun — right side */}
        <div
          className="pointer-events-none absolute top-1/2 right-[-4%] hidden -translate-y-1/2 select-none lg:block"
          aria-hidden="true"
        >
          <div
            className="relative h-[520px] w-[520px]"
            style={{
              opacity: 0.18,
              maskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 65%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 65%)",
            }}
          >
            <Image
              src="/assets/logos/sun.png"
              alt=""
              fill
              sizes="520px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-(--breakpoint-xl)">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary-100 h-px w-6" aria-hidden="true" />
              <span className="text-primary-100 text-xs font-semibold tracking-[0.14em] uppercase">
                Error 404 &middot; Page Not Found
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-header-100 text-[3rem] leading-[1.05] font-black tracking-tight sm:text-6xl lg:text-[5rem]">
              This channel&apos;s
              <span className="text-primary-100"> off the air.</span>
            </h1>

            {/* Subline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              We couldn&apos;t find the page you were looking for. It may have
              been moved, removed, or never existed. Let&apos;s get you back to
              something worth watching.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="bg-primary-100 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#0d6efd]"
              >
                Back to Home
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                href="/content"
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-700 transition-colors duration-150 hover:bg-neutral-50"
              >
                Browse Content
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
