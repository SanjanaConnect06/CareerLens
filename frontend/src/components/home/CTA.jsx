import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24"
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: "var(--accent)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        {/* Label */}
        <p
          className="text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--accent)" }}
        >
          Start your journey
        </p>

        {/* Heading */}
        <h2
          className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--text-primary)" }}
        >
          Ready to build your career?
        </h2>

        {/* Description */}
        <p
          className="mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Analyze your resume, discover your skill gaps, build a
          personalized roadmap, and prepare for your next interview
          with CareerLens.
        </p>

        {/* Button */}
        <div className="mt-8 flex justify-center">

          <button
            onClick={() => navigate("/register")}
            className="rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              backgroundColor: "var(--accent)",
            }}
          >
            Get Started
          </button>

        </div>

        {/* Small Trust Text */}
        <p
          className="mt-5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Create your account and start building a clearer career path.
        </p>

      </div>
    </section>
  );
}

export default CTA;