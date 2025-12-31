import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import qualitySelector from "videojs-hls-quality-selector";
import "videojs-contrib-quality-levels";

interface PlayerProps {
  url: string;
}

const VideoPlayer = (props: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (player) {
      player.src({ src: props.url });
    }
  }, [player, props.url]);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoJsOptions = {
      preload: "auto" as const,
      autoplay: false,
      controlBar: {
        volumePanel: {
          inline: false,
          volumeControl: {
            vertical: true,
          },
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

    videojs.registerPlugin("hlsQualitySelector", qualitySelector);
    const p = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        // Player is ready
      },
    );
    setPlayer(p);
    return () => {
      if (p) p.dispose();
    };
  }, []);

  useEffect(() => {
    if (player)
      (player as any).hlsQualitySelector({ displayCurrentQuality: true });
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
