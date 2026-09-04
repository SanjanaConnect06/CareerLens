import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import InterviewForm from "../components/interview/InterviewForm";
import InterviewResult from "../components/interview/InterviewResult";

function InterviewCoach() {
  const [interview, setInterview] = useState(null);

  return (
    <DashboardLayout>

      {/* Page Header */}
      <div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Interview Preparation
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Interview Coach
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Practice realistic technical and behavioral interview
          questions tailored to your target career.
        </p>
      </div>

      {/* Interview Generator */}
      <div
        className="mt-8 rounded-2xl border p-6 transition-colors duration-200 lg:p-8"
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
            Start an interview session
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Select your target role and experience level to
            generate personalized questions.
          </p>
        </div>

        <InterviewForm setInterview={setInterview} />
      </div>

      {/* Generated Interview */}
      {interview && (
        <div className="mt-8">
          <InterviewResult interview={interview} />
        </div>
      )}

    </DashboardLayout>
  );
}

export default InterviewCoach;