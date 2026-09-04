import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getHistory,
  openResumeFromHistory,
} from "../api/resumeApi";

function History() {
  const [history, setHistory] = useState([]);
  const [openingId, setOpeningId] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load resume history:", error);
      }
    }

    loadHistory();
  }, []);

  // ============================================================
  // OPEN UPLOADED RESUME
  // ============================================================

  const handleOpenResume = async (resumeId) => {
    try {
      setOpeningId(resumeId);

      const blob = await openResumeFromHistory(resumeId);

      const fileURL = URL.createObjectURL(
        new Blob([blob], {
          type: "application/pdf",
        })
      );

      window.open(fileURL, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 60000);
    } catch (error) {
      console.error("Failed to open resume:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to open this resume."
      );
    } finally {
      setOpeningId(null);
    }
  };

  // ============================================================
  // SCORE STYLE
  // ============================================================

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return {
        backgroundColor: "var(--success-bg)",
        color: "var(--success)",
      };
    }

    if (score >= 60) {
      return {
        backgroundColor: "var(--warning-bg)",
        color: "var(--warning)",
      };
    }

    return {
      backgroundColor: "var(--danger-bg)",
      color: "var(--danger)",
    };
  };

  return (
    <DashboardLayout>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Resume Management
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Resume History
        </h1>

        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Review your previous resume analyses and ATS scores.
        </p>
      </div>


      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      {history.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          {/* Total Analyses */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--bg-card)",
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
              {history.length}
            </p>
          </div>


          {/* Highest ATS Score */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Highest ATS Score
            </p>

            <p
              className="mt-2 text-2xl font-semibold"
              style={{ color: "var(--success)" }}
            >
              {Math.max(
                ...history.map(
                  (item) => Number(item.ats_score) || 0
                )
              )}
              %
            </p>
          </div>


          {/* Average ATS Score */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Average ATS Score
            </p>

            <p
              className="mt-2 text-2xl font-semibold"
              style={{ color: "var(--accent)" }}
            >
              {Math.round(
                history.reduce(
                  (sum, item) =>
                    sum +
                    (Number(item.ats_score) || 0),
                  0
                ) / history.length
              )}
              %
            </p>
          </div>

        </div>
      )}


      {/* ====================================================== */}
      {/* HISTORY LIST */}
      {/* ====================================================== */}

      <div className="mt-8">

        {history.length === 0 ? (

          /* Empty State */
          <div
            className="rounded-2xl border p-12 text-center"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              📄
            </div>

            <h2
              className="mt-4 text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No resume analyses yet
            </h2>

            <p
              className="mx-auto mt-2 max-w-md text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Upload your resume in the Resume Analyzer to
              generate your first ATS analysis.
            </p>
          </div>

        ) : (

          <div className="space-y-4">

            {history.map((item) => {

              const isOpening =
                openingId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleOpenResume(item.id)
                  }
                  disabled={isOpening}
                  className="w-full rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
                  style={{
                    backgroundColor:
                      "var(--bg-card)",
                    borderColor:
                      "var(--border-primary)",
                  }}
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* ================================================= */}
                    {/* FILE INFORMATION */}
                    {/* ================================================= */}

                    <div className="flex min-w-0 items-center gap-4">

                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            "var(--bg-hover)",
                          color:
                            "var(--accent)",
                        }}
                      >
                        PDF
                      </div>

                      <div className="min-w-0">

                        <h2
                          className="truncate text-sm font-semibold"
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {item.filename}
                        </h2>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {new Date(
                            item.created_at + " UTC"
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle:
                                "medium",
                              timeStyle:
                                "short",
                            }
                          )}
                        </p>

                        <p
                          className="mt-2 text-xs"
                          style={{
                            color:
                              "var(--accent)",
                          }}
                        >
                          {isOpening
                            ? "Opening resume..."
                            : "Click to open resume →"}
                        </p>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* ATS SCORE */}
                    {/* ================================================= */}

                    <div
                      className="flex w-fit shrink-0 items-center gap-3 rounded-xl px-4 py-2"
                      style={getScoreStyle(
                        Number(
                          item.ats_score
                        ) || 0
                      )}
                    >

                      <div>

                        <p className="text-[10px] uppercase tracking-wider opacity-70">
                          ATS Score
                        </p>

                        <p className="text-lg font-bold">
                          {Number(
                            item.ats_score
                          ) || 0}
                          %
                        </p>

                      </div>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default History;