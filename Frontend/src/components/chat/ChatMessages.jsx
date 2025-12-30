import React, { useEffect, useRef } from "react";
import "./ChatMessages.css";

const parseMessage = (content) => {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", value: match[2] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
};

const ChatMessages = ({ messages, isSending }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isSending]);

  return (
    <div className="messages">
      {messages.map((m, index) => (
        <div key={index} className={`msg msg-${m.type}`}>
          <div className="msg-role">{m.type === "user" ? "You" : "AI"}</div>
          <div className="msg-bubble">
            {parseMessage(m.content).map((part, i) =>
              part.type === "code" ? (
                <pre key={i}>
                  <code>{part.value}</code>
                </pre>
              ) : (
                <span key={i}>{part.value}</span>
              )
            )}
          </div>
          <div className="msg-actions">
            <button onClick={() => navigator.clipboard.writeText(m.content)}>
              Copy
            </button>
          </div>
        </div>
      ))}

      {isSending && (
        <div className="msg msg-ai pending">
          <div className="msg-role">AI</div>
          <div className="msg-bubble typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
