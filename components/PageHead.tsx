import Head from "next/head";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const PageHead = ({
  title = "HillviewTV",
  image = "https://content.hillview.tv/thumbnails/default.jpg",
  description = "Check out HillviewTV. Tune into the daily announcements, PAC Broadcasts, and connect with Hillview Middle School!",
}: HeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="assets/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="assets/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="assets/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="assets/favicons/site.webmanifest" />
      <link
        rel="mask-icon"
        href="assets/favicons/safari-pinned-tab.svg"
        color="#5bbad5"
      />
      <link rel="shortcut icon" href="assets/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-config"
        content="assets/favicons/browserconfig.xml"
      />
      <meta name="theme-color" content="#ffffff" />

      <meta charSet="utf-8" />

      <meta name="description" content={description} />
      <meta name="image" content={image} />

      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={image} />

      <meta name="og:site_name" content={title} />
      <meta name="og:locale" content="en_US" />
      <meta name="og:type" content="website" />

      <base href="/" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default PageHead;
