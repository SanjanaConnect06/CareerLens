function About() {
  return (
    <section
      id="about"
      className="py-24"
      style={{
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div>

            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)" }}
            >
              Why CareerLens
            </p>

            <h2
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Turn career uncertainty into a clear plan.
            </h2>

            <p
              className="mt-6 text-base leading-7"
              style={{ color: "var(--text-secondary)" }}
            >
              Choosing a career can feel overwhelming when you don't
              know what skills to learn, whether your resume is strong
              enough, or how prepared you are for interviews.
            </p>

            <p
              className="mt-4 text-base leading-7"
              style={{ color: "var(--text-secondary)" }}
            >
              CareerLens brings these pieces together into one
              personalized career workspace, helping you understand
              where you are and what to do next.
            </p>

          </div>


          {/* Right Highlights */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                01
              </div>

              <h3
                className="mt-5 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Know Where You Stand
              </h3>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Understand your resume strength, current skills,
                and career readiness.
              </p>
            </div>


            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                02
              </div>

              <h3
                className="mt-5 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Find What You're Missing
              </h3>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Identify important skills you need to develop for
                your target career.
              </p>
            </div>


            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                03
              </div>

              <h3
                className="mt-5 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Build the Right Skills
              </h3>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Follow personalized roadmaps and practical
                recommendations.
              </p>
            </div>


            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-primary)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--accent)",
                }}
              >
                04
              </div>

              <h3
                className="mt-5 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Prepare With Confidence
              </h3>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Practice realistic interviews and understand how
                to improve before the real thing.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;