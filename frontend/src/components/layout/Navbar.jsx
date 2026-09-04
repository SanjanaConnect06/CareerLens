import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (!section) return;

    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;

    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            CareerLens
          </h1>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 text-slate-300">

          <li>
            <button
              onClick={() => {
                navigate("/");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="transition hover:text-white"
            >
              Home
            </button>
          </li>

          <li>
            <button
              onClick={() => scrollToSection("features")}
              className="transition hover:text-white"
            >
              Features
            </button>
          </li>

          <li>
            <button
              onClick={() => scrollToSection("about")}
              className="transition hover:text-white"
            >
              About
            </button>
          </li>

        </ul>

        {/* Action Button */}
        <Button onClick={() => navigate("/register")}>
          Get Started
        </Button>

      </nav>
    </header>
  );
}

export default Navbar;