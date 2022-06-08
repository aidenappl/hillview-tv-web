import React, { useRef, useState, useEffect } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
// those imports are important
import qualitySelector from 'videojs-hls-quality-selector';
import qualityLevels from 'videojs-contrib-quality-levels';

interface PlayerProps {
	url: string;
}

const VideoPlayer = (props: PlayerProps) => {
	const videoRef = useRef(null);
	const [player, setPlayer] = useState(null as VideoJsPlayer | null);

	useEffect(() => {
		if (player) {
			player.src(props.url);
		}
	}, [player, props.url]);

	useEffect(() => {
		if (!videoRef.current) return;

		const videoJsOptions: VideoJsPlayerOptions = {
			preload: 'auto',
			autoplay: false,
            controlBar: {
                volumePanel: {
                    inline: false,
                    volumeControl: {
                        vertical: true,
                    }
                },
            },
			controls: true,
			fluid: true,
			responsive: true,
			sources: [
				{
					src: props.url,
				},
			],
		};

		videojs.registerPlugin('hlsQualitySelector', qualitySelector);
		const p = videojs(
			videoRef.current,
			videoJsOptions,
			function onPlayerReaady() {
				// console.log('onPlayerReady');
			}
		);
		setPlayer(p);
		return () => {
			if (player) player.dispose();
		};
	}, []);

	useEffect(() => {
		if (player) player.hlsQualitySelector({ displayCurrentQuality: true });
	}, [player]);
	return (
		<div data-vjs-player>
			<video
				ref={videoRef}
				className="video-js vjs-default-skin vjs-big-play-centered"
			></video>
		</div>
	);
};

export default VideoPlayer;
