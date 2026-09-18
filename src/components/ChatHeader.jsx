import { ShieldAlert, UserRound } from "lucide-react";

function ChatHeader({ name, onReport }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full bg-[#C7B8F5]/25 flex items-center justify-center">
          <UserRound
            size={19}
            className="text-[#C9A7C7]"
          />

          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#D9F2E6] border-2 border-white" />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#3D3A3A]">
            {name}
          </p>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9FD8B9]" />

            <span className="text-xs text-[#3D3A3A]/45">
              Online
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onReport}
        className="inline-flex items-center gap-2 rounded-full border border-[#EAE4E1] bg-white px-3.5 py-2 text-xs font-medium text-[#3D3A3A]/55 hover:text-[#C9A7C7] hover:border-[#C7B8F5] transition"
        aria-label="Report"
      >
        <ShieldAlert size={15} />
        Report
      </button>
    </div>
  );
}

export default ChatHeader;