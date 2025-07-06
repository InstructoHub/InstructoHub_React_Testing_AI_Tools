import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const TypingIndicator = () => (
  <div className="flex gap-2 p-2 w-16">
    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
  </div>
);
const ChatHeader = ({
  surfaceStyle,
  textStyle,
  borderStyle,
  closeChatBot,
  isPracticeMode = false
}) => {
  return (
    <header className="py-3 px-4 flex items-center justify-between transition-colors duration-300"
      style={{ ...surfaceStyle, ...borderStyle, borderBottomWidth: '1px' }}>
      <div className="flex items-center">
        <div className="w-4 h-8 rounded-lg mr-3 flex items-center justify-center">
        </div>
        <h1 className="font-medium" style={textStyle}>
          InstructoEcho
        </h1>
      </div>
      {/* Buttons section */}
      <div className="flex space-x-2">
        {isPracticeMode && closeChatBot && (
          <button
            onClick={closeChatBot}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title="Close assistant"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </header>
  );
};
const ChatContainer = ({
  chatContainerRef,
  messageGroups,
  dateHeadersRef,
  isTyping,
  isAnimating,
  theme,
  COLORS,
  surfaceStyle,
  secondaryTextStyle,
  bgStyle
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto px-4 transition-colors duration-300"
      ref={chatContainerRef}
      style={bgStyle}
    >
      <div className="max-w-5xl mx-auto space-y-6 py-2">
        {Object.entries(messageGroups).map(([date, messages], groupIndex) => (
          <div key={groupIndex} className="space-y-6">
            <div className="flex justify-center" data-date-header={date} ref={el => dateHeadersRef.current[date] = el}>
              <div className="px-4 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'rgba(27, 57, 66, 0.1)', color: theme.textSecondary }}>
                {date}
              </div>
            </div>
            {messages.map((msg, index) => (
              <div
                key={`${groupIndex}-${index}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-colors duration-300"
                  style={{
                    ...msg.role === 'user' ? { backgroundColor: COLORS.primary } : surfaceStyle,
                    color: msg.role === 'user' ? '#ffffff' : theme.text,
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: msg.role === 'user' ? 'none' : `1px solid ${theme.border}`
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div className="mb-1 text-xs flex items-center" style={secondaryTextStyle}>
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
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-base font-bold my-1" {...props} />,
                        h5: ({ node, ...props }) => <h5 className="text-sm font-bold my-1" {...props} />,
                        h6: ({ node, ...props }) => <h6 className="text-xs font-bold my-1" {...props} />,
                        p: ({ node, ...props }) => <p className="my-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                        code: ({ node, inline, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre className="my-2 p-4 bg-gray-100 rounded overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-100 px-1 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                        img: ({ node, ...props }) => <img className="max-w-full h-auto my-2" {...props} />,
                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full bg-white border border-gray-300" {...props} /></div>,
                        thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                        tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-300" {...props} />,
                        tr: ({ node, isHeader, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
                        th: ({ node, ...props }) => <th className="px-4 py-2 text-left font-medium text-gray-700 border-r last:border-r-0" {...props} />,
                        td: ({ node, ...props }) => <td className="px-4 py-2 border-r last:border-r-0" {...props} />,
                        hr: ({ node, ...props }) => <hr className="my-4 border-t border-gray-300" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        del: ({ node, ...props }) => <del className="line-through" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {isTyping && !isAnimating && (
          <div className="flex justify-start">
            <div
              className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm transition-colors duration-300"
              style={{
                ...surfaceStyle,
                color: theme.text,
                borderRadius: '18px 18px 18px 4px',
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="mb-1 text-xs flex items-center" style={secondaryTextStyle}>
                <div className="w-5 h-5 mr-1 rounded-sm flex items-center justify-center">
                  <img
                    src="https://static.instructohub.com/staticfiles/assets/images/logo.png"
                    alt="InstructoHub"
                    className="w-5 h-5"
                  />
                </div>
                InstructoEcho
              </div>
              <TypingIndicator />
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
  theme,
  COLORS,
  surfaceStyle
}) => {
  return (
    <div className="px-4 py-3 flex flex-wrap justify-center gap-2 transition-colors duration-300"
      style={{ minHeight: '56px' }}>
      {(!isTyping && !isAnimating && suggestions.length > 0) &&
        suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestion(suggestion)}
            className="text-sm rounded-full px-4 py-2 border transition-colors duration-300"
            style={{
              ...surfaceStyle,
              color: COLORS.accent,
              borderColor: theme.border,
            }}
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
  theme,
  COLORS,
  surfaceStyle,
  textStyle,
  secondaryTextStyle,
  borderStyle
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
    <div className="p-4 border-t transition-colors duration-300"
      style={{ ...surfaceStyle, borderColor: theme.border }}>
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl shadow-sm overflow-hidden transition-colors duration-300"
          style={{ ...surfaceStyle, border: `1px solid ${theme.border}` }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-4 pr-16 resize-none min-h-[56px] focus:outline-none transition-colors duration-300"
            style={{
              ...surfaceStyle,
              color: theme.text,
            }}
            placeholder="Message InstructoEcho..."
            rows="1"
            disabled={isTyping || isAnimating}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <button
              onClick={() => handleSubmit()}
              className="p-2 rounded-lg transition-colors duration-300"
              disabled={!message.trim() || isTyping || isAnimating}
              style={message.trim() && !isTyping && !isAnimating ?
                { backgroundColor: COLORS.accent } :
                { backgroundColor: 'rgba(27, 57, 66, 0.1)' }}
            >
              <Send className="w-5 h-5" style={{
                color: message.trim() && !isTyping && !isAnimating ?
                  '#ffffff' : theme.textSecondary
              }} />
            </button>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs transition-colors duration-300" style={secondaryTextStyle}>
            AI responses are generated automatically and may not always be accurate. Use with discretion.
          </span>
        </div>
      </div>
    </div>
  );
};
const ChatbotApp = ({
  inputChatID,
  isPracticeMode = false,
  questionContext = null,
  closeChatBot = null
}) => {
  const [message, setMessage] = useState('');
  const [chatID, setChatID] = useState(inputChatID || '');
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleDateHeader, setVisibleDateHeader] = useState('Today');
  const chatContainerRef = useRef(null);
  const initialized = useRef(false);
  const dateHeadersRef = useRef({});
  // Color scheme with only light theme
  const COLORS = {
    primary: '#1B3942', // Deep teal
    accent: '#e16b3b',  // Warm orange
    light: {
      background: '#f4f7f8',
      surface: '#ffffff',
      text: '#1B3942',
      textSecondary: '#64808a',
      border: '#d9e2e6'
    }
  };
  // Welcome message based on mode
  const startChat = {
    role: 'assistant',
    content: `Hi there! I'm InstructoEcho, your AI learning assistant. I'm here to help you understand the video content better. How can I assist you today?`
  };
  // For practice mode, auto-send initial message
  useEffect(() => {
    if (!initialized.current) {
      if (isPracticeMode) {
        handleSubmit("Help me understand this question!");
        initialized.current = true;
      } else if (!chatID) {
        addMessage({
          role: 'assistant',
          content: startChat.content,
          createdAt: new Date().toISOString()
        });
        initialized.current = true;
      }
    }
  }, [chatID, isPracticeMode]);
  // Fetch chat history (only in normal mode)
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`https://docker.instructohub.com/lti/getChatHistory?ltik=${window.ltik}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatID: chatID,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChatHistory(data.chatHistory || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    if (chatID && !isPracticeMode) {
      fetchChatHistory();
    }
  }, [chatID, isPracticeMode]);
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
  // Handle the scroll event to update the visible date header
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      // Get all date headers and their positions
      const dateHeaderElements = document.querySelectorAll('[data-date-header]');
      if (dateHeaderElements.length === 0) return;
      // Find the date header that's closest to the top of the viewport
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
      // Set isAnimating true for animation but keep isTyping false since API response is back
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
    // Set isTyping true when waiting for API response
    setIsTyping(true);
    try {
      // Choose API endpoint based on mode
      const endpoint = isPracticeMode
        ? `https://docker.instructohub.com/lti/practiceBot?ltik=${window.ltik}`
        : `https://docker.instructohub.com/lti/courseBot?ltik=${window.ltik}`;
      // Prepare request body based on mode
      const requestBody = isPracticeMode
        ? {
          chatChain: { role: "user", content: content },
          chatID: chatID,
          startChat: startChat,
          questionContext: questionContext
        }
        : {
          chatChain: { role: "user", content: content },
          chatID: chatID,
          startChat: startChat,
        };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Set isTyping to false as we've received the API response
      setIsTyping(false);
      await addMessage({
        role: "assistant",
        content: data.message,
        createdAt: new Date().toISOString()
      });
      if (data.suggestions) {
        if (isPracticeMode)
          setSuggestions(data.suggestions.slice(2));
        else
          setSuggestions(data.suggestions);
      }
      setChatID(data.chatID);
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      setIsAnimating(false);
    }
  };
  const handleSuggestion = (suggestion) => {
    handleSubmit(suggestion);
    setSuggestions([]);
  };
  // Group messages by date
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
  // Format date for the header
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
      // Format as Month Day, Year (e.g., March 5, 2025)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };
  // Use only light theme
  const theme = COLORS.light;
  const bgStyle = { backgroundColor: theme.background };
  const surfaceStyle = { backgroundColor: theme.surface };
  const textStyle = { color: theme.text };
  const secondaryTextStyle = { color: theme.textSecondary };
  const borderStyle = { borderColor: theme.border };
  // Generate message groups by date
  const messageGroups = groupMessagesByDate();
  // Render the same UI for both modes - the functionality differences are handled internally
  return (
    <div className="flex flex-col h-screen transition-colors duration-300" style={bgStyle}>
      <ChatHeader
        surfaceStyle={surfaceStyle}
        textStyle={textStyle}
        borderStyle={borderStyle}
        closeChatBot={isPracticeMode ? closeChatBot : null}
        isPracticeMode={isPracticeMode}
      />
      {/* Floating Date Header */}
      <div className="sticky top-0 z-10 flex justify-center py-2 pointer-events-none">
        <div className="px-4 py-1 rounded-full text-xs shadow-md transition-opacity duration-300"
          style={{
            backgroundColor: theme.surface,
            color: theme.textSecondary,
            opacity: 0.95,
            border: `1px solid ${theme.border}`
          }}>
          {visibleDateHeader}
        </div>
      </div>
      <ChatContainer
        chatContainerRef={chatContainerRef}
        messageGroups={messageGroups}
        dateHeadersRef={dateHeadersRef}
        isTyping={isTyping}
        isAnimating={isAnimating}
        theme={theme}
        COLORS={COLORS}
        surfaceStyle={surfaceStyle}
        textStyle={textStyle}
        secondaryTextStyle={secondaryTextStyle}
        borderStyle={borderStyle}
        bgStyle={bgStyle}
      />
      <SuggestionBar
        isTyping={isTyping}
        isAnimating={isAnimating}
        suggestions={suggestions}
        handleSuggestion={handleSuggestion}
        theme={theme}
        COLORS={COLORS}
        surfaceStyle={surfaceStyle}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
        isAnimating={isAnimating}
        theme={theme}
        COLORS={COLORS}
        surfaceStyle={surfaceStyle}
        textStyle={textStyle}
        secondaryTextStyle={secondaryTextStyle}
        borderStyle={borderStyle}
      />
    </div>
  );
};
export default ChatbotApp;