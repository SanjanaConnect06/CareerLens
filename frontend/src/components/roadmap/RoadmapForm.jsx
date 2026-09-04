import { useState } from "react";
import { generateRoadmap } from "../../api/roadmapApi";
import Button from "../common/Button";

function RoadmapForm({ setRoadmap }) {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("College Student");
  const [industry, setIndustry] = useState("Technology");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goal.trim()) {
      alert("Please enter your dream career.");
      return;
    }

    try {
      setLoading(true);

      const data = await generateRoadmap(
        goal,
        level,
        industry
      );

      console.log("ROADMAP SUCCESS:", data);

      setRoadmap(data);
    } catch (error) {
      console.error("ROADMAP ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("SERVER RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Failed to generate roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border p-8"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Career Goal */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Career Goal
        </label>

        <input
          type="text"
          placeholder="e.g. Software Engineer, Doctor, Lawyer..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />

        <p
          className="mt-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Enter the career you want to pursue.
        </p>
      </div>

      {/* Current Level */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Current Level
        </label>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
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

      {/* Industry */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Preferred Industry
          <span
            className="ml-1 text-xs font-normal"
            style={{ color: "var(--text-muted)" }}
          >
            (Optional)
          </span>
        </label>

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        >
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Education</option>
          <option>Government</option>
          <option>Design</option>
          <option>Marketing</option>
          <option>Business</option>
          <option>Other</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Generating Roadmap..."
            : "Generate AI Roadmap"}
        </Button>
      </div>
    </form>
  );
}

export default RoadmapForm;