import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageCircle, Shield, Sparkles } from "lucide-react";

function About() {
  return (
    <main className="min-h-screen bg-[#FFF9F5]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#3D3A3A]/60 hover:text-[#3D3A3A] transition"
        >
          <ArrowLeft size={17} />
          Back home
        </Link>

        <section className="max-w-3xl mx-auto pt-24 pb-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C7B8F5]/20 px-4 py-2 text-sm text-[#3D3A3A]/65">
            <Sparkles size={15} />
            About Between Us
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-[-0.05em] leading-[0.95] text-[#3D3A3A]">
            Sometimes,
            <br />
            strangers make
            <br />
            <span className="text-[#C9A7C7]">the best conversations.</span>
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-[#3D3A3A]/60">
            Between Us is a simple place to meet someone you've never met.
            No profiles, no follower counts and no pressure. Just two people
            having a conversation.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="rounded-3xl bg-white border border-[#EAE4E1] p-6">
              <MessageCircle size={23} className="text-[#C9A7C7]" />
              <h2 className="mt-5 font-semibold text-[#3D3A3A]">
                Real conversations
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#3D3A3A]/50">
                Start talking without needing to build a profile first.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-[#EAE4E1] p-6">
              <Sparkles size={23} className="text-[#FFB7C9]" />
              <h2 className="mt-5 font-semibold text-[#3D3A3A]">
                Completely random
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#3D3A3A]/50">
                Every conversation starts with someone new.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-[#EAE4E1] p-6">
              <Shield size={23} className="text-[#C7B8F5]" />
              <h2 className="mt-5 font-semibold text-[#3D3A3A]">
                Built with safety
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#3D3A3A]/50">
                Reporting and blocking are part of the experience.
              </p>
            </div>
          </div>

          <Link
            to="/chat"
            className="group inline-flex items-center gap-2 mt-12 rounded-full bg-[#3D3A3A] px-6 py-3.5 text-sm font-medium text-white hover:-translate-y-0.5 transition"
          >
            Start chatting
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition"
            />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default About;