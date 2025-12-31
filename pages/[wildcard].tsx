import type { NextPage } from "next";
import QueryRoute from "../hooks/QueryRoute";

const WildcardHandler: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async (context: any) => {
  const lookup = context.params.wildcard;

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
          permanent: true,
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
