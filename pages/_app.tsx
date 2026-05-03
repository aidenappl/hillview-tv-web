import "../styles/globals.css";
import type { AppProps } from "next/app";
import PageHead from "../components/PageHead";
import { Toaster } from "react-hot-toast";
import { LiveStatusProvider } from "../components/LiveStatusProvider";

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
      <Component {...pageProps} />
    </LiveStatusProvider>
  );
}

export default HillviewWeb;
