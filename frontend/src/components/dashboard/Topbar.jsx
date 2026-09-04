import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const pageTitles = {
    "/dashboard": {
      title: "Dashboard",
      description: "Overview of your career progress and activity.",
    },
    "/resume": {
      title: "Resume Analyzer",
      description: "Analyze your resume and improve its ATS compatibility.",
    },
    "/history": {
      title: "Resume History",
      description: "View your previous resume analyses.",
    },
    "/roadmap": {
      title: "Career Roadmap",
      description: "Build a personalized roadmap for your career.",
    },
    "/interview": {
      title: "Interview Coach",
      description: "Practice realistic interview questions.",
    },
    "/skills": {
      title: "Skill Gap",
      description: "Identify the skills you need to reach your career goal.",
    },
    "/profile": {
      title: "Profile",
      description: "Manage your CareerLens AI profile.",
    },
  };

  const currentPage = pageTitles[location.pathname] || {
    title: "CareerLens AI",
    description: "Your AI-powered career companion.",
  };

  const searchItems = [
    {
      title: "Dashboard",
      description: "Career overview and activity",
      path: "/dashboard",
    },
    {
      title: "Resume Analyzer",
      description: "Analyze your resume",
      path: "/resume",
    },
    {
      title: "Resume History",
      description: "View previous resume analyses",
      path: "/history",
    },
    {
      title: "Career Roadmap",
      description: "Build your career roadmap",
      path: "/roadmap",
    },
    {
      title: "Interview Coach",
      description: "Practice interview questions",
      path: "/interview",
    },
    {
      title: "Skill Gap",
      description: "Analyze your missing skills",
      path: "/skills",
    },
    {
      title: "Profile",
      description: "Manage your profile",
      path: "/profile",
    },
  ];

  const filteredResults = searchItems.filter((item) => {
    const query = search.toLowerCase().trim();

    if (!query) return false;

    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  const handleSearchSelect = (path) => {
    setSearch("");
    setShowResults(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key === "Escape") {
        setSearch("");
        setShowResults(false);
        searchRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b px-6 lg:px-8"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Page Information */}
      <div className="min-w-0">
        <h2
          className="truncate text-lg font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {currentPage.title}
        </h2>

        <p
          className="mt-0.5 hidden text-xs sm:block"
          style={{ color: "var(--text-muted)" }}
        >
          {currentPage.description}
        </p>
      </div>

      {/* Right Side */}
      <div className="ml-6 flex items-center gap-3">

        {/* Theme */}
        <button
          onClick={toggleTheme}
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition"
          style={{
            borderColor: "var(--border-primary)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-secondary)",
          }}
          title={`Switch to ${
            theme === "dark" ? "light" : "dark"
          } mode`}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        {/* Search */}
        <div className="relative hidden md:block">
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition focus-within:border-[var(--border-secondary)]"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              color: "var(--text-muted)",
            }}
          >
            <span className="text-sm">⌕</span>

            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => {
                if (search.trim()) {
                  setShowResults(true);
                }
              }}
              placeholder="Search"
              className="w-28 bg-transparent text-sm outline-none"
              style={{
                color: "var(--text-primary)",
              }}
            />

            <span
              className="ml-2 rounded border px-1.5 py-0.5 text-[10px]"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-muted)",
              }}
            >
              /
            </span>
          </div>

          {/* Search Results */}
          {showResults && search.trim() && (
            <div
              className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border shadow-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              {filteredResults.length > 0 ? (
                <div className="p-2">
                  {filteredResults.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleSearchSelect(item.path)}
                      className="w-full rounded-lg px-3 py-3 text-left transition hover:bg-[var(--bg-hover)]"
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </p>

                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No results found
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Try searching for resume, interview, roadmap, or skills.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="hidden h-7 w-px sm:block"
          style={{ backgroundColor: "var(--border-primary)" }}
        />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name || "User"}
            </p>

            <p
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              CareerLens Account
            </p>
          </div>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold"
            style={{
              backgroundColor: "var(--bg-hover)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          type="button"
          className="rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-[var(--bg-hover)]"
          style={{
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;