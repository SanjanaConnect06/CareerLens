import RegisterForm from "../components/auth/RegisterForm";

function Register() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{
              backgroundColor: "var(--accent)",
            }}
          >
            C
          </div>

          <h1
            className="mt-4 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            CareerLens
          </h1>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Your intelligent career companion
          </p>
        </div>

        {/* Register Card */}
        <div
          className="rounded-2xl border p-6 shadow-sm sm:p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <RegisterForm />
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          © 2026 CareerLens. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Register;