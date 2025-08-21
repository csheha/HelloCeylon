import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import your CSS file

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage,
      });
      const botReply = res.data.answer;

      // Add bot reply to chat
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error: Could not get response from bot." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isLoading ? "loading" : ""}`}>
      <div className="chatbot-header">
        <h1 className="chatbot-title">🇱🇰 Sri Lanka Tourism Guide</h1>
        <p className="chatbot-subtitle">Your personal travel guide</p>
      </div>

      <div className="chat-box" id="chat-box">
        {messages.length === 0 ? (
          <div className="empty-state">👋 Ask me anything about Sri Lanka!</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.from}`}>
              <div className={`message-bubble ${msg.from}`}>
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default App;
