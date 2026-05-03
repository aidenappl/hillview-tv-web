import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useState } from "react";
import Joi from "joi";
import toast from "react-hot-toast";
import { FetchAPI } from "../services/http/requestHandler";

const Home: NextPage = () => {
  const [loadingNewsletter, setLoadingNewsletter] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  const submitNewsletterForm = async () => {
    if (loadingNewsletter) return;
    if (newsletterEmail === "") return;

    setLoadingNewsletter(true);

    const schema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    });
    const result = schema.validate({ email: newsletterEmail.trim() });
    if (result.error) {
      toast.error("Must have a valid email address");
      setLoadingNewsletter(false);
      return;
    }

    const request = await FetchAPI({
      url: "/video/v1.1/newsletter",
      method: "POST",
      data: { email: newsletterEmail },
    });

    if (!request.success) {
      if (request.error_code === 1000) {
        toast.error("This email has already been registered");
      } else {
        toast.error(request.error || "An unknown error occurred");
      }
      setLoadingNewsletter(false);
      return;
    }

    setLoadingNewsletter(false);
    setNewsletterEmail("");
    toast.success("You're signed up! Expect a confirmation email shortly.");
  };

  return (
    <Layout>
      {/* ── Top newsletter banner ── */}
      <div className="border-b border-primary-100/20 bg-primary-100 px-4 py-3">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 sm:flex-nowrap">
          <p className="text-center text-sm font-medium text-white sm:text-left">
            Get notified when new productions drop —
          </p>
          <div className="flex gap-2">
            <label htmlFor="email-top" className="sr-only">
              Email address
            </label>
            <input
              id="email-top"
              type="email"
              autoComplete="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value.trim())}
              onKeyUp={(e) => {
                if (e.key === "Enter") submitNewsletterForm();
              }}
              placeholder="your@email.com"
              className="h-8 w-44 rounded-full border border-white/25 bg-white/15 px-4 text-xs text-white placeholder:text-white/55 focus:bg-white/20 focus:outline-none sm:w-52"
            />
            <button
              onClick={submitNewsletterForm}
              disabled={loadingNewsletter}
              className="flex h-8 w-20 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-100 transition-colors hover:bg-white/90 disabled:opacity-60"
            >
              {loadingNewsletter ? (
                <Spinner style="default" size={14} />
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-neutral-150 px-6 py-24 sm:py-32 lg:py-40">
        {/* Sun — right side */}
        <div
          className="pointer-events-none absolute right-[-4%] top-1/2 hidden -translate-y-1/2 select-none lg:block"
          aria-hidden="true"
        >
          <div
            className="relative h-[520px] w-[520px]"
            style={{
              opacity: 0.18,
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 65%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 65%)",
            }}
          >
            <Image src="/assets/logos/sun.png" alt="" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-6 bg-primary-100" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100">
                Hillview Middle School &middot; Student Broadcast Network
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[3rem] font-black leading-[1.05] tracking-tight text-header-100 sm:text-6xl lg:text-[5rem]">
              Putting the{" "}
              <span className="text-primary-100">spotlight</span>{" "}
              on the stories that matter.
            </h1>

            {/* Subline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              Watch our latest productions, explore curated playlists, and tune
              in live from Hillview&apos;s student-run broadcast network.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/content"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#0d6efd]"
              >
                Browse Content
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/playlists"
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-700 transition-colors duration-150 hover:bg-neutral-50"
              >
                View Playlists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="border-t border-neutral-150 bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-header-100 sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
            Get notified whenever a new production is uploaded.
          </p>
          <div className="mt-8 flex gap-2.5 sm:gap-3">
            <label htmlFor="email-bottom" className="sr-only">
              Email address
            </label>
            <input
              id="email-bottom"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value.trim())}
              onKeyUp={(e) => {
                if (e.key === "Enter") submitNewsletterForm();
              }}
              className="h-11 min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm shadow-sm placeholder:text-neutral-400 focus:outline-none"
              placeholder="your@email.com"
            />
            <button
              type="submit"
              disabled={loadingNewsletter}
              onClick={submitNewsletterForm}
              className="flex h-11 w-28 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-white shadow-[0_2px_8px_rgba(25,123,255,0.25)] transition-all duration-200 hover:bg-[#0d6efd] hover:shadow-[0_4px_12px_rgba(25,123,255,0.35)] disabled:opacity-60"
            >
              {loadingNewsletter ? (
                <Spinner style="light" size={18} />
              ) : (
                "Notify me"
              )}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      title: "HillviewTV - Home",
    },
  };
}

export default Home;
