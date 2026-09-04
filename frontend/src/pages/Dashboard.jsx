import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import { getLatestResumeScore } from "../api/resumeApi";
import { getInterviewCount } from "../api/interviewApi";
import { getCareerGoal } from "../api/careerGoalApi";
import { getLatestSkillMatch } from "../api/skillGapApi";

import {
  getCurrentRoadmap,
  getRoadmapProgress,
} from "../api/roadmapApi";

function Dashboard() {
  const [resumeScore, setResumeScore] = useState(null);
  const [interviewCount, setInterviewCount] = useState(0);
  const [careerGoal, setCareerGoal] = useState("");
  const [skillMatch, setSkillMatch] = useState(null);

  const [totalPhases, setTotalPhases] = useState(0);
  const [completedPhases, setCompletedPhases] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // --------------------------------------------------------
        // Resume score
        // --------------------------------------------------------

        try {
          const score = await getLatestResumeScore();
          setResumeScore(score);
        } catch (error) {
          console.error(
            "Failed to load resume score:",
            error
          );
          setResumeScore(null);
        }

        // --------------------------------------------------------
        // Interview count
        // --------------------------------------------------------

        try {
          const interviewData =
            await getInterviewCount();

          setInterviewCount(
            interviewData?.count || 0
          );
        } catch (error) {
          console.error(
            "Failed to load interview count:",
            error
          );
          setInterviewCount(0);
        }

        // --------------------------------------------------------
        // Career goal
        // --------------------------------------------------------

        try {
          const goalData =
            await getCareerGoal();

          setCareerGoal(
            goalData?.career_goal || ""
          );
        } catch (error) {
          console.error(
            "Failed to load career goal:",
            error
          );
          setCareerGoal("");
        }

        // --------------------------------------------------------
        // Skill match
        // --------------------------------------------------------

        try {
          const skillData =
            await getLatestSkillMatch();

          setSkillMatch(
            skillData?.skill_match ?? null
          );
        } catch (error) {
          console.error(
            "Failed to load skill match:",
            error
          );
          setSkillMatch(null);
        }

        // ========================================================
        // CURRENT ROADMAP
        // ========================================================
        
          try {
            const roadmapData = await getCurrentRoadmap();

            console.log(
              "CURRENT ROADMAP:",
              roadmapData
            );

            const currentRoadmap =
              roadmapData || null;

            // Actual roadmap object
            const roadmap =
              currentRoadmap?.roadmap || null;

            // Actual phases are inside roadmap.roadmap
            const phases =
              Array.isArray(roadmap?.roadmap)
                ? roadmap.roadmap
                : [];

            console.log(
              "TOTAL ROADMAP PHASES:",
              phases.length
            );

            setTotalPhases(
              phases.length
            );

            // Load progress for the current roadmap
            if (currentRoadmap?.id) {
              try {
                console.log(
                  "LOADING PROGRESS FOR ROADMAP:",
                  currentRoadmap.id
                );

                const progressData =
                  await getRoadmapProgress(
                    currentRoadmap.id
                  );

                console.log(
                  "ROADMAP PROGRESS:",
                  progressData
                );

                setCompletedPhases(
                  Array.isArray(
                    progressData?.completed_phases
                  )
                    ? progressData.completed_phases
                    : []
                );

              } catch (error) {
                console.error(
                  "Failed to load roadmap progress:",
                  error
                );

                setCompletedPhases([]);
              }

            } else {
              console.log(
                "No roadmap ID found."
              );

              setCompletedPhases([]);
            }

          } catch (error) {
            console.error(
              "Failed to load current roadmap:",
              error
            );

            setTotalPhases(0);
            setCompletedPhases([]);
          }
                  
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ============================================================
  // ROADMAP PROGRESS %
  // ============================================================

  const roadmapProgress =
    totalPhases > 0
      ? Math.round(
          (completedPhases.length /
            totalPhases) *
            100
        )
      : 0;

  // ============================================================
  // RESUME SCORE
  // ============================================================

  const displayResumeScore =
    resumeScore !== null &&
    resumeScore !== undefined
      ? resumeScore
      : "--";

  // ============================================================
  // SKILL MATCH
  // ============================================================

  const displaySkillMatch =
    skillMatch !== null &&
    skillMatch !== undefined
      ? `${skillMatch}%`
      : "--";

  return (
    <DashboardLayout>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div>
        <p
          className="text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Overview
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Dashboard
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Track your career progress and
          continue building toward your goal.
        </p>
      </div>

      {/* ====================================================== */}
      {/* CAREER GOAL */}
      {/* ====================================================== */}

      <div
        className="mt-8 rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Current Career Goal
            </p>

            <h2
              className="mt-2 text-xl font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {careerGoal ||
                "Career goal not selected"}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {careerGoal
                ? "Your CareerLens recommendations are personalized around this goal."
                : "Select a career goal to personalize your CareerLens experience."}
            </p>
          </div>

          <div
            className="w-fit rounded-lg border px-4 py-2 text-xs font-medium"
            style={{
              backgroundColor:
                "var(--bg-secondary)",
              borderColor:
                "var(--border-primary)",
              color: careerGoal
                ? "var(--accent)"
                : "var(--text-muted)",
            }}
          >
            {careerGoal
              ? "Goal Set"
              : "Not Selected"}
          </div>

        </div>
      </div>

      {/* ====================================================== */}
      {/* STAT CARDS */}
      {/* ====================================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Resume */}
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Resume Score
          </p>

          <p
            className="mt-2 text-3xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {loading
              ? "..."
              : displayResumeScore}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Latest ATS analysis
          </p>
        </div>

        {/* Skill Match */}
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Skill Match
          </p>

          <p
            className="mt-2 text-3xl font-semibold"
            style={{
              color: "var(--accent)",
            }}
          >
            {loading
              ? "..."
              : displaySkillMatch}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Match with target career
          </p>
        </div>

        {/* Interviews */}
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Interviews
          </p>

          <p
            className="mt-2 text-3xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {loading
              ? "..."
              : interviewCount}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Completed interview sessions
          </p>
        </div>

        {/* Roadmap */}
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Roadmap Progress
          </p>

          <p
            className="mt-2 text-3xl font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {loading
              ? "..."
              : `${roadmapProgress}%`}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            {totalPhases > 0
              ? `${completedPhases.length} of ${totalPhases} phases completed`
              : "No roadmap created yet"}
          </p>
        </div>

      </div>

      {/* ====================================================== */}
      {/* ROADMAP PROGRESS */}
      {/* ====================================================== */}

      <div
        className="mt-6 rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
        }}
      >

        <div className="flex items-center justify-between">

          <div>
            <h2
              className="text-lg font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Career Roadmap
            </h2>

            <p
              className="mt-1 text-xs"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Your progress toward your career goal.
            </p>
          </div>

          <span
            className="text-sm font-semibold"
            style={{
              color: "var(--accent)",
            }}
          >
            {roadmapProgress}%
          </span>

        </div>

        {/* Progress bar */}
        <div
          className="mt-5 h-2 overflow-hidden rounded-full"
          style={{
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${roadmapProgress}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs">

          <span
            style={{
              color: "var(--text-muted)",
            }}
          >
            {completedPhases.length} completed
          </span>

          <span
            style={{
              color: "var(--text-muted)",
            }}
          >
            {totalPhases} total phases
          </span>

        </div>

      </div>

      {/* ====================================================== */}
      {/* EMPTY ROADMAP MESSAGE */}
      {/* ====================================================== */}

      {!loading &&
        totalPhases === 0 && (
          <div
            className="mt-6 rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <h3
              className="text-base font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              No career roadmap yet
            </h3>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Create a career roadmap to start
              tracking your learning progress.
            </p>
          </div>
        )}

    </DashboardLayout>
  );
}

export default Dashboard;