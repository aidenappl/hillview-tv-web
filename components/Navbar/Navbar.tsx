import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import { loadComponents } from 'next/dist/server/load-components';

interface NavbarProps {
	hideLinks: boolean;
}

interface GeneralNSM {
	id: number;
	name: string;
	short_name: string;
}

interface Video {
	id: number;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	status: GeneralNSM;
	inserted_at: Date;
}

const Navbar = (props: NavbarProps) => {
	const { hideLinks } = props;

	const router = useRouter();
	const navButtons = [
		{ title: 'Home', url: '/' },
		{ title: 'Our Content', url: '/content' },
		{ title: 'Playlists', url: '/playlists' },
		{ title: 'Tune In', url: 'https://watch.hillview.tv/' },
	];

	const [searchResults, setSearchResults] = useState([] as Video[]);
	const [activeUrl, setActiveUrl] = useState('');
	const [searching, setSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const searchInput = useRef(null as any);

	const [timer, setTimer] = useState(null as any);
	const [showMobileNav, setShowMobileNav] = useState(false);

	useEffect(() => {
		setActiveUrl(router.pathname);
		resetSearch();
	}, [router.pathname]);

	const search = async (query: string) => {
		try {
			if (query.length > 0) {
				const response: any = await axios.get(
					'https://api.hillview.tv/video/v1.1/list/videos?limit=5&offset=0&search=' +
						query
				);
				return response.data ? response.data : [];
			} else {
				return [];
			}
		} catch (error) {
			throw error;
		}
	};

	const resetSearch = () => {
		setSearchQuery('');
		setShowSearch(false);
		setShowResults(false);
		setSearchResults([]);
	};

	const handleSearch = async (e: any) => {
		try {
			setSearchQuery(e.target.value);
			clearTimeout(timer);
			let value = e.target.value.trim();

			if (value.length > 0) {
				setSearchResults([]);
				setShowResults(true);
				setSearching(true);
				const newTimer = setTimeout(async () => {
					setSearching(false);
					let results = await search(value);
					setSearchResults(results);
				}, 500);

				setTimer(newTimer);
			} else {
				setSearchResults([]);
				setShowResults(false);
				setSearching(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="w-screen h-[100px] z-20 shrink-0">
			<div className="z-20 bg-white relative w-full px-5 sm:px-0 sm:w-11/12 sm:max-w-screen-2xl sm:mx-auto flex items-center justify-between h-full border-b-2 border-neutral-100">
				<Link href="/">
					<a>
						<h1 className="text-2xl font-semibold text-header-100">
							HillviewTV
						</h1>
					</a>
				</Link>
				{hideLinks ? (
					''
				) : (
					<>
						<div className="mobile-nav flex md:hidden">
							<div
								className="nav-icon"
								onClick={() => {
									setShowMobileNav(!showMobileNav);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={"h-7 w-7 block " + (showMobileNav ? 'hidden' : '')}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={"h-7 w-7 " + (showMobileNav ? 'block' : 'hidden')}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>
						</div>
						<div className="hidden md:flex items-center justify-center mt-0.5">
							{navButtons.map((i) => {
								return (
									<Link href={i.url} key={i.url}>
										<a
											className={
												'mx-5 font-medium text-base font-inter transition ' +
												(activeUrl === i.url
													? 'text-primary-100'
													: 'text-neutral-500 hover:text-neutral-900')
											}
										>
											{i.title}
										</a>
									</Link>
								);
							})}
							<div className="mx-5 h-[25px] w-[2px] bg-neutral-300 flex"></div>
							<div className="search flex ml-5">
								<div
									className={
										'search-results w-[500px] h-fit absolute top-[120px] right-0 bg-white z-10 outline-2 outline outline-[#f4f5f7] shadow-[#00000025] shadow-lg rounded-sm ' +
										(showResults ? 'block' : 'hidden')
									}
								>
									{searching ? (
										<div className="flex relative w-full items-center justify-center">
											<svg
												version="1.1"
												id="L9"
												xmlns="http://www.w3.org/2000/svg"
												x="0px"
												y="0px"
												viewBox="0 0 100 100"
												className="fill-black w-14 h-14 stroke-black opacity-30"
											>
												<path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
													<animateTransform
														attributeName="transform"
														attributeType="XML"
														type="rotate"
														dur="1s"
														from="0 50 50"
														to="360 50 50"
														repeatCount="indefinite"
													/>
												</path>
											</svg>
										</div>
									) : (
										<>
											{searchResults.map((i) => {
												return (
													<Link
														href={
															'/watch?v=' + i.id
														}
														key={i.url}
													>
														<a>
															<div className="group cursor-pointer search-res flex h-[80px] hover:bg-neutral-50 items-center">
																<div
																	className={
																		'thumbnail w-[90px] h-[55px] ml-5 rounded-md  overflow-hidden'
																	}
																>
																	<Image
																		src={
																			i.thumbnail
																		}
																		alt="Thumbnail"
																		width={
																			90
																		}
																		height={
																			55
																		}
																	/>
																</div>
																<h1 className="align-middle ml-5">
																	{i.title}
																</h1>
																<div className="play-icon absolute right-5 opacity-0 group-hover:opacity-30">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-6 w-6"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		strokeWidth={
																			2
																		}
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
																		/>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																		/>
																	</svg>
																</div>
															</div>
														</a>
													</Link>
												);
											})}
										</>
									)}
								</div>
								<input
									className={
										'w-[20rem] h-[38px] ease-in-out duration-200 px-5 py-2 bg-neutral-100 outline-none text-black text-base rounded-sm mr-5 font-medium ' +
										(showSearch
											? ''
											: 'w-[0rem] px-0 opacity-0 mr-0')
									}
									type="text"
									placeholder="Search"
									value={searchQuery}
									onChange={(e) => {
										handleSearch(e);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Escape') {
											resetSearch();
										}
									}}
									ref={searchInput}
								/>
								<button
									className=""
									onClick={(e) => {
										setShowSearch(!showSearch);
										if (showSearch) {
											resetSearch();
											searchInput.current.blur();
										} else {
											searchInput.current.focus();
										}
									}}
								>
									<svg
										className="stroke-neutral-500 h-[1.5rem] w-[1.5rem]"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</>
				)}
			</div>
			<div
				className={
					'fs-nav md:hidden relative left-0 w-full h-fit bg-white z-10 duration-200 ease-in-out ' +
					(showMobileNav ? 'top-[0px] drop-shadow-lg' : 'top-[-350px] drop-shadow-none')
				}
			>
				<div className="nav-button-container w-full flex flex-wrap pb-1">
					{navButtons.map((i) => {
						return (
							<Link href={i.url} key={i.url}>
								<a className="w-full h-fit text-center py-6 font-medium text-xl">
									{i.title}
								</a>
							</Link>
						);
					})}
				</div>
			</div>
			<div
				className={
					'fs-dark w-full h-[100vh] absolute top-0 left-0 z-[1] ' +
					(showMobileNav
						? 'pointer-events-auto'
						: 'pointer-events-none')
				}
				onClick={() => {
					setShowMobileNav(false);
				}}
			></div>
		</div>
	);
};

export default Navbar;
