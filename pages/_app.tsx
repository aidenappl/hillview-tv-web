import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHead from '../components/PageHead';
import { config as fontawesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

fontawesomeConfig.autoAddCss = false;

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
