import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

function Sidebar() {
  const [careerGoal, setCareerGoal] = useState("");

  const mainLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "⌂" },
    { to: "/resume", label: "Resume Analyzer", icon: "▣" },
    { to: "/history", label: "Resume History", icon: "◷" },
    { to: "/roadmap", label: "Career Roadmap", icon: "◇" },
    { to: "/interview", label: "Interview Coach", icon: "◎" },
    { to: "/skills", label: "Skill Gap", icon: "◈" },
  ];

  const accountLinks = [
    { to: "/profile", label: "Profile", icon: "○" },
  ];

  const loadCareerGoal = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCareerGoal("");
        return;
      }

      const response = await API.get("/career-goal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCareerGoal(response.data.career_goal || "");
    } catch (error) {
      console.error("Failed to load career goal:", error);
      setCareerGoal("");
    }
  };

  useEffect(() => {
    loadCareerGoal();

    // Update sidebar immediately when the goal changes in Profile
    const handleCareerGoalUpdate = () => {
      loadCareerGoal();
    };

    window.addEventListener(
      "careerGoalUpdated",
      handleCareerGoalUpdate
    );

    return () => {
      window.removeEventListener(
        "careerGoalUpdated",
        handleCareerGoalUpdate
      );
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
      isActive ? "font-medium" : ""
    }`;

  const linkStyle = ({ isActive }) => ({
    backgroundColor: isActive
      ? "var(--bg-hover)"
      : "transparent",

    color: isActive
      ? "var(--text-primary)"
      : "var(--text-secondary)",
  });

  return (
    <aside
      className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-[72px] items-center border-b px-5"
        style={{
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{
              backgroundColor: "var(--accent)",
            }}
          >
            C
          </div>

          <div>
            <h1
              className="text-[15px] font-semibold tracking-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              CareerLens
            </h1>

            <p
              className="text-[10px]"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Career Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p
          className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Main
        </p>

        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              style={linkStyle}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="flex w-5 justify-center text-[15px]"
                    style={{
                      color: isActive
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    }}
                  >
                    {link.icon}
                  </span>

                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div
          className="my-6 border-t"
          style={{
            borderColor: "var(--border-primary)",
          }}
        />

        {/* Account */}
        <p
          className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Account
        </p>

        <div className="space-y-1">
          {accountLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              style={linkStyle}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="flex w-5 justify-center text-[15px]"
                    style={{
                      color: isActive
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    }}
                  >
                    {link.icon}
                  </span>

                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div
        className="border-t p-3"
        style={{
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-3 rounded-lg px-2 py-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-primary)",
            }}
          >
            S
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Sanjana M
            </p>

            <p
              className="truncate text-[11px]"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {careerGoal || "Career goal not selected"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;