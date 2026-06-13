import "../styles/globals.css";
import React from "react";
import Image from "next/image";
import type { AppProps } from "next/app";
import PageHead from "../components/PageHead";
import { Toaster } from "react-hot-toast";
import { LiveStatusProvider } from "../components/LiveStatusProvider";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          {/* Hard navigation (not next/link) — the ErrorBoundary lives in _app
              and persists across client routing, so only a full reload clears
              the error state. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="group inline-flex items-center gap-2.5">
            <Image
              src="/assets/logos/sun.png"
              alt="HillviewTV"
              width={44}
              height={44}
              className="h-9 w-9 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
            />
            <span className="text-xl font-semibold tracking-[-0.01em] text-header-100 sm:text-2xl">
              Hillview<span className="text-blue-600">TV</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-primary-100" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100">
              Something Went Wrong
            </span>
            <div className="h-px w-6 bg-primary-100" aria-hidden="true" />
          </div>
          <h1 className="max-w-lg text-3xl font-black leading-tight tracking-tight text-header-100 sm:text-4xl">
            We hit some
            <span className="text-primary-100"> technical difficulties.</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-neutral-400">
            An unexpected error occurred. Try reloading the page, or head back
            home while we sort things out.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex items-center rounded-lg bg-primary-100 px-6 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-[#0d6efd]"
            >
              Back to Home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors duration-150 hover:bg-neutral-50"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function HillviewWeb({ Component, pageProps }: AppProps) {
  return (
    <LiveStatusProvider>
      <PageHead
        title={pageProps.title}
        description={pageProps.description}
        image={pageProps.image}
        url={pageProps.url}
        ogType={pageProps.ogType}
        noindex={pageProps.noindex}
      />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "",
          style: {
            textAlign: "center",
            width: "fit-content",
          },
        }}
      />
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </LiveStatusProvider>
  );
}

export default HillviewWeb;
