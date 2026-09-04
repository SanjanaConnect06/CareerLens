import { useState } from "react";
import { analyzeSkillGap } from "../../api/skillGapApi";

function SkillGapForm({ setResult }) {
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goal.trim()) {
      alert("Please enter your career goal.");
      return;
    }

    if (!skills.trim()) {
      alert("Please enter your current skills.");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzeSkillGap(goal, skills);

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Career Goal */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Career Goal
        </label>

        <p
          className="mb-3 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          Enter the career you want to pursue.
        </p>

        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Software Engineer, Doctor, Teacher..."
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Current Skills */}
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Current Skills
        </label>

        <p
          className="mb-3 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          List the skills you already have. Separate them with commas.
        </p>

        <textarea
          rows="6"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Example: Python, SQL, React, Git, Java..."
          className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />

        <p
          className="mt-2 text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          Include programming languages, tools, certifications,
          domain knowledge, or other relevant skills.
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>
      </div>

    </form>
  );
}

export default SkillGapForm;