import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { registerUser } from "../../api/authApi";

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const data = await registerUser(
        name,
        email,
        password
      );

      alert(data.message);

      navigate("/login");
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

      {/* Heading */}
      <h1
        className="text-2xl font-semibold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        Create Account
      </h1>

      <p
        className="mt-2 text-sm leading-6"
        style={{ color: "var(--text-secondary)" }}
      >
        Create your CareerLens account and start building your career.
      </p>

      <form
        onSubmit={handleRegister}
        className="mt-8 space-y-6"
      >

        {/* Full Name */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Register Button */}
        <Button type="submit">
          Create Account
        </Button>

      </form>

      {/* Login Link */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-medium transition hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          Login
        </Link>
      </p>

    </div>
  );
}

export default RegisterForm;