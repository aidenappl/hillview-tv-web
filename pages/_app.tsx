import "../styles/globals.css";
import React from "react";
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-semibold text-neutral-700">Something went wrong.</p>
          <a href="/" className="text-sm text-primary-100 underline">
            Go home
          </a>
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
