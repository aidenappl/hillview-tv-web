import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHead from '../components/PageHead';

function HillviewWeb({ Component, pageProps }: AppProps) {
	return (
		<>
			<PageHead
				title={pageProps.title}
				description={pageProps.description}
				image={pageProps.image}
			/>
			<Component {...pageProps} />
		</>
	);
}

export default HillviewWeb;
