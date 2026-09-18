import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  X,
  Flag,
  Ban,
} from "lucide-react";
import { io } from "socket.io-client";

import ChatHeader from "../components/ChatHeader";
import MatchLoader from "../components/MatchLoader";
import MessageBubble from "../components/MessageBubble";

function Chat() {
  const [status, setStatus] = useState("matching");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [strangerName, setStrangerName] = useState("Stranger");
  const [showReport, setShowReport] = useState(false);

  const socketRef = useRef(null);
  const roomIdRef = useRef(null);
  const messagesEndRef = useRef(null);

  const name = localStorage.getItem("betweenUsName");
  const userId = localStorage.getItem("betweenUsUserId");

  useEffect(() => {
    if (!name || !userId) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Connected to Between Us server:",
        socket.id
      );

      socket.emit("find-stranger", {
        userId,
        name,
      });
    });

    socket.on("waiting", () => {
      console.log("Waiting for stranger...");

      roomIdRef.current = null;
      setStatus("matching");
      setMessages([]);
      setShowReport(false);
    });

    socket.on("matched", ({ roomId, strangerName }) => {
      console.log(
        "MATCHED:",
        strangerName,
        roomId
      );

      roomIdRef.current = roomId;

      setStrangerName(strangerName);
      setMessages([]);
      setStatus("matched");
      setShowReport(false);
    });

    socket.on("receive-message", ({ message }) => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          text: message,
          mine: false,
        },
      ]);
    });

    socket.on("stranger-left", () => {
      console.log("Stranger left");

      roomIdRef.current = null;
      setMessages([]);
      setShowReport(false);
      setStatus("matching");
    });

    socket.on("blocked", () => {
      console.log("You were blocked.");

      roomIdRef.current = null;
      setMessages([]);
      setShowReport(false);
      setStatus("matching");

      socket.emit("find-stranger", {
        userId,
        name,
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      roomIdRef.current = null;
    };
  }, [name, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!name || !userId) {
    return <Navigate to="/" replace />;
  }

  const handleSend = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    const socket = socketRef.current;
    const roomId = roomIdRef.current;

    if (!trimmedMessage || !socket || !roomId) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: trimmedMessage,
        mine: true,
      },
    ]);

    socket.emit("send-message", {
      roomId,
      message: trimmedMessage,
    });

    setMessage("");
  };

  const handleNext = () => {
    const socket = socketRef.current;
    const roomId = roomIdRef.current;

    setMessages([]);
    setMessage("");
    setShowReport(false);
    setStatus("matching");
    roomIdRef.current = null;

    if (!socket) return;

    socket.emit("next-stranger", {
      roomId,
      userId,
      name,
    });
  };

  const handleLeave = () => {
    const socket = socketRef.current;
    const roomId = roomIdRef.current;

    if (socket && roomId) {
      socket.emit("leave-chat", {
        roomId,
      });
    }

    roomIdRef.current = null;
  };

  const handleReport = (reason) => {
    const socket = socketRef.current;
    const roomId = roomIdRef.current;

    if (!socket || !roomId) return;

    socket.emit("report-user", {
      roomId,
      reason,
    });

    console.log("Report submitted:", reason);

    setShowReport(false);
  };

  const handleBlock = () => {
    const socket = socketRef.current;
    const roomId = roomIdRef.current;

    if (!socket || !roomId) return;

    socket.emit("block-user", {
      roomId,
    });

    roomIdRef.current = null;
    setMessages([]);
    setShowReport(false);
    setStatus("matching");
  };

  if (status === "matching") {
    return (
      <main className="min-h-screen bg-[#FFF9F5] flex flex-col">
        <header className="px-6 md:px-10 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3D3A3A]/60 hover:text-[#3D3A3A] transition"
          >
            <ArrowLeft size={17} />
            Back
          </Link>
        </header>

        <section className="flex-1 flex items-center justify-center px-6">
          <MatchLoader />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F5] flex flex-col">
      <header className="px-5 md:px-8 py-4 border-b border-[#EAE4E1]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            onClick={handleLeave}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3D3A3A]/60 hover:text-[#3D3A3A] transition"
          >
            <ArrowLeft size={17} />
            Leave
          </Link>

          <span className="text-xs font-medium text-[#3D3A3A]/40">
            Between Us
          </span>
        </div>
      </header>

      <section className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl flex flex-col">
          <div className="bg-white border border-[#EAE4E1] rounded-3xl p-5 md:p-6 shadow-sm">
            <ChatHeader
              name={strangerName}
              onReport={() => setShowReport(true)}
            />
          </div>

          <div className="mt-4 bg-white border border-[#EAE4E1] rounded-3xl shadow-sm min-h-[450px] p-5 md:p-7 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full min-h-[390px] flex items-center justify-center text-center">
                  <div>
                    <p className="text-sm font-medium text-[#3D3A3A]/60">
                      You're connected.
                    </p>

                    <p className="mt-1 text-sm text-[#3D3A3A]/40">
                      Say hello and start the conversation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((item) => (
                    <MessageBubble
                      key={item.id}
                      message={item.text}
                      mine={item.mine}
                    />
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSend}
            className="mt-4 flex items-center gap-3"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 h-12 rounded-full border border-[#EAE4E1] bg-white px-5 text-sm text-[#3D3A3A] placeholder:text-[#3D3A3A]/35 outline-none focus:border-[#C7B8F5] transition"
            />

            <button
              type="submit"
              className="w-12 h-12 shrink-0 rounded-full bg-[#3D3A3A] text-white flex items-center justify-center hover:-translate-y-0.5 transition"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handleNext}
              className="rounded-full border border-[#EAE4E1] bg-white px-5 py-2.5 text-sm font-medium text-[#3D3A3A] shadow-sm hover:bg-[#FFF9F5] hover:border-[#C7B8F5] hover:-translate-y-0.5 transition-all"
            >
              Next stranger
            </button>

            <span className="w-1 h-1 rounded-full bg-[#EAE4E1]" />

            <button
              onClick={() => setShowReport(true)}
              className="text-sm font-medium text-[#C9A7C7] hover:text-[#3D3A3A] transition"
            >
              Report
            </button>
          </div>
        </div>
      </section>

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D3A3A]/25 px-5">
          <div className="w-full max-w-md rounded-3xl bg-white border border-[#EAE4E1] shadow-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FFB7C9]/25 flex items-center justify-center">
                  <Flag
                    size={18}
                    className="text-[#C9A7C7]"
                  />
                </div>

                <h2 className="mt-4 text-xl font-semibold text-[#3D3A3A]">
                  Report this conversation
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#3D3A3A]/50">
                  Tell us what happened. Your report helps keep Between Us safe.
                </p>
              </div>

              <button
                onClick={() => setShowReport(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#EAE4E1]/60 transition"
              >
                <X
                  size={18}
                  className="text-[#3D3A3A]/50"
                />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleReport("Harassment")}
                className="w-full text-left px-4 py-3 rounded-2xl border border-[#EAE4E1] text-sm text-[#3D3A3A] hover:bg-[#FFF9F5] transition"
              >
                Harassment
              </button>

              <button
                onClick={() => handleReport("Spam")}
                className="w-full text-left px-4 py-3 rounded-2xl border border-[#EAE4E1] text-sm text-[#3D3A3A] hover:bg-[#FFF9F5] transition"
              >
                Spam
              </button>

              <button
                onClick={() =>
                  handleReport("Inappropriate content")
                }
                className="w-full text-left px-4 py-3 rounded-2xl border border-[#EAE4E1] text-sm text-[#3D3A3A] hover:bg-[#FFF9F5] transition"
              >
                Inappropriate content
              </button>

              <button
                onClick={() =>
                  handleReport("Something else")
                }
                className="w-full text-left px-4 py-3 rounded-2xl border border-[#EAE4E1] text-sm text-[#3D3A3A] hover:bg-[#FFF9F5] transition"
              >
                Something else
              </button>
            </div>

            <button
              onClick={handleBlock}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#EAE4E1] px-5 py-3 text-sm font-medium text-[#3D3A3A] hover:bg-[#FFF9F5] transition"
            >
              <Ban size={16} />
              Block this person
            </button>

            <button
              onClick={() => setShowReport(false)}
              className="w-full mt-2 rounded-full bg-[#3D3A3A] px-5 py-3 text-sm font-medium text-white hover:-translate-y-0.5 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Chat;