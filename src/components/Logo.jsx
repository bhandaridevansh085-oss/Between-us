import logo from "../assets/between-us-logo.png";

function Logo({ showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Between Us"
        className="w-10 h-10 object-contain"
      />

      {showText && (
        <span className="text-xl font-semibold tracking-tight text-[#3D3A3A]">
          between us
        </span>
      )}
    </div>
  );
}

export default Logo;