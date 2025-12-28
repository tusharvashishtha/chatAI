import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatMobileBar from "../components/chat/ChatMobileBar.jsx";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import "../components/chat/ChatLayout.css";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats,
} from "../store/chatSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector((s) => s.chat.chats);
  const activeChatId = useSelector((s) => s.chat.activeChatId);
  const input = useSelector((s) => s.chat.input);
  const isSending = useSelector((s) => s.chat.isSending);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/api/chat").then((res) => {
      dispatch(setChats(res.data.chats.reverse()));
    });

    const s = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    s.on("ai-response", (payload) => {
      setMessages((m) => [...m, { type: "ai", content: payload.content }]);
      dispatch(sendingFinished());
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  const handleNewChat = async () => {
    const res = await api.post("/api/chat", { title: "New Chat" });
    dispatch(startNewChat(res.data.chat));
    dispatch(selectChat(res.data.chat._id));
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (id) => {
    await api.delete(`/api/chat/${id}`);
    dispatch(setChats(chats.filter((c) => c._id !== id)));

    if (id === activeChatId) {
      dispatch(selectChat(null));
      setMessages([]);
    }
  };

 const handleRenameChat = async (id, title) => {
  const res = await api.put(`/api/chat/${id}`, { title });
  dispatch(
    setChats(
      chats.map((c) =>
        c._id === id ? res.data.chat : c
      )
    )
  );
};

  const getMessages = async (id) => {
    const res = await api.get(`/api/chat/${id}/messages`);
    setMessages(
      res.data.messages.map((m) => ({
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
      }))
    );
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChatId || isSending) return;

    dispatch(sendingStarted());
    setMessages((m) => [...m, { type: "user", content: input }]);
    dispatch(setInput(""));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: input,
    });
  };

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onNewChat={handleNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          dispatch(selectChat(id));
          getMessages(id);
          setSidebarOpen(false);
        }}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />
      <main className="chat-main">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <h1>Aiva+</h1>
          </div>
        )}
        <ChatMessages messages={messages} isSending={isSending} />
        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
