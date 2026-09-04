import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { loginUser } from "../../api/authApi";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(data.message);

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  }

  return (
    <div className="w-full">

      <h1
        className="text-2xl font-semibold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        Welcome Back
      </h1>

      <p
        className="mt-2 text-sm leading-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Sign in to continue your CareerLens journey.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-6"
      >

        {/* Email */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Sign In */}
        <Button type="submit">
          Sign In
        </Button>

      </form>

      {/* Register */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Don't have an account?{" "}

        <Link
          to="/register"
          className="font-medium transition hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Register
        </Link>
      </p>

    </div>
  );
}

export default LoginForm;