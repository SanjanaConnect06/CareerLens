import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SkillGapForm from "../components/skillgap/SkillGapForm";
import SkillGapResult from "../components/skillgap/SkillGapResult";

function SkillGapAnalysis() {
  const [result, setResult] = useState(null);

  return (
    <DashboardLayout>

      {/* Page Header */}
      <div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Career Intelligence
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Skill Gap Analysis
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm leading-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Compare your current abilities with the skills required
          for your target career and identify what you should learn next.
        </p>
      </div>

      {/* Skill Analysis Form */}
      <div
        className="mt-8 rounded-2xl border p-6 lg:p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="mb-6">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Analyze your skills
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Enter your target career and current skills to get a
            personalized gap analysis.
          </p>
        </div>

        <SkillGapForm setResult={setResult} />
      </div>

      {/* Result */}
      {result && (
        <div className="mt-8">
          <SkillGapResult result={result} />
        </div>
      )}

    </DashboardLayout>
  );
}

export default SkillGapAnalysis;