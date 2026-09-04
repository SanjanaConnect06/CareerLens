function FeatureCard({
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      className="group cursor-pointer rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
      }}
    >

      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
        style={{
          backgroundColor: "var(--bg-hover)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </div>

      <h3
        className="mt-8 text-xl font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>

      <p
        className="mt-4 text-sm leading-7"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>

      <p
        className="mt-6 text-sm font-medium"
        style={{ color: "var(--accent)" }}
      >
        Explore Feature →
      </p>

    </div>
  );
}

export default FeatureCard;