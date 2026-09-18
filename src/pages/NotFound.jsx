import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <main className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-[#C9A7C7]">
          404
        </p>

        <h1 className="mt-3 text-5xl md:text-7xl font-semibold tracking-tight text-[#3D3A3A]">
          Lost somewhere?
        </h1>

        <p className="mt-4 text-[#3D3A3A]/55">
          This conversation doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#3D3A3A] px-6 py-3.5 text-sm font-medium text-white hover:-translate-y-0.5 transition"
        >
          <ArrowLeft size={17} />
          Back home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;