import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getCareerGoal,
  saveCareerGoal,
} from "../api/careerGoalApi";
import { getHistory } from "../api/resumeApi";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [careerGoal, setCareerGoal] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const [resumeStats, setResumeStats] = useState({
    total: 0,
    highest: null,
  });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

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

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const data = await getCareerGoal();

        setCareerGoal(data.career_goal || "");
      } catch (error) {
        console.error(
          "Failed to load career goal:",
          error
        );
      }
    };

    loadGoal();

    const loadResumeStats = async () => {
      try {
        const history = await getHistory();

        const scores = Array.isArray(history)
          ? history
              .map((item) => Number(item.ats_score))
              .filter((score) => !Number.isNaN(score))
          : [];

        setResumeStats({
          total: Array.isArray(history)
            ? history.length
            : 0,
          highest: scores.length
            ? Math.max(...scores)
            : null,
        });
      } catch (error) {
        console.error(
          "Failed to load resume statistics:",
          error
        );

        setResumeStats({
          total: 0,
          highest: null,
        });
      }
    };

    loadResumeStats();
  }, []);

  const startEditing = () => {
    setSelectedGoal(
      goals.includes(careerGoal)
        ? careerGoal
        : careerGoal
          ? "Other"
          : ""
    );

    setCustomGoal(
      goals.includes(careerGoal)
        ? ""
        : careerGoal
    );

    setEditingGoal(true);
  };

  const handleSaveGoal = async () => {
    const finalGoal =
      selectedGoal === "Other"
        ? customGoal.trim()
        : selectedGoal.trim();

    if (!finalGoal) {
      alert("Please select or enter your career goal.");
      return;
    }

    try {
      setSaving(true);

      await saveCareerGoal(finalGoal);

      setCareerGoal(finalGoal);
      setEditingGoal(false);

      window.dispatchEvent(
        new Event("careerGoalUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to save career goal:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save your career goal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Page Header */}
      <div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Account
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </h1>

        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Manage your CareerLens profile and career information.
        </p>
      </div>

      {/* Profile Header */}
      <div
        className="mt-8 rounded-2xl border p-6 lg:p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            {initials}
          </div>

          <div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name || "User"}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {user?.email || "No email available"}
            </p>
          </div>

        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Personal Information */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Personal Information
            </h3>

            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Your account information
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Full Name
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.name || "Not available"}
              </p>
            </div>

            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Email Address
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Career Goal
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{
                  color: careerGoal
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {careerGoal || "Not selected yet"}
              </p>
            </div>

          </div>
        </div>

        {/* Resume Statistics */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Resume Statistics
            </h3>

            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Your resume analysis activity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Total Analyses
              </p>

              <p
                className="mt-2 text-2xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {resumeStats.total}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-primary)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Highest ATS
              </p>

              <p
                className="mt-2 text-2xl font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {resumeStats.highest !== null
                  ? resumeStats.highest
                  : "-"}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Career Goal */}
      <div
        className="mt-6 rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Career Goal
            </h3>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {careerGoal
                ? "Your selected career goal is used to personalize your CareerLens experience."
                : "You haven't selected a career goal yet."}
            </p>

            {careerGoal && (
              <p
                className="mt-3 text-base font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {careerGoal}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={startEditing}
            className="w-fit rounded-lg border px-4 py-2.5 text-xs font-medium transition hover:opacity-80"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            {careerGoal ? "Change Goal" : "Select Goal"}
          </button>

        </div>

        {/* Edit Area */}
        {editingGoal && (
          <div
            className="mt-6 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
            }}
          >
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Choose your target career
            </label>

            <select
              value={selectedGoal}
              onChange={(e) =>
                setSelectedGoal(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-card)",
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

            {selectedGoal === "Other" && (
              <input
                type="text"
                value={customGoal}
                onChange={(e) =>
                  setCustomGoal(e.target.value)
                }
                placeholder="Enter your career goal"
                className="mt-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingGoal(false)}
                className="rounded-lg border px-4 py-2.5 text-xs font-medium"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveGoal}
                disabled={saving}
                className="rounded-lg px-4 py-2.5 text-xs font-medium text-white disabled:opacity-60"
                style={{
                  backgroundColor: "var(--accent)",
                }}
              >
                {saving ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member Information */}
      <div
        className="mt-6 rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Member Since
        </p>

        <p
          className="mt-2 text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {new Date().toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

    </DashboardLayout>
  );
}

export default Profile;