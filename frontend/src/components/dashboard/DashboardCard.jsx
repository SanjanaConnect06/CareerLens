function DashboardCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border p-6 text-left transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-primary)";
      }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition"
        style={{
          backgroundColor: "var(--bg-hover)",
          color: "var(--accent)",
        }}
      >
        →
      </div>

      {/* Content */}
      <h2
        className="mt-5 text-xl font-semibold"
        style={{
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>

      <p
        className="mt-3 text-sm leading-6"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        {description}
      </p>

      {/* Action */}
      <div
        className="mt-6 text-xs font-medium transition"
        style={{
          color: "var(--accent)",
        }}
      >
        Open feature →
      </div>
    </button>
  );
}

export default DashboardCard;