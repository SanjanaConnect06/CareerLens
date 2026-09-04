function WelcomeBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-8"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Accent Glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: "var(--accent)",
        }}
      />

      <div className="relative">

        <p
          className="text-xs font-semibold uppercase tracking-[0.14em]"
          style={{
            color: "var(--accent)",
          }}
        >
          Career Dashboard
        </p>

        <h2
          className="mt-3 text-3xl font-bold tracking-tight"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Welcome back!
        </h2>

        <p
          className="mt-3 max-w-2xl text-sm leading-6"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Continue building your career with CareerLens.
          Analyze your resume, improve your skills, prepare for interviews,
          and keep moving toward your goals.
        </p>

        {/* Progress Indicator */}
        <div className="mt-6 flex flex-wrap gap-3">

          <div
            className="rounded-lg border px-3 py-2 text-xs"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-secondary)",
            }}
          >
            Resume Analysis
          </div>

          <div
            className="rounded-lg border px-3 py-2 text-xs"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-secondary)",
            }}
          >
            Career Roadmap
          </div>

          <div
            className="rounded-lg border px-3 py-2 text-xs"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-secondary)",
            }}
          >
            Interview Prep
          </div>

        </div>

      </div>
    </div>
  );
}

export default WelcomeBanner;