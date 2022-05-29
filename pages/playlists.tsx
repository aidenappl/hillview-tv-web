import type { NextPage } from 'next';
import Layout from '../components/Layout';

const Playlists: NextPage = () => {
	return (
		<Layout>
			<div className="playlist-page w-full h-fit flex justify-center items-center relative">
				<div className="w-11/12 max-w-screen-2xl h-fit">
					{/* Header */}
					<div className="header h-[275px] md:h-[500px] w-full flex justify-center items-center">
						<div className="center-object">
							<h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center">
								Playlists
							</h1>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export async function getStaticProps() {
	return {
		props: {
			title: 'HillviewTV - Playlists',
		},
	};
}

export default Playlists;
