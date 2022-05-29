import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

const Home: NextPage = () => {
	return (
		<Layout>
			<div className='w-full h-[calc(100%-100px)] absolute'>
				<div className="lander-content h-fit full-center w-11/12 max-w-[1800px] flex justify-between">
					<div className="w-fit max-w-[50%]">
						<p className="text-7xl sm:text-8xl 2xl:text-9xl font-semibold text-header-100 sm:whitespace-nowrap">
							Good Morning <br></br>
							<b className="font-bold header-stroke text-white">
								Hillview
							</b>
						</p>
						<p className="text-header-200 text-xl sm:text-2xl my-5 whitespace-nowrap">
							Putting the spotlight on the stories <br></br>that
							matter.
						</p>
						<Link href="/content">
							<a>
								<button className="w-[10rem] h-[44px] text-white bg-primary-100 rounded-md font-semibold my-4 2xl:my-10">
									The Latest
								</button>
							</a>
						</Link>
					</div>
					<div className="w-fit max-w-[50%] hidden lg:block">
						<div className="relative full-vertical sun bg-[url('/assets/logos/sun.png')] w-[20rem] 2xl:w-[30rem] h-[20rem] 2xl:h-[30rem] bg-no-repeat bg-contain bg-center"></div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export async function getStaticProps() {
	return {
		props: {
			title: 'HillviewTV - Home',
		},
	};
}

export default Home;
