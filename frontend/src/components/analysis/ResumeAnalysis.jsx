import ATSScore from "./ATSScore";
import generatePDF from "../../utils/generatePDF";

function ResumeAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="mt-10 space-y-6">

      {/* Analysis Header */}
      <div
        className="rounded-2xl border p-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.14em]"
              style={{ color: "var(--accent)" }}
            >
              AI Resume Evaluation
            </p>

            <h2
              className="mt-2 text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Resume Analysis
            </h2>

            <p
              className="mt-2 max-w-xl text-sm leading-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Your resume has been evaluated for ATS compatibility,
              clarity, skills, structure, and overall hiring readiness.
            </p>
          </div>

          {/* ATS Score */}
          <div className="shrink-0">
            <ATSScore score={analysis.ats_score} />
          </div>

        </div>
      </div>


      {/* Summary */}
      <div
        className="rounded-2xl border p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-3">

          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            AI
          </div>

          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              AI Summary
            </h3>

            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Overall assessment
            </p>
          </div>

        </div>

        <p
          className="mt-5 max-w-4xl text-sm leading-7"
          style={{ color: "var(--text-secondary)" }}
        >
          {analysis.summary}
        </p>
      </div>


      {/* Strengths + Loopholes */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Strengths */}
        <div
          className="rounded-2xl border p-7"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >

          <div className="flex items-center gap-3">

            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--bg-hover)",
                color: "var(--success)",
              }}
            >
              ✓
            </div>

            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Strengths
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                What your resume does well
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            {analysis.strengths?.length > 0 ? (
              analysis.strengths.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg border p-3.5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  <span
                    className="mt-0.5"
                    style={{ color: "var(--success)" }}
                  >
                    ✓
                  </span>

                  <p
                    className="text-sm leading-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item}
                  </p>
                </div>
              ))
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                No strengths detected.
              </p>
            )}

          </div>

        </div>


        {/* Loopholes */}
        <div
          className="rounded-2xl border p-7"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >

          <div className="flex items-center gap-3">

            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--bg-hover)",
                color: "var(--warning)",
              }}
            >
              !
            </div>

            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Loopholes
              </h3>

              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Issues that may reduce your chances
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-3">

            {analysis.weaknesses?.length > 0 ? (
              analysis.weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg border p-3.5"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  <span
                    className="mt-0.5"
                    style={{ color: "var(--warning)" }}
                  >
                    !
                  </span>

                  <p
                    className="text-sm leading-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item}
                  </p>
                </div>
              ))
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                No major loopholes detected.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* Missing Skills */}
      <div
        className="rounded-2xl border p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        <div className="flex items-center gap-3">

          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            +
          </div>

          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Missing Skills
            </h3>

            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Skills that could strengthen your profile
            </p>
          </div>

        </div>

        <div className="mt-5 flex flex-wrap gap-2">

          {analysis.missing_skills?.length > 0 ? (
            analysis.missing_skills.map((item, index) => (
              <span
                key={index}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                {item}
              </span>
            ))
          ) : (
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No major missing skills detected.
            </p>
          )}

        </div>

      </div>


      {/* Improvements */}
      <div
        className="rounded-2xl border p-7"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        <div className="flex items-center gap-3">

          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--accent)",
            }}
          >
            →
          </div>

          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Recommended Improvements
            </h3>

            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Practical changes you can make
            </p>
          </div>

        </div>

        <div className="mt-5 space-y-3">

          {analysis.improvements?.length > 0 ? (
            analysis.improvements.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border p-4"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-primary)",
                }}
              >

                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--bg-hover)",
                    color: "var(--accent)",
                  }}
                >
                  {index + 1}
                </div>

                <p
                  className="text-sm leading-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item}
                </p>

              </div>
            ))
          ) : (
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No additional improvements suggested.
            </p>
          )}

        </div>

      </div>


      {/* Download */}
      <div className="flex justify-end">

        <button
          onClick={() => generatePDF(analysis)}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          Download Report
        </button>

      </div>

    </div>
  );
}

export default ResumeAnalysis;