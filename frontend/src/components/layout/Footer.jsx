function Footer() {
  return (
    <footer
      className="border-t py-8"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-primary)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">

        {/* Brand */}
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            CareerLens
          </p>

          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            AI-powered career intelligence.
          </p>
        </div>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          © 2026 CareerLens. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;