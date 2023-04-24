import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next';

const WildcardHandler: NextPage = () => {
	return <></>;
};

const LookupRoute = async (path: string) => {
	try {
		const response = await axios.get(
			`https://api.hillview.tv/links/v1.1/check/${path}?recordClick=true`
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getServerSideProps = async (context: any) => {
	const lookup = context.params.wildcard;
	console.log(lookup);

	try {
		const response = await LookupRoute(lookup);

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
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

export default WildcardHandler;
