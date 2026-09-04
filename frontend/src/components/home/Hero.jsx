import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >

      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundColor: "var(--accent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                color: "var(--accent)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />

              AI-Powered Career Intelligence
            </div>


            <h1
              className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "var(--text-primary)" }}
            >
              See your future.
              <br />

              <span style={{ color: "var(--accent)" }}>
                Build your career.
              </span>
            </h1>


            <p
              className="mt-6 max-w-xl text-base leading-7 sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              CareerLens helps you understand where you stand,
              identify the skills you need, improve your resume,
              prepare for interviews, and build a clear path toward
              your career goals.
            </p>


            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/register")}
                className="rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{
                  backgroundColor: "var(--accent)",
                }}
              >
                Get Started
              </button>

              <a
                href="#features"
                className="rounded-lg border px-6 py-3 text-sm font-medium transition"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
              >
                Explore Features
              </a>

            </div>


            {/* Trust Text */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">

              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                ✓ AI-powered analysis
              </span>

              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                ✓ Personalized guidance
              </span>

              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                ✓ Career-focused tools
              </span>

            </div>

          </div>


          {/* Right Product Preview */}
          <div className="relative">

            <div
              className="rounded-2xl border p-4 shadow-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >

              {/* Fake Browser Header */}
              <div
                className="flex items-center gap-2 border-b pb-4"
                style={{
                  borderColor: "var(--border-primary)",
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--danger)" }}
                />

                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--warning)" }}
                />

                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--success)" }}
                />

                <div
                  className="ml-3 h-7 flex-1 rounded-md"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                  }}
                />
              </div>


              {/* Dashboard Preview */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* ATS */}
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ATS Score
                  </p>

                  <p
                    className="mt-2 text-4xl font-bold"
                    style={{ color: "var(--success)" }}
                  >
                    86%
                  </p>

                  <div
                    className="mt-4 h-2 overflow-hidden rounded-full"
                    style={{
                      backgroundColor: "var(--bg-hover)",
                    }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "86%",
                        backgroundColor: "var(--success)",
                      }}
                    />
                  </div>
                </div>


                {/* Skill Match */}
                <div
                  className="rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Skill Match
                  </p>

                  <p
                    className="mt-2 text-4xl font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    72%
                  </p>

                  <p
                    className="mt-3 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    4 skills to improve
                  </p>
                </div>


                {/* Roadmap */}
                <div
                  className="rounded-xl border p-5 sm:col-span-2"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                  }}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Career Roadmap
                      </p>

                      <p
                        className="mt-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Software Engineer
                      </p>
                    </div>

                    <span
                      className="rounded-full px-3 py-1 text-[10px]"
                      style={{
                        backgroundColor: "var(--bg-hover)",
                        color: "var(--accent)",
                      }}
                    >
                      In Progress
                    </span>

                  </div>


                  <div className="mt-5 space-y-3">

                    {[
                      ["Foundations", true],
                      ["Core Skills", true],
                      ["Projects", false],
                      ["Interview Prep", false],
                    ].map(([label, completed], index) => (

                      <div
                        key={label}
                        className="flex items-center gap-3"
                      >

                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px]"
                          style={{
                            backgroundColor: completed
                              ? "var(--success)"
                              : "var(--bg-hover)",
                            color: completed
                              ? "white"
                              : "var(--text-muted)",
                          }}
                        >
                          {completed ? "✓" : index + 1}
                        </div>

                        <span
                          className="text-xs"
                          style={{
                            color: completed
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                          }}
                        >
                          {label}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>


            {/* Floating Card */}
            <div
              className="absolute -bottom-6 -left-6 hidden rounded-xl border p-4 shadow-xl sm:block"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Career Readiness
              </p>

              <p
                className="mt-1 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Improving
              </p>

              <p
                className="mt-1 text-xs"
                style={{ color: "var(--success)" }}
              >
                +18% this month
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;