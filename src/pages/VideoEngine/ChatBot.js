import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
const TypingIndicator = ({ isDark }) => (
  <div className="flex gap-2 p-2 w-16">
    <div
      className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`}
      style={{ animationDelay: '0ms' }}
    />
    <div
      className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`}
      style={{ animationDelay: '160ms' }}
    />
    <div
      className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`}
      style={{ animationDelay: '320ms' }}
    />
  </div>
);
const ChatHeader = ({ isDark, onClose }) => {
  return (
    <header className={`py-3 px-4 flex items-center justify-between transition-colors duration-300 border-b ${isDark
      ? 'bg-surface-dark-subtle border-border-inverse'
      : 'bg-surface-light border-border-light'
      }`}>
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2 rounded-sm flex items-center justify-center">
          <img
            src="https://static.instructohub.com/staticfiles/assets/images/logo.png"
            alt="InstructoHub"
            className="w-8 h-8"
          />
        </div>
        <h1 className={`font-medium ${isDark ? 'text-text-inverse' : 'text-text-primary'}`}>
          InstructoEcho
        </h1>
      </div>
      <button
        onClick={onClose}
        className={`p-1.5 rounded-md transition-colors ${isDark
          ? 'hover:bg-surface-dark-muted text-text-inverse-secondary hover:text-text-inverse'
          : 'hover:bg-surface-muted text-text-quaternary hover:text-text-secondary'
          }`}
        title="Close assistant"
      >
        <X size={16} />
      </button>
    </header>
  );
};
const ChatContainer = ({
  chatContainerRef,
  messageGroups,
  dateHeadersRef,
  isTyping,
  isAnimating,
  isDark
}) => {
  return (
    <div
      className={`flex-1 overflow-y-auto px-4 transition-colors duration-300 ${isDark ? 'bg-surface-dark' : 'bg-surface-subtle'
        }`}
      ref={chatContainerRef}
    >
      <div className="max-w-5xl mx-auto space-y-6 py-2">
        {Object.entries(messageGroups).map(([date, messages], groupIndex) => (
          <div key={groupIndex} className="space-y-6">
            <div className="flex justify-center" data-date-header={date} ref={el => dateHeadersRef.current[date] = el}>
              <div className={`px-4 py-1 rounded-full text-xs ${isDark
                ? 'bg-surface-dark-muted text-text-inverse-secondary'
                : 'bg-surface-muted text-text-secondary'
                }`}>
                {date}
              </div>
            </div>
            {messages.map((msg, index) => (
              <div
                key={`${groupIndex}-${index}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft transition-colors duration-300 ${msg.role === 'user'
                    ? `bg-brand-500 text-white`
                    : isDark
                      ? 'bg-surface-dark-subtle text-text-inverse border border-border-inverse'
                      : 'bg-surface-light text-text-primary border border-border-light'
                    }`}
                  style={{
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className={`mb-1 text-xs flex items-center ${isDark ? 'text-text-inverse-secondary' : 'text-text-tertiary'
                      }`}>
                      <div className="w-5 h-5 mr-1 rounded-sm flex items-center justify-center">
                        <img
                          src="https://static.instructohub.com/staticfiles/assets/images/logo.png"
                          alt="InstructoHub"
                          className="w-5 h-5"
                        />
                      </div>
                      InstructoEcho
                    </div>
                  )}
                  <div
                    className="leading-relaxed markdown-content"
                    style={{ overflowWrap: 'break-word' }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/`(.*?)`/g, `<code class="px-1 rounded text-sm ${isDark ? 'bg-surface-dark-muted' : 'bg-surface-muted'}">$1</code>`)
                          .replace(/\n/g, '<br>')
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {isTyping && !isAnimating && (
          <div className="flex justify-start">
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft transition-colors duration-300 ${isDark
                ? 'bg-surface-dark-subtle text-text-inverse border border-border-inverse'
                : 'bg-surface-light text-text-primary border border-border-light'
                }`}
              style={{ borderRadius: '18px 18px 18px 4px' }}
            >
              <div className={`mb-1 text-xs flex items-center ${isDark ? 'text-text-inverse-secondary' : 'text-text-tertiary'
                }`}>
                <div className="w-5 h-5 mr-1 rounded-sm flex items-center justify-center">
                  <img
                    src="https://static.instructohub.com/staticfiles/assets/images/logo.png"
                    alt="InstructoHub"
                    className="w-5 h-5"
                  />
                </div>
                InstructoEcho
              </div>
              <TypingIndicator isDark={isDark} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const SuggestionBar = ({
  isTyping,
  isAnimating,
  suggestions,
  handleSuggestion,
  isDark
}) => {
  return (
    <div className="px-4 py-3 flex flex-wrap justify-center gap-2 transition-colors duration-300"
      style={{ minHeight: '56px' }}>
      {(!isTyping && !isAnimating && suggestions.length > 0) &&
        suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestion(suggestion)}
            className={`text-sm rounded-full px-4 py-2 border transition-colors duration-300 ${isDark
              ? 'bg-surface-dark-subtle text-text-accent border-border-inverse hover:bg-surface-dark-muted'
              : 'bg-surface-light text-text-accent border-border-light hover:bg-surface-subtle'
              }`}
          >
            {suggestion}
          </button>
        ))
      }
    </div>
  );
};
const MessageInput = ({
  message,
  setMessage,
  handleSubmit,
  isTyping,
  isAnimating,
  isDark
}) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className={`p-4 border-t transition-colors duration-300 ${isDark
      ? 'bg-surface-dark-subtle border-border-inverse'
      : 'bg-surface-light border-border-light'
      }`}>
      <div className="max-w-5xl mx-auto">
        <div className={`relative rounded-2xl shadow-soft overflow-hidden transition-colors duration-300 border ${isDark
          ? 'bg-surface-dark-subtle border-border-inverse'
          : 'bg-surface-light border-border-light'
          }`}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full p-4 pr-16 resize-none min-h-[56px] focus:outline-none transition-colors duration-300 ${isDark
              ? 'bg-surface-dark-subtle text-text-inverse placeholder-text-inverse-secondary'
              : 'bg-surface-light text-text-primary placeholder-text-quaternary'
              }`}
            placeholder="Message InstructoEcho..."
            rows="1"
            disabled={isTyping || isAnimating}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <button
              onClick={() => handleSubmit()}
              className={`p-2 rounded-lg transition-colors duration-300 ${message.trim() && !isTyping && !isAnimating
                ? 'bg-brand-500 text-white hover:bg-brand-600'
                : isDark
                  ? 'bg-surface-dark-muted text-text-inverse-secondary'
                  : 'bg-surface-muted text-text-quaternary'
                }`}
              disabled={!message.trim() || isTyping || isAnimating}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className={`text-[0.6rem] transition-colors duration-300 ${isDark ? 'text-text-inverse-secondary' : 'text-text-tertiary'
            }`}>
            AI responses are generated automatically and may not always be accurate. Use with discretion.
          </span>
        </div>
      </div>
    </div>
  );
};
const InstructoEcho = ({
  isVisible,
  onClose,
  isDark = false,
  videoContext = null
}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([
    'Explain the key concepts in this video',
    'What are the main learning objectives?',
    'Can you provide a summary?',
    'What should I focus on?'
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleDateHeader, setVisibleDateHeader] = useState('Today');
  const chatContainerRef = useRef(null);
  const initialized = useRef(false);
  const dateHeadersRef = useRef({});
  const startChat = {
    role: 'assistant',
    content: `Hi there! I'm InstructoEcho, your AI learning assistant. I'm here to help you understand the video content better. How can I assist you today?`
  };
  useEffect(() => {
    if (!initialized.current && isVisible) {
      addMessage({
        role: 'assistant',
        content: startChat.content,
        createdAt: new Date().toISOString()
      });
      initialized.current = true;
    }
  }, [isVisible]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  useEffect(() => {
    if ((isTyping || isAnimating) && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [isTyping, isAnimating]);
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const dateHeaderElements = document.querySelectorAll('[data-date-header]');
      if (dateHeaderElements.length === 0) return;
      let closestHeader = null;
      let closestDistance = Infinity;
      dateHeaderElements.forEach(header => {
        const rect = header.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHeader = header.getAttribute('data-date-header');
        }
      });
      if (closestHeader && closestHeader !== visibleDateHeader) {
        setVisibleDateHeader(closestHeader);
      }
    };
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatHistory, visibleDateHeader]);
  const addMessage = async (messageData) => {
    if (!messageData.createdAt) {
      messageData.createdAt = new Date().toISOString();
    }
    if (messageData.role === "assistant") {
      const text = messageData.content;
      let animatedContent = "";
      let index = 0;
      let isInsideTag = false;
      setIsAnimating(true);
      setChatHistory((prev) => [...prev, { ...messageData, content: "" }]);
      const interval = setInterval(() => {
        if (index === text.length) {
          clearInterval(interval);
          setIsAnimating(false);
        } else {
          const char = text[index];
          animatedContent += char;
          if (char === "<") {
            isInsideTag = true;
          } else if (char === ">" && isInsideTag) {
            isInsideTag = false;
          }
          if (!isInsideTag) {
            setChatHistory((prev) => {
              const updatedHistory = [...prev];
              const lastMessage = updatedHistory[updatedHistory.length - 1];
              if (lastMessage && lastMessage.role === "assistant") {
                lastMessage.content = animatedContent;
              }
              return updatedHistory;
            });
          }
          index++;
        }
      }, 10);
    } else {
      setChatHistory((prev) => [...prev, messageData]);
    }
  };
  const handleSubmit = async (inputMessage) => {
    const content = inputMessage || message;
    if (!content.trim() || isTyping || isAnimating) return;
    await addMessage({
      role: 'user',
      content: content,
      createdAt: new Date().toISOString()
    });
    setMessage('');
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's a great question about the video content! The main concepts covered include the fundamental principles and their practical applications.",
        "Excellent observation! This video focuses on key learning objectives that help build a strong foundation in the subject matter.",
        "You're on the right track! The video demonstrates important techniques and methodologies that are essential for understanding this topic.",
        "Great question! The content covers critical aspects that will help you apply these concepts in real-world scenarios.",
        "That's an important point! The video provides comprehensive coverage of the subject with practical examples and case studies."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setIsTyping(false);
      addMessage({
        role: "assistant",
        content: randomResponse,
        createdAt: new Date().toISOString()
      });
      setSuggestions([
        'Can you elaborate on that?',
        'What are the next steps?',
        'How does this apply practically?',
        'Are there any examples?'
      ]);
    }, 2000);
  };
  const handleSuggestion = (suggestion) => {
    handleSubmit(suggestion);
    setSuggestions([]);
  };
  const groupMessagesByDate = () => {
    const groups = {};
    chatHistory.forEach(message => {
      const date = new Date(message.createdAt);
      const formattedDate = formatDateHeader(date);
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(message);
    });
    return groups;
  };
  const formatDateHeader = (date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };
  const messageGroups = groupMessagesByDate();
  if (!isVisible) return null;
  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDark ? 'bg-surface-dark' : 'bg-surface-subtle'
      }`}>
      <ChatHeader isDark={isDark} onClose={onClose} />
      <div className="sticky top-0 z-10 flex justify-center py-2 pointer-events-none">
        <div className={`px-4 py-1 rounded-full text-xs shadow-medium transition-opacity duration-300 border ${isDark
          ? 'bg-surface-dark-subtle text-text-inverse-secondary border-border-inverse'
          : 'bg-surface-light text-text-tertiary border-border-light'
          }`} style={{ opacity: 0.95 }}>
          {visibleDateHeader}
        </div>
      </div>
      <ChatContainer
        chatContainerRef={chatContainerRef}
        messageGroups={messageGroups}
        dateHeadersRef={dateHeadersRef}
        isTyping={isTyping}
        isAnimating={isAnimating}
        isDark={isDark}
      />
      <SuggestionBar
        isTyping={isTyping}
        isAnimating={isAnimating}
        suggestions={suggestions}
        handleSuggestion={handleSuggestion}
        isDark={isDark}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
        isAnimating={isAnimating}
        isDark={isDark}
      />
    </div>
  );
};
export default InstructoEcho;