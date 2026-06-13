import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

const OldVideo: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const id = context.params!.video as string;
  return {
    redirect: {
      destination: "/watch?v=" + encodeURIComponent(id),
      permanent: true,
    },
  };
};

export default OldVideo;
