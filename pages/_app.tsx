import "../styles/globals.css";
import type { AppProps } from "next/app";
import PageHead from "../components/PageHead";
import { Toaster } from "react-hot-toast";

function HillviewWeb({ Component, pageProps }: AppProps) {
  return (
    <>
      <PageHead
        title={pageProps.title}
        description={pageProps.description}
        image={pageProps.image}
      />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "",
          style: {
            maxWidth: "50%",
            textAlign: "center",
            width: "fit-content",
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default HillviewWeb;
