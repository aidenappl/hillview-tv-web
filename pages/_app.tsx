import "../styles/globals.css";
import type { AppProps } from "next/app";
import PageHead from "../components/PageHead";
import { Children, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface RouteGuardParams {
  children: any;
}

const LookupRoute = async (path: string) => {
  try {
    const response = await axios.get(
      `https://api.hillview.tv/links/v1.1/check/${path}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

function HillviewWeb({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setInitialization] = useState(false);

  const router = useRouter();

  useEffect(() => {
    init();
  });

  const init = async () => {
    try {
      if (hasInitialized) return true;

      if (pageProps.statusCode === 404 && router.asPath) {

        const response = await LookupRoute(router.asPath);
        
        if (!response) {
          setLoading(false);
          setInitialization(true);
          return
        }

        if (response.destination) {
          router.replace(response.destination);
          return;
        }
      } else {
        setLoading(false);
        setInitialization(true);
      }

      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageHead
        title={pageProps.title}
        description={pageProps.description}
        image={pageProps.image}
      />
      {!loading ? <Component {...pageProps} /> : ""}
    </>
  );
}

export default HillviewWeb;
