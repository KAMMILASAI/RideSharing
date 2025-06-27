import React from 'react';
import './ChatBox.css';

const ChatBox = ({ messages, onSend }) => {
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chatbox-message">{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
