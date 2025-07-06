import { useState, useRef, useEffect } from "react";
import { MessageCircle, Video, Moon, Sun } from "lucide-react";
import videoData from "./video1.json";
import Chatbot from "./ChatBot";
import VideoPlayer from "./VideoPlayer";
const RecommendedVideos = ({ isDark }) => {
  return (
    <div
      className={`border-l h-full ${isDark
        ? "bg-surface-dark-subtle border-surface-dark-muted"
        : "bg-surface-light border-border-light"
        }`}
    >
      <div className="p-4">
        <h2
          className={`text-lg font-bold mb-4 flex items-center ${isDark ? "text-text-inverse" : "text-text-primary"
            }`}
        >
          <Video
            className={`mr-2 ${isDark ? "text-brand-400" : "text-brand-600"}`}
            size={20}
          />
          Recommended
        </h2>
        <div className="space-y-3">
          {videoData.recommendedVideos.map((video) => (
            <div
              key={video.id}
              className={`flex rounded-lg transition-colors cursor-pointer group p-2 ${isDark
                ? "bg-surface-dark-muted hover:bg-surface-dark-emphasis"
                : "bg-surface-muted hover:bg-surface-emphasis"
                }`}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <h3
                  className={`font-medium text-sm leading-tight line-clamp-2 transition-colors ${isDark
                    ? "text-text-inverse group-hover:text-brand-400"
                    : "text-text-primary group-hover:text-brand-600"
                    }`}
                >
                  {video.title}
                </h3>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-text-quaternary" : "text-text-tertiary"
                    }`}
                >
                  {video.channel}
                </p>
                <p
                  className={`text-xs ${isDark ? "text-text-quaternary" : "text-text-tertiary"
                    }`}
                >
                  {video.views}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const DarkModeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className={`p-3 rounded-full transition-all duration-300 shadow-lg ${isDark
      ? "bg-surface-dark-muted hover:bg-surface-dark-emphasis text-text-inverse"
      : "bg-surface-light hover:bg-surface-muted text-text-primary"
      }`}
    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
  >
    {isDark ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);
const ChatbotToggle = ({ onToggle, isVisible, isDark }) => (
  <button
    onClick={onToggle}
    className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-40 ${isVisible ? "hidden" : ""
      } ${isDark
        ? "bg-brand-500 hover:bg-brand-600 text-white"
        : "bg-brand-500 hover:bg-brand-600 text-white"
      }`}
    title="Open video assistant"
  >
    <MessageCircle size={24} />
  </button>
);
const VideoLearningEngine = () => {
  const videoRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [forceLearning, setForceLearning] = useState(0);
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-surface-dark" : "bg-surface-subtle"
        }`}
    >
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <div
            className={`shadow-sm border-b ${isDark
              ? "bg-surface-dark-subtle border-surface-dark-muted"
              : "bg-surface-light border-border-light"
              }`}
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1
                    className={`text-3xl font-bold mb-2 ${isDark ? "text-text-inverse" : "text-text-primary"
                      }`}
                  >
                    {videoData.title}
                  </h1>
                  <p
                    className={`text-lg leading-relaxed ${isDark ? "text-text-quaternary" : "text-text-secondary"
                      }`}
                  >
                    {videoData.description}
                  </p>
                </div>
                <DarkModeToggle
                  isDark={isDark}
                  onToggle={() => setIsDark(!isDark)}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <VideoPlayer videoRef={videoRef} isDark={isDark} forceLearning={forceLearning} />
          </div>
        </div>
        <div className="w-[30rem]">
          {showChatbot ? (
            <div className="flex flex-col min-h-screen">
              <Chatbot
                isVisible={showChatbot}
                onClose={() => setShowChatbot(false)}
                isDark={isDark}
                videoContext={null}
              />
              <RecommendedVideos isDark={isDark} />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <RecommendedVideos isDark={isDark} />
            </div>
          )}
        </div>
        <ChatbotToggle
          onToggle={() => setShowChatbot(!showChatbot)}
          isVisible={showChatbot}
          isDark={isDark}
        />
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${isDark ? "#f09c7d" : "#e16b3b"};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: ${isDark ? "#f09c7d" : "#e16b3b"};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
export default VideoLearningEngine;