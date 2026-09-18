import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
  const trimmedName = name.trim();

  if (!trimmedName) return;

  const userId =
    localStorage.getItem("betweenUsUserId") ||
    crypto.randomUUID();

  localStorage.setItem("betweenUsUserId", userId);
  localStorage.setItem("betweenUsName", trimmedName);

  navigate("/chat");
};

  return (
    <main className="min-h-screen bg-[#FFF9F5]">
      <Navbar />

      <section className="relative min-h-[calc(100vh-90px)] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#FFB7C9]/25 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-[#C7B8F5]/25 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EAE4E1] shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#9FD8B9]" />

            <span className="text-sm text-[#3D3A3A]/70">
              Anonymous conversations
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.05em] text-[#3D3A3A] leading-[0.95]">
            Someone new.
            <br />

            <span className="text-[#C9A7C7]">
              Somewhere between.
            </span>
          </h1>

          <p className="max-w-xl mx-auto mt-7 text-base md:text-lg leading-relaxed text-[#3D3A3A]/60">
            Meet someone you've never met before. No profiles,
            no pressure. Just a conversation between two strangers.
          </p>

          <div className="max-w-sm mx-auto mt-9">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
              maxLength={30}
              placeholder="Enter your name"
              className="w-full h-14 rounded-full border border-[#EAE4E1] bg-white px-6 text-sm text-[#3D3A3A] placeholder:text-[#3D3A3A]/35 outline-none focus:border-[#C7B8F5] transition"
            />

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="group w-full mt-3 inline-flex items-center justify-center gap-3 rounded-full bg-[#3D3A3A] px-7 py-4 text-white font-medium shadow-lg shadow-[#3D3A3A]/10 transition-all hover:-translate-y-1 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              Start a conversation

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <span className="px-4 py-2 rounded-full bg-[#FFB7C9]/20 text-sm text-[#3D3A3A]/70">
              Random
            </span>

            <span className="px-4 py-2 rounded-full bg-[#C7B8F5]/20 text-sm text-[#3D3A3A]/70">
              Anonymous
            </span>

            <span className="px-4 py-2 rounded-full bg-[#D9F2E6]/50 text-sm text-[#3D3A3A]/70">
              Real people
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;