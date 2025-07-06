import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronRight, BookOpen, X, Settings, Maximize, Minimize, PictureInPicture, RotateCw, RotateCcw, Captions, CaptionsOff } from "lucide-react";
import videoData from "./video1.json";
import QuestionOverlay from "./QuestionOverlay";
const PlayButton = ({ videoRef, isDark }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleToggle = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);
  return (
    <button
      onClick={handleToggle}
      className={`transition-colors p-2 rounded-full hover:bg-opacity-30 ${isDark
        ? "text-text-inverse hover:text-brand-400 hover:bg-surface-dark-muted"
        : "text-white hover:text-brand-400 hover:bg-black"
        }`}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
    </button>
  );
};
const SkipButton = ({ videoRef, direction, isDark, forceLearning }) => {
  if (direction === "forward" && forceLearning) {
    return null;
  }
  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      const skipTime = direction === "forward" ? 10 : -10;
      video.currentTime = Math.max(
        0,
        Math.min(video.duration, video.currentTime + skipTime)
      );
    }
  };
  return (
    <button
      onClick={handleSkip}
      className={`transition-colors p-2 rounded-full hover:bg-opacity-30 ${isDark
        ? "text-text-inverse hover:text-brand-400 hover:bg-surface-dark-muted"
        : "text-white hover:text-brand-400 hover:bg-black"
        }`}
    >
      <div className="relative">
        {direction === "forward" ? (
          <RotateCw size={20} />
        ) : (
          <RotateCcw size={20} />
        )}
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[0.5rem] font-bold">
          10
        </span>
      </div>
    </button>
  );
};
const VolumeControl = ({ videoRef, isDark }) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const handleVolumeChange = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume;
    }
  };
  const handleToggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleSliderClick = (e) => {
    if (!containerRef.current) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    handleVolumeChange(newVolume);
  };
  return (
    <div
      className="flex items-center group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleToggleMute}
        className={`transition-colors p-1 rounded ${isDark
          ? "text-text-inverse hover:text-brand-400"
          : "text-white hover:text-brand-400"
          }`}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <div
        className={`relative h-1 transition-all duration-300 ease-out ml-3 ${isHovered ? "w-24 pr-4" : "w-0"
          }`}
      >
        {isHovered && (
          <div
            ref={containerRef}
            className="relative w-full h-full cursor-pointer"
            onClick={handleSliderClick}
          >
            <div
              className={`absolute inset-0 rounded-lg ${isDark ? "bg-surface-dark-muted" : "bg-neutral-600"
                }`}
            />
            <div
              className={`absolute top-0 left-0 h-1 rounded-lg transition-all duration-200 ${isDark ? "bg-brand-400" : "bg-brand-500"
                }`}
              style={{ width: `${volume * 100}%` }}
            />
            <div
              className={`absolute top-1/2 w-4 h-4 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 ${isDark ? "bg-brand-400" : "bg-brand-500"
                }`}
              style={{
                left: `calc(${volume * 100}% - 8px)`,
                zIndex: 20,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
const ProgressBar = ({ videoRef, isDark, forceLearning, showControls }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoveredQuestion, setHoveredQuestion] = useState(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);
  const handleSeek = (newTime) => {
    if (videoRef.current && !forceLearning) {
      const clampedTime = Math.max(0, Math.min(duration, newTime));
      videoRef.current.currentTime = clampedTime;
    }
  };
  const handleProgressClick = (e) => {
    if (!containerRef.current || forceLearning) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    handleSeek(newTime);
  };
  const handleQuestionClick = (e, timestamp) => {
    e.stopPropagation();
    if (!forceLearning) {
      handleSeek(timestamp);
    }
  };
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'mcq':
        return '📝';
      case 'true_false':
        return '✓';
      case 'fill_blank':
        return '📋';
      default:
        return '❓';
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`flex-1 relative transition-all group ${showControls ? 'h-2' : 'h-4'
          } ${forceLearning ? '' : 'cursor-pointer hover:h-3'
          } ${isDark ? "bg-surface-dark-muted" : "bg-neutral-600"}`}
        onClick={handleProgressClick}
      >
        <div
          className={`h-full relative transition-all duration-200 ${isDark ? "bg-brand-400" : "bg-brand-500"
            }`}
          style={{ width: `${progressPercent}%` }}
        />
        {duration > 0 && videoData.questions.map((question) => {
          const questionPercent = (question.timestamp / duration) * 100;
          const isNearCurrent = Math.abs(currentTime - question.timestamp) < 2;
          return (
            <div
              key={question.id}
              className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200 ${forceLearning ? 'pointer-events-none' : 'hover:scale-125'
                }`}
              style={{
                left: `${questionPercent}%`,
                zIndex: 30,
              }}
              onClick={(e) => handleQuestionClick(e, question.timestamp)}
              onMouseEnter={() => setHoveredQuestion(question)}
              onMouseLeave={() => setHoveredQuestion(null)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isNearCurrent
                  ? isDark
                    ? 'bg-warning border-warning text-black animate-pulse'
                    : 'bg-warning-400 border-warning-400 text-black animate-pulse'
                  : isDark
                    ? 'bg-brand-400 border-brand-400 text-white'
                    : 'bg-brand-500 border-brand-500 text-white'
                  } ${!forceLearning ? 'hover:shadow-lg' : ''}`}
              >
                <span className="text-xs">
                  {getQuestionTypeIcon(question.type)}
                </span>
              </div>
              {hoveredQuestion?.id === question.id && !forceLearning && (
                <div
                  className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm z-40 ${isDark
                    ? 'bg-surface-dark-subtle text-text-inverse border border-surface-dark-muted'
                    : 'bg-white text-text-primary border border-gray-200'
                    }`}
                >
                  <div className="font-medium">
                    {question.type === 'mcq' && 'Multiple Choice'}
                    {question.type === 'true_false' && 'True/False'}
                    {question.type === 'fill_blank' && 'Fill in the Blank'}
                  </div>
                  <div className="text-xs opacity-75">
                    {formatTime(question.timestamp)} • Click to jump
                  </div>
                  <div
                    className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDark ? 'border-t-surface-dark-subtle' : 'border-t-white'
                      }`}
                  />
                </div>
              )}
            </div>
          );
        })}
        {!forceLearning && (
          <div
            className={`absolute top-1/2 w-4 h-4 rounded-full transform -translate-y-1/2 transition-all duration-200 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 ${isDark ? "bg-brand-400" : "bg-brand-500"
              }`}
            style={{
              left: `calc(${progressPercent}% - 8px)`,
              zIndex: 20,
            }}
          />
        )}
      </div>
    </div>
  );
};
const TimeDisplay = ({ videoRef, isDark }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <span
      className={`text-sm font-medium ${isDark ? "text-text-inverse" : "text-white"
        }`}
    >
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
};
const SubtitleToggle = ({ subtitlesEnabled, onToggle, isDark }) => {
  return (
    <button
      onClick={onToggle}
      className="text-sm px-2 py-1 rounded transition-colors text-white"
    >
      {subtitlesEnabled ? <Captions size={20} /> : <CaptionsOff size={20} />}
    </button>
  );
};
const SettingsModal = ({ isOpen, onClose, videoRef, isDark }) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState("auto");
  const [subtitleLanguage, setSubtitleLanguage] = useState("en");
  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const videoQualities = ["auto", "1080p", "720p", "480p", "360p"];
  const subtitleLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "off", name: "Off" },
  ];
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="absolute bottom-16 right-4 z-50">
      <div
        className={`rounded-lg shadow-2xl min-w-64 ${isDark
          ? "bg-surface-dark-subtle border border-surface-dark-muted"
          : "bg-white border border-border-light"
          }`}
      >
        <div
          className={`p-4 border-b ${isDark ? "border-surface-dark-muted" : "border-border-light"
            }`}
        >
          <div className="flex items-center justify-between">
            <h3
              className={`font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"
                }`}
            >
              Settings
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded ${isDark
                ? "text-text-quaternary hover:text-text-inverse"
                : "text-text-quaternary hover:text-text-primary"
                }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-text-inverse" : "text-text-primary"
                }`}
            >
              Playback Speed
            </label>
            <div className="grid grid-cols-4 gap-2">
              {playbackSpeeds.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${playbackSpeed === speed
                    ? isDark
                      ? "bg-brand-500 text-white"
                      : "bg-brand-500 text-white"
                    : isDark
                      ? "bg-surface-dark-muted text-text-inverse hover:bg-surface-dark-emphasis"
                      : "bg-surface-muted text-text-primary hover:bg-surface-emphasis"
                    }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-text-inverse" : "text-text-primary"
                }`}
            >
              Video Quality
            </label>
            <select
              value={videoQuality}
              onChange={(e) => setVideoQuality(e.target.value)}
              className={`w-full p-2 rounded border text-sm ${isDark
                ? "bg-surface-dark-muted border-surface-dark-muted text-text-inverse"
                : "bg-white border-border-light text-text-primary"
                }`}
            >
              {videoQualities.map((quality) => (
                <option key={quality} value={quality}>
                  {quality === "auto" ? "Auto" : quality}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-text-inverse" : "text-text-primary"
                }`}
            >
              Subtitle Language
            </label>
            <select
              value={subtitleLanguage}
              onChange={(e) => setSubtitleLanguage(e.target.value)}
              className={`w-full p-2 rounded border text-sm ${isDark
                ? "bg-surface-dark-muted border-surface-dark-muted text-text-inverse"
                : "bg-white border-border-light text-text-primary"
                }`}
            >
              {subtitleLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
const FullscreenButton = ({ videoRef, isDark }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.log("Error attempting to enable fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  return (
    <button
      onClick={toggleFullscreen}
      className={`transition-colors p-1 rounded ${isDark
        ? "text-text-inverse hover:text-brand-400"
        : "text-white hover:text-brand-400"
        }`}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
};
const PictureInPictureButton = ({ videoRef, isDark }) => {
  const [isPiP, setIsPiP] = useState(false);
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      console.log("Picture-in-Picture not supported:", error);
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);
    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);
    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);
  return (
    <button
      onClick={togglePiP}
      className={`transition-colors p-1 rounded ${isDark
        ? "text-text-inverse hover:text-brand-400"
        : "text-white hover:text-brand-400"
        }`}
      title="Picture-in-Picture"
    >
      <PictureInPicture size={20} />
    </button>
  );
};
const SubtitleOverlay = ({ videoRef, subtitlesEnabled, showControls, isDark }) => {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);
  const getCurrentSubtitle = () => {
    return videoData.subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
  };
  const subtitle = getCurrentSubtitle();
  if (!subtitle || !subtitlesEnabled) return null;
  return (
    <div
      className={`absolute left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${showControls ? "bottom-20" : "bottom-8"
        } ${isDark
          ? "bg-surface-dark bg-opacity-40 text-text-inverse"
          : "bg-black bg-opacity-40 text-white"
        }`}
    >
      {subtitle.text}
    </div>
  );
};
const VideoControls = ({ videoRef, isDark, forceLearning }) => {
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const hideTimeoutRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);
  const resetHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleMouseMove = resetHideTimer;
    const handleMouseLeave = () => {
      if (isPlaying) {
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 1000);
      }
    };
    const videoContainer = video.parentElement;
    videoContainer.addEventListener("mousemove", handleMouseMove);
    videoContainer.addEventListener("mouseleave", handleMouseLeave);
    if (!isPlaying) {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    } else {
      resetHideTimer();
    }
    return () => {
      videoContainer.removeEventListener("mousemove", handleMouseMove);
      videoContainer.removeEventListener("mouseleave", handleMouseLeave);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isPlaying]);
  return (
    <>
      <div className={`absolute left-0 right-0 transition-all duration-700 ${showControls ? "bottom-16" : "bottom-0"}`}>
        <ProgressBar videoRef={videoRef} isDark={isDark} forceLearning={forceLearning} showControls={showControls} />
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
          } ${isDark
            ? "bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"
            : "bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SkipButton
                videoRef={videoRef}
                direction="back"
                isDark={isDark}
                forceLearning={forceLearning}
              />
              <PlayButton videoRef={videoRef} isDark={isDark} />
              <SkipButton
                videoRef={videoRef}
                direction="forward"
                isDark={isDark}
                forceLearning={forceLearning}
              />
              <VolumeControl videoRef={videoRef} isDark={isDark} />
              <TimeDisplay videoRef={videoRef} isDark={isDark} />
            </div>
            <div className="flex items-center space-x-2">
              <SubtitleToggle
                subtitlesEnabled={subtitlesEnabled}
                onToggle={() => setSubtitlesEnabled(!subtitlesEnabled)}
                isDark={isDark}
              />
              <PictureInPictureButton videoRef={videoRef} isDark={isDark} />
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`transition-colors p-1 rounded ${isDark
                  ? "text-text-inverse hover:text-brand-400"
                  : "text-white hover:text-brand-400"
                  }`}
              >
                <Settings size={20} />
              </button>
              <FullscreenButton videoRef={videoRef} isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        videoRef={videoRef}
        isDark={isDark}
      />
      <SubtitleOverlay
        videoRef={videoRef}
        subtitlesEnabled={subtitlesEnabled}
        showControls={showControls}
        isDark={isDark}
      />
    </>
  );
};
const PointsToRememberModal = ({ videoRef, isDark }) => {
  const [showPointsModal, setShowPointsModal] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      setShowPointsModal(true);
    };
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);
  const handleClose = () => {
    setShowPointsModal(false);
  };
  if (!showPointsModal) return null;
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className={`rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl ${isDark ? "bg-surface-dark-subtle" : "bg-surface-light"
          }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-bold flex items-center ${isDark ? "text-text-inverse" : "text-text-primary"
              }`}
          >
            <BookOpen
              className={`mr-3 ${isDark ? "text-brand-400" : "text-brand-600"}`}
              size={28}
            />
            Key Points to Remember
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${isDark
              ? "text-text-quaternary hover:text-text-inverse hover:bg-surface-dark-muted"
              : "text-text-quaternary hover:text-text-secondary hover:bg-surface-muted"
              }`}
          >
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-4 mb-8">
          {videoData.pointsToRemember.map((point, index) => (
            <li
              key={index}
              className={`flex items-start p-4 rounded-xl ${isDark ? "bg-brand-500/10" : "bg-brand-50"
                }`}
            >
              <ChevronRight
                className={`mr-3 mt-1 flex-shrink-0 ${isDark ? "text-brand-400" : "text-brand-500"
                  }`}
                size={18}
              />
              <span
                className={`font-medium ${isDark ? "text-text-inverse" : "text-text-secondary"
                  }`}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className={`w-full py-3 rounded-xl transition-all duration-200 font-medium ${isDark
            ? "bg-brand-500 hover:bg-brand-600 text-white"
            : "bg-brand-500 hover:bg-brand-600 text-white"
            }`}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
const VideoPlayer = ({ videoRef, isDark, forceLearning }) => (
  <div className="relative bg-black overflow-hidden shadow-2xl rounded-t-lg">
    <video ref={videoRef} className="w-full h-[600px] object-contain">
      <source src={videoData.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <SubtitleOverlay videoRef={videoRef} isDark={isDark} />
    <VideoControls
      videoRef={videoRef}
      isDark={isDark}
      forceLearning={forceLearning}
    />
    <QuestionOverlay videoRef={videoRef} isDark={isDark} />
    <PointsToRememberModal videoRef={videoRef} isDark={isDark} />
  </div>
);
export default VideoPlayer;