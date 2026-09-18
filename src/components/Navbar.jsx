import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Logo from "./Logo";

function Navbar() {
  return (
    <header className="w-full px-6 md:px-10 py-5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" aria-label="Between Us Home">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/about"
            className="text-sm font-medium text-[#3D3A3A]/70 hover:text-[#3D3A3A] transition"
          >
            About
          </Link>

          <Link
            to="/"
            className="group flex items-center gap-2 rounded-full bg-[#3D3A3A] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            Start chatting
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;