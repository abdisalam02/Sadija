import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { PodcastEpisode } from '../types';

interface MediaContextType {
  // Spotify State & Actions
  spotifyEpisode: PodcastEpisode | null;
  isSpotifyPlaying: boolean;
  playSpotifyEpisode: (episode: PodcastEpisode) => void;
  pauseSpotify: () => void;
  toggleSpotify: () => void;

  // YouTube State & Actions
  youtubeTitle: string;
  isYouTubePlaying: boolean;
  isYouTubeMuted: boolean;
  isYouTubeInView: boolean;
  setIsYouTubeInView: (inView: boolean) => void;
  setYouTubeTitle: (title: string) => void;
  registerYouTubeIframe: (iframe: HTMLIFrameElement | null) => void;
  toggleYouTubePlay: () => void;
  toggleYouTubeAudio: () => void;

  // Current Active Media Source
  activeSource: 'none' | 'spotify' | 'youtube';
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Spotify State ---
  const [spotifyEpisode, setSpotifyEpisode] = useState<PodcastEpisode | null>(null);
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- YouTube State ---
  const [youtubeTitle, setYouTubeTitle] = useState("Men Don't Hate Influencers. They Hate Women");
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(true); // Autoplay starts active
  const [isYouTubeMuted, setIsYouTubeMuted] = useState(true);
  const [isYouTubeInView, setIsYouTubeInView] = useState(false);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send postMessage to YouTube IFrame
  const sendYouTubeCommand = (func: string, args: any[] = []) => {
    if (ytIframeRef.current?.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  // --- Spotify Controls ---
  const playSpotifyEpisode = (episode: PodcastEpisode) => {
    if (!episode.previewUrl) return;

    // If same episode and already playing, pause it
    if (spotifyEpisode?.id === episode.id && isSpotifyPlaying) {
      pauseSpotify();
      return;
    }

    // Mute/pause YouTube when Spotify starts
    sendYouTubeCommand('mute');
    setIsYouTubeMuted(true);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(episode.previewUrl);
    audio.volume = 0.85;
    audio.onended = () => {
      setIsSpotifyPlaying(false);
    };
    audio.play().then(() => {
      setIsSpotifyPlaying(true);
    }).catch(() => {});

    audioRef.current = audio;
    setSpotifyEpisode(episode);
  };

  const pauseSpotify = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsSpotifyPlaying(false);
  };

  const toggleSpotify = () => {
    if (!spotifyEpisode || !spotifyEpisode.previewUrl) return;
    if (isSpotifyPlaying) {
      pauseSpotify();
    } else {
      // Mute YouTube
      sendYouTubeCommand('mute');
      setIsYouTubeMuted(true);

      if (audioRef.current) {
        audioRef.current.play().then(() => setIsSpotifyPlaying(true)).catch(() => {});
      } else {
        playSpotifyEpisode(spotifyEpisode);
      }
    }
  };

  // --- YouTube Controls ---
  const registerYouTubeIframe = (iframe: HTMLIFrameElement | null) => {
    ytIframeRef.current = iframe;
  };

  const toggleYouTubePlay = () => {
    if (isYouTubePlaying) {
      sendYouTubeCommand('pauseVideo');
      setIsYouTubePlaying(false);
    } else {
      // Pause Spotify when YouTube plays with intention
      pauseSpotify();
      sendYouTubeCommand('playVideo');
      setIsYouTubePlaying(true);
    }
  };

  const toggleYouTubeAudio = () => {
    if (isYouTubeMuted) {
      // Pause Spotify if playing
      pauseSpotify();
      sendYouTubeCommand('unMute');
      sendYouTubeCommand('setVolume', [100]);
      sendYouTubeCommand('playVideo');
      setIsYouTubeMuted(false);
      setIsYouTubePlaying(true);
    } else {
      sendYouTubeCommand('mute');
      setIsYouTubeMuted(true);
    }
  };

  // Determine active source
  let activeSource: 'none' | 'spotify' | 'youtube' = 'none';
  if (isSpotifyPlaying) {
    activeSource = 'spotify';
  } else if (!isYouTubeMuted || isYouTubeInView) {
    activeSource = 'youtube';
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <MediaContext.Provider
      value={{
        spotifyEpisode,
        isSpotifyPlaying,
        playSpotifyEpisode,
        pauseSpotify,
        toggleSpotify,
        youtubeTitle,
        isYouTubePlaying,
        isYouTubeMuted,
        isYouTubeInView,
        setIsYouTubeInView,
        setYouTubeTitle,
        registerYouTubeIframe,
        toggleYouTubePlay,
        toggleYouTubeAudio,
        activeSource,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
