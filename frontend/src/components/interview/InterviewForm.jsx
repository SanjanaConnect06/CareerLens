import { useState } from "react";
import { startInterview } from "../../api/interviewApi";
import Button from "../common/Button";

function InterviewForm({ setInterview }) {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("College Student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role.trim()) {
      alert("Please enter a career role.");
      return;
    }

    try {
      setLoading(true);

      const data = await startInterview(
        role.trim(),
        level
      );

      setInterview(data);
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to start the AI interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Career Role */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Career Role
        </label>

        <p
          className="mb-3 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          Enter the role you are preparing for.
        </p>

        <input
          type="text"
          placeholder="e.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Experience Level */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Experience Level
        </label>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        >
          <option>School Student</option>
          <option>College Student</option>
          <option>Fresher</option>
          <option>Working Professional</option>
          <option>Career Switcher</option>
        </select>
      </div>

      {/* Interview Information */}
      <div
        className="rounded-xl border p-4"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          🎤 AI Interview Simulation
        </p>

        <p
          className="mt-2 text-xs leading-5"
          style={{ color: "var(--text-secondary)" }}
        >
          The AI will ask you realistic interview questions
          one at a time. Answer using your microphone and
          receive a personalized performance report at the end.
        </p>

        <p
          className="mt-2 text-xs font-medium"
          style={{ color: "var(--accent)" }}
        >
          Maximum: 15 questions
        </p>
      </div>

      {/* Start Button */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Starting Interview..."
            : "Start AI Interview"}
        </Button>
      </div>

    </form>
  );
}

export default InterviewForm;