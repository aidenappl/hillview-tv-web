import type { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useEffect, useRef, useState } from 'react';
import { DateTime } from "luxon";
import Link from 'next/link';

interface GeneralNSM {
	id: number;
	name: string;
	short_name: string;
}

interface Video {
	ft: string;
	id: number;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	status: GeneralNSM;
	inserted_at: Date;
}

interface PageProps {
	video: Video;
}

const Watch = (props: PageProps) => {
	const router = useRouter()
	const videoRef = useRef(null);

	const [shareButtonText, updateShareButtonText] = useState('Share Video');

	useEffect(() => {
		if (videoRef.current) {
		  videojs(videoRef.current, {
			sources: [
			  {
				src: props.video.url,
				type: "application/x-mpegURL"
			  }
			]
		  });
		}
	});

	const shareLink = () => {

		let fullUrl = window.location.href
		navigator.clipboard.writeText(fullUrl)
		updateShareButtonText('Link Copied!');

		setTimeout(() => {
			updateShareButtonText('Share Video');
		}, 3000);
	}

	return (
		<Layout>
			{!props.video ? (
				''
			) : (
				<div className="watch-page w-full h-fit flex justify-center items-center">
					<div className="w-11/12 max-w-screen-xl h-fit">

						{/* Header Breadcrumbs */}
						<div className="breadcrumb-container w-full h-[100px] flex items-center ">
							<div onClick={() => router.back()} className="back-btn relative w-[50px] h-[50px] bg-white rounded-[15px] border-2 border-neutral-150 cursor-pointer flex justify-center items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline
										_ngcontent-waj-c10=""
										points="15 18 9 12 15 6"
									></polyline>
								</svg>
							</div>
							<p className="text-lg">
								<Link href="/content"><a
									className="pl-3 text-primary-100 font-semibold cursor-pointer"
								>
									Videos
								</a></Link>{' '}
								→ {props.video.title}
							</p>
						</div>

						{/* Video Container */}
						<div className="video-container w-full h-fit">
							<video controls ref={videoRef} className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" />
						</div>

						{/* Title & Video info Container */}
						<div className="title-container w-full h-fit mt-10">
							<div className="title-info-container w-full h-fit relative">
								<h1 className='text-5xl font-medium'>{props.video.title}</h1>
								<div className='title-runner flex items-center w-fit h-[60px] mt-1 mb-6'>
									<div className='avatar rounded-full bg-[url(https://content.hillview.tv/images/mobile/default.jpg)] bg-cover bg-no-repeat bg-center w-[30px] h-[30px]'></div>
									<p className='ml-3 font-medium text-neutral-800'>HillviewTV Team</p>
									<p className='ml-6 font-light text-neutral-600'>{props.video.ft}</p>
								</div>
								<button onClick={() => {shareLink()}} className='absolute right-0 full-vertical w-[150px] h-[45px] bg-primary-100 duration-200 text-white rounded-sm hover:bg-[#2b55c5]'>{shareButtonText}</button>
							</div>
							<div className="hr w-full h-[2px] bg-neutral-200"></div>
							<div className="w-full h-fit py-10">
								<p>{props.video.description}</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	try {
		let id = context.query.v;
		const response = await fetch(
			'https://api.hillview.tv/video/v1.1/read/videoByID/' + id
		);

		if (response.ok) {
			const data = await response.json();
			data.ft = DateTime.fromISO(data.inserted_at.toString()).toFormat("MMMM dd, yyyy");
			return {
				props: {
					title: data.title,
					image: data.thumbnail,
					description: data.description,
					video: data,
				},
			};
		} else {
			return {
				redirect: {
					destination: '/content',
					permanent: false,
				},
			};
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export default Watch;
