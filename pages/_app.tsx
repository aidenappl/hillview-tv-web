import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHead from '../components/PageHead';
import { Children, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface RouteGuardParams {
	children: any;
}

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
