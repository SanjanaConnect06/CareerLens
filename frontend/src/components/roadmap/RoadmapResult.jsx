import { useEffect } from "react";

import {
  getRoadmapProgress,
  updateRoadmapProgress,
} from "../../api/roadmapApi";


function RoadmapResult({
  roadmap,
  roadmapId,
  completedPhases,
  onSetCompletedPhases,
}) {

  // ============================================================
  // LOAD PROGRESS FOR THIS SPECIFIC ROADMAP
  // ============================================================

  useEffect(() => {
    if (!roadmap || !roadmapId) return;

    const loadProgress = async () => {
      try {
        const data = await getRoadmapProgress(roadmapId);

        console.log(
          "ROADMAP PROGRESS:",
          data
        );

        onSetCompletedPhases(
          data?.completed_phases || []
        );

      } catch (error) {
        console.error(
          "Failed to load roadmap progress:",
          error
        );
      }
    };

    loadProgress();
  }, [roadmapId]);


  if (!roadmap) return null;


  // ============================================================
  // TOGGLE PHASE
  // ============================================================

  const handleToggle = async (index) => {
  const scrollPosition = window.scrollY;

  const updatedPhases =
    completedPhases.includes(index)
      ? completedPhases.filter(
          (phaseIndex) =>
            phaseIndex !== index
        )
      : [
          ...completedPhases,
          index,
        ];

  // Update UI immediately
  onSetCompletedPhases(
    updatedPhases
  );

  // Keep the page at the same scroll position
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollPosition);
  });

  try {
    await updateRoadmapProgress(
      roadmapId,
      updatedPhases
    );

    console.log(
      "Progress saved:",
      updatedPhases
    );

  } catch (error) {
    console.error(
      "Failed to save roadmap progress:",
      error
    );
  }
};


  // ============================================================
  // CALCULATE PROGRESS
  // ============================================================

  const totalPhases =
    roadmap.roadmap?.length || 0;

  const completedCount =
    completedPhases.length;

  const progress =
    totalPhases > 0
      ? Math.round(
          (completedCount /
            totalPhases) *
            100
        )
      : 0;


  // ============================================================
  // SECTION COMPONENT
  // ============================================================

  const Section = ({
    title,
    children,
  }) => (
    <section
      className="rounded-2xl border p-6"
      style={{
        backgroundColor:
          "var(--bg-card)",
        borderColor:
          "var(--border-primary)",
      }}
    >

      <h3
        className="text-xl font-semibold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        {title}
      </h3>

      {children}

    </section>
  );


  // ============================================================
  // LIST COMPONENT
  // ============================================================

  const List = ({ items }) => (
    <ul className="mt-5 space-y-3">

      {items?.map(
        (item, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm leading-6"
            style={{
              color:
                "var(--text-secondary)",
            }}
          >

            <span
              style={{
                color:
                  "var(--accent)",
              }}
            >
              •
            </span>

            <span>
              {item}
            </span>

          </li>
        )
      )}

    </ul>
  );


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mt-10 space-y-6">


      {/* ======================================================
          HEADER
      ======================================================= */}

      <section
        className="rounded-2xl border p-8"
        style={{
          backgroundColor:
            "var(--bg-card)",
          borderColor:
            "var(--border-primary)",
        }}
      >

        <p
          className="text-xs font-semibold uppercase tracking-[0.14em]"
          style={{
            color:
              "var(--accent)",
          }}
        >
          Personalized Roadmap
        </p>


        <h2
          className="mt-3 text-3xl font-bold"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          {roadmap.goal}
        </h2>


        <p
          className="mt-4 max-w-3xl text-sm leading-7"
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          {roadmap.overview}
        </p>

      </section>


      {/* ======================================================
          PROGRESS
      ======================================================= */}

      <section
        className="rounded-2xl border p-6"
        style={{
          backgroundColor:
            "var(--bg-card)",
          borderColor:
            "var(--border-primary)",
        }}
      >

        <div className="flex items-center justify-between">

          <div>

            <p
              className="text-sm"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Roadmap Progress
            </p>

            <h3
              className="mt-1 text-2xl font-bold"
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              {progress}%
            </h3>

          </div>


          <div className="text-right">

            <p
              className="text-sm"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Completed
            </p>

            <p
              className="mt-1 text-sm font-semibold"
              style={{
                color:
                  "var(--accent)",
              }}
            >
              {completedCount} /{" "}
              {totalPhases} phases
            </p>

          </div>

        </div>


        {/* Progress Bar */}

        <div
          className="mt-5 h-3 overflow-hidden rounded-full"
          style={{
            backgroundColor:
              "var(--bg-hover)",
          }}
        >

          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor:
                progress === 100
                  ? "var(--success)"
                  : "var(--accent)",
            }}
          />

        </div>


        {/* Completion Message */}

        {progress === 100 && (
          <p
            className="mt-4 text-sm font-medium"
            style={{
              color:
                "var(--success)",
            }}
          >
            🎉 Roadmap completed! Keep
            building and applying those
            skills.
          </p>
        )}

      </section>


      {/* ======================================================
          SALARY
      ======================================================= */}

      <Section title="Salary Expectations">

        <div className="mt-5 grid gap-4 md:grid-cols-3">

          {[
            [
              "Entry Level",
              roadmap.salary?.entry,
            ],
            [
              "Mid Level",
              roadmap.salary?.mid,
            ],
            [
              "Senior Level",
              roadmap.salary?.senior,
            ],
          ].map(
            ([label, value], index) => (

              <div
                key={label}
                className="rounded-xl border p-5"
                style={{
                  backgroundColor:
                    "var(--bg-secondary)",
                  borderColor:
                    "var(--border-primary)",
                }}
              >

                <p
                  className="text-xs"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                >
                  {label}
                </p>


                <p
                  className="mt-2 text-lg font-semibold"
                  style={{
                    color:
                      index === 0
                        ? "var(--success)"
                        : index === 1
                        ? "var(--accent)"
                        : "var(--text-primary)",
                  }}
                >
                  {value ||
                    "Not available"}
                </p>

              </div>

            )
          )}

        </div>

      </Section>


      {/* ======================================================
          CAREER GROWTH
      ======================================================= */}

      <Section title="Career Growth">

        <List
          items={
            roadmap.career_growth
          }
        />

      </Section>


      {/* ======================================================
          SKILLS
      ======================================================= */}

      <Section title="Required Skills">

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {[
            [
              "Technical Skills",
              roadmap.skills?.technical,
            ],
            [
              "Soft Skills",
              roadmap.skills?.soft,
            ],
            [
              "Tools",
              roadmap.skills?.tools,
            ],
          ].map(
            ([title, skills], index) => (

              <div key={title}>

                <h4
                  className="text-sm font-semibold"
                  style={{
                    color:
                      index === 0
                        ? "var(--accent)"
                        : index === 1
                        ? "var(--success)"
                        : "var(--text-primary)",
                  }}
                >
                  {title}
                </h4>

                <List
                  items={skills}
                />

              </div>

            )
          )}

        </div>

      </Section>


      {/* ======================================================
          CERTIFICATIONS
      ======================================================= */}

      <Section title="Certifications">

        <List
          items={
            roadmap.certifications
          }
        />

      </Section>


      {/* ======================================================
          PROJECTS
      ======================================================= */}

      <Section title="Recommended Projects / Experience">

        <List
          items={
            roadmap.projects
          }
        />

      </Section>


      {/* ======================================================
          STEP-BY-STEP ROADMAP
      ======================================================= */}

      <Section title="Step-by-Step Roadmap">

        <div className="mt-6 space-y-4">

          {roadmap.roadmap?.map(
            (phase, index) => {

              const completed =
                completedPhases.includes(
                  index
                );


              return (
                <div
                  key={index}
                  className="rounded-xl border p-5 transition-all duration-300"
                  style={{
                    backgroundColor:
                      "var(--bg-secondary)",

                    borderColor:
                      completed
                        ? "var(--success)"
                        : "var(--border-primary)",

                    opacity:
                      completed
                        ? 0.85
                        : 1,
                  }}
                >

                  <div className="flex items-start gap-4">


                    {/* CHECKBOX */}
                    <input
                      type="checkbox"
                      checked={completed}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleToggle(index)}
                      className="mt-1 h-5 w-5 cursor-pointer accent-blue-500"
                    />


                    {/* PHASE CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <h4
                          className={`font-semibold ${
                            completed
                              ? "line-through opacity-60"
                              : ""
                          }`}
                          style={{
                            color:
                              "var(--text-primary)",
                          }}
                        >
                          {phase.phase}
                        </h4>


                        <span
                          className="w-fit rounded-full px-3 py-1 text-xs"
                          style={{
                            backgroundColor:
                              "var(--bg-hover)",
                            color:
                              "var(--accent)",
                          }}
                        >
                          {phase.duration}
                        </span>

                      </div>


                      <List
                        items={
                          phase.topics
                        }
                      />

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </Section>


      {/* ======================================================
          INTERVIEW
      ======================================================= */}

      <Section title="Interview Preparation">

        <List
          items={
            roadmap.interview_preparation
          }
        />

      </Section>


      {/* ======================================================
          RESOURCES
      ======================================================= */}

      <Section title="Learning Resources">

        <List
          items={
            roadmap.resources
          }
        />

      </Section>


      {/* ======================================================
          COMMON MISTAKES
      ======================================================= */}

      <section
        className="rounded-2xl border p-6"
        style={{
          backgroundColor:
            "var(--danger-bg)",
          borderColor:
            "var(--danger)",
        }}
      >

        <h3
          className="text-xl font-semibold"
          style={{
            color:
              "var(--danger)",
          }}
        >
          Common Mistakes
        </h3>

        <List
          items={
            roadmap.common_mistakes
          }
        />

      </section>


      {/* ======================================================
          CAREER TIPS
      ======================================================= */}

      <section
        className="rounded-2xl border p-6"
        style={{
          backgroundColor:
            "var(--success-bg)",
          borderColor:
            "var(--success)",
        }}
      >

        <h3
          className="text-xl font-semibold"
          style={{
            color:
              "var(--success)",
          }}
        >
          Career Tips
        </h3>

        <List
          items={
            roadmap.career_tips
          }
        />

      </section>

    </div>
  );
}


export default RoadmapResult;