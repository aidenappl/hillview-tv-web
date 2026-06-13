import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";

const ServerError: NextPage = () => {
  return (
    <Layout>
      <section className="relative flex flex-1 items-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Sun — right side */}
        <div
          className="pointer-events-none absolute right-[-4%] top-1/2 hidden -translate-y-1/2 select-none lg:block"
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

        <div className="relative z-10 mx-auto w-full max-w-screen-xl">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-6 bg-primary-100" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100">
                Error 500 &middot; Something Went Wrong
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[3rem] font-black leading-[1.05] tracking-tight text-header-100 sm:text-6xl lg:text-[5rem]">
              We hit some
              <span className="text-primary-100"> technical difficulties.</span>
            </h1>

            {/* Subline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              An unexpected error occurred on our end. Our team has been
              notified. Try refreshing the page, or head back home while we get
              things running again.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#0d6efd]"
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
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-700 transition-colors duration-150 hover:bg-neutral-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServerError;
