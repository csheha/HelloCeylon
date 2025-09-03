import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../style/Chatbot.css";
import { auth } from "../firebase/firebaseConfig";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Quick action suggestions
  const quickActions = [
    "Best places to visit",
    "Traditional Sri Lankan food",
    "Cultural festivals",
    "Beach destinations",
    "Adventure activities",
  ];

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleQuickAction = (action) => {
    if (isLoading) return;
    setInput(action);
    sendMessage(action);
  };

  const sendMessage = async (messageText = null) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setIsLoading(true);

    // Show user message immediately
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    try {
      // Get Firebase auth token for current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "⚠️ You must be logged in to chat.",
            type: "warning",
          },
        ]);
        setIsLoading(false);
        return;
      }
      const token = await currentUser.getIdToken();

      // Send message to Node backend with Authorization header
      const res = await axios.post(
        "/api/chat",
        { message: userMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000, // 30 second timeout
        }
      );

      const botReply = res.data.answer;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorMessage = "❌ Sorry, I couldn't process your request right now.";

      if (err.code === "ECONNABORTED") {
        errorMessage = "⏱️ Request timed out. Please try again.";
      } else if (err.response?.status === 401) {
        errorMessage = "🔒 Authentication error. Please log in again.";
      } else if (err.response?.status >= 500) {
        errorMessage =
          "🚧 Server is temporarily unavailable. Please try again later.";
      }

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errorMessage,
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot-container ${isLoading ? "loading" : ""}`}>
      <div className="chatbot-header">
        <h1 className="chatbot-title">🇱🇰 Sri Lanka Tourism Guide</h1>
        <p className="chatbot-subtitle">Your personal travel guide</p>
      </div>

      <div className="quick-actions-container">
        <p className="quick-actions-title">Popular questions:</p>
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action)}
              disabled={isLoading}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            👋 Hello! I'm your Sri Lankan travel guide. Ask me anything about
            our beautiful island!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from}`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className={`message-bubble ${msg.from} ${msg.type || ""}`}>
                <div className="message-sender">
                  {msg.from === "user" ? "You" : "HelloCeylon Bot"}
                </div>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message bot">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about places, food, culture..."
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          maxLength={500}
        />
        <button
          className="send-button"
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
