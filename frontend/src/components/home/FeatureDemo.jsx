function FeatureDemo({ feature, onClose }) {
  if (!feature) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border p-8 shadow-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              CareerLens Demo
            </p>

            <h2
              className="mt-2 text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {feature.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            ×
          </button>
        </div>

        {/* Demo Content */}
        <div
          className="mt-6 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
          }}
        >
          <p
            className="text-sm leading-7"
            style={{ color: "var(--text-secondary)" }}
          >
            {feature.demoDescription}
          </p>

          <div className="mt-6 space-y-3">
            {feature.highlights.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-primary)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  ✓ {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              window.location.href = "/register";
            }}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{
              backgroundColor: "var(--accent)",
            }}
          >
            Create Account to Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureDemo;