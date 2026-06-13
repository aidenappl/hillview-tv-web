import Head from "next/head";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  videoUrl?: string;
  videoWidth?: number;
  videoHeight?: number;
  url?: string;
  ogType?: string;
  noindex?: boolean;
}

const DEFAULT_DESC =
  "Watch daily announcements, PAC Broadcasts, and the latest productions from Hillview Middle School's student-run TV station.";
const DEFAULT_IMAGE = "https://content.hillview.tv/thumbnails/default.jpg";
const SITE_NAME = "HillviewTV";

const ogImageType = (src: string): string =>
  /\.png(\?|$)/i.test(src)
    ? "image/png"
    : /\.webp(\?|$)/i.test(src)
      ? "image/webp"
      : "image/jpeg";

const PageHead = ({
  title = SITE_NAME,
  image = DEFAULT_IMAGE,
  imageWidth,
  imageHeight,
  videoUrl,
  videoWidth,
  videoHeight,
  description = DEFAULT_DESC,
  url = "https://hillview.tv/",
  ogType = "website",
  noindex = false,
}: HeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Primary */}
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content={ogImageType(image)} />
      {imageWidth ? (
        <meta property="og:image:width" content={String(imageWidth)} />
      ) : null}
      {imageHeight ? (
        <meta property="og:image:height" content={String(imageHeight)} />
      ) : null}
      {videoUrl ? (
        <>
          <meta property="og:video" content={videoUrl} />
          <meta property="og:video:secure_url" content={videoUrl} />
          <meta property="og:video:type" content="text/html" />
          {videoWidth ? (
            <meta property="og:video:width" content={String(videoWidth)} />
          ) : null}
          {videoHeight ? (
            <meta property="og:video:height" content={String(videoHeight)} />
          ) : null}
        </>
      ) : null}
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicons */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/assets/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/assets/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/assets/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="/assets/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/assets/favicons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <link rel="shortcut icon" href="/assets/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-config"
        content="/assets/favicons/browserconfig.xml"
      />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};

export default PageHead;
