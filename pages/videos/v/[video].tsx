import type { GetServerSideProps, NextPage } from "next";

const OldVideo: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const id = context.params.video;
  return {
    redirect: {
      destination: "/watch?v=" + id,
      permanent: true,
    },
  };
};

export default OldVideo;
