import React, { useState } from "react";
import "./ChatSidebar.css";

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  open,
}) => {
  const [menuChatId, setMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const openMenu = (e, chat) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.right - 140,
    });
    setMenuChatId(chat._id);
  };

  const startRename = (chat) => {
    setEditingChatId(chat._id);
    setEditValue(chat.title);
    setMenuChatId(null);
  };

  const finishRename = () => {
    if (editValue.trim() && editingChatId) {
      onRenameChat(editingChatId, editValue.trim());
    }
    setEditingChatId(null);
    setEditValue("");
  };

  return (
    <aside className={`chat-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>

      <nav className="chat-list">
        {chats.map((c) => (
          <div
            key={c._id}
            className={`chat-list-item ${c._id === activeChatId ? "active" : ""}`}
            onClick={() => {
              if (!editingChatId) onSelectChat(c._id);
              setMenuChatId(null);
            }}
          >
            {editingChatId === c._id ? (
              <input
                className="chat-rename-input"
                value={editValue}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={finishRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishRename();
                  if (e.key === "Escape") {
                    setEditingChatId(null);
                    setEditValue("");
                  }
                }}
              />
            ) : (
              <span className="chat-title">{c.title}</span>
            )}

            <div className="chat-menu-wrapper">
              <button
                className="menu-btn"
                onClick={(e) => openMenu(e, c)}
              >
                ⋮
              </button>
            </div>
          </div>
        ))}
      </nav>

      {menuChatId && (
        <div
          className="chat-menu"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() =>
              startRename(chats.find((c) => c._id === menuChatId))
            }
          >
            Rename
          </button>
          <button
            className="delete"
            onClick={() => {
              onDeleteChat(menuChatId);
              setMenuChatId(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </aside>
  );
};

export default ChatSidebar;
