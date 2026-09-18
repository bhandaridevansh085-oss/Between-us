import { UserRound } from "lucide-react";

function MatchLoader() {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full bg-[#FFB7C9]/25 animate-ping" />

        <div className="relative w-24 h-24 rounded-full bg-white border border-[#EAE4E1] flex items-center justify-center shadow-sm">
          <UserRound
            size={30}
            strokeWidth={1.5}
            className="text-[#C9A7C7]"
          />
        </div>
      </div>

      <h1 className="mt-8 text-3xl md:text-4xl font-semibold tracking-tight text-[#3D3A3A]">
        Finding someone...
      </h1>

      <p className="mt-3 text-sm text-[#3D3A3A]/50">
        Looking for someone new to talk to.
      </p>
    </div>
  );
}

export default MatchLoader;