import { useState } from "react";
import { saveCareerGoal } from "../../api/careerGoalApi";

function CareerGoalModal({ onSaved }) {
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const goals = [
    "Software Engineer",
    "AI/ML Engineer",
    "Data Scientist",
    "Web Developer",
    "Cybersecurity Engineer",
    "Cloud Engineer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
  ];

  const handleSave = async () => {
    const finalGoal =
      goal === "Other"
        ? customGoal.trim()
        : goal.trim();

    if (!finalGoal) {
      alert("Please select or enter your career goal.");
      return;
    }

    try {
      setSaving(true);

      await saveCareerGoal(finalGoal);

      window.dispatchEvent(
        new Event("careerGoalUpdated")
      );

      onSaved(finalGoal);
    } catch (error) {
      console.error("Failed to save career goal:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to save your career goal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.72)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl sm:p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        {/* Header */}
        <div>
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            🎯
          </div>

          <h2
            className="text-2xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            What is your career goal?
          </h2>

          <p
            className="mt-2 text-sm leading-6"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Tell CareerLens what career you're aiming for.
            We'll use this to personalize your roadmap, skill
            analysis, resume guidance, and interview practice.
          </p>
        </div>

        {/* Goal */}
        <div className="mt-6">
          <label
            className="mb-2 block text-sm font-medium"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Select your target career
          </label>

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">
              Choose a career...
            </option>

            {goals.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Other career */}
        {goal === "Other" && (
          <div className="mt-4">
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Enter your career goal
            </label>

            <input
              type="text"
              value={customGoal}
              onChange={(e) =>
                setCustomGoal(e.target.value)
              }
              placeholder="e.g. Game Developer"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        )}

        {/* Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          {saving ? "Saving..." : "Save Career Goal"}
        </button>

        <p
          className="mt-3 text-center text-[11px]"
          style={{
            color: "var(--text-muted)",
          }}
        >
          You can change this later from your Profile.
        </p>
      </div>
    </div>
  );
}

export default CareerGoalModal;