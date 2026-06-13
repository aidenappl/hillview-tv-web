import type { GetServerSidePropsContext, NextPage } from "next";
import QueryRoute from "../hooks/QueryRoute";

const WildcardHandler: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const lookup = context.params!.wildcard as string;

  try {
    const response = await QueryRoute(lookup);

    if (!response) {
      return {
        notFound: true,
      };
    }

    if (response.destination) {
      return {
        redirect: {
          destination: response.destination,
          // Short links are editable — never permanent (browsers cache 308s forever)
          permanent: false,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (_error) {
    return {
      notFound: true,
    };
  }
};

export default WildcardHandler;
