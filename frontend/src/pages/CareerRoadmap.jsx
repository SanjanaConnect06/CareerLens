import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RoadmapForm from "../components/roadmap/RoadmapForm";
import RoadmapResult from "../components/roadmap/RoadmapResult";

import {
  getAllRoadmaps,
  getRoadmapById,
  deleteRoadmap,
} from "../api/roadmapApi";


function CareerRoadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);

  const [completedPhases, setCompletedPhases] = useState([]);

  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [loadingSelectedRoadmap, setLoadingSelectedRoadmap] =
    useState(false);


  // ============================================================
  // LOAD ALL SAVED ROADMAPS
  // ============================================================

  const loadRoadmaps = async () => {
    try {
      const data = await getAllRoadmaps();

      console.log("ALL SAVED ROADMAPS:", data);

      const savedRoadmaps = data?.roadmaps || [];

      setRoadmaps(savedRoadmaps);

      return savedRoadmaps;
    } catch (error) {
      console.error(
        "Failed to load saved roadmaps:",
        error
      );

      return [];
    }
  };


  // ============================================================
  // LOAD ONE ROADMAP
  // ============================================================

  const loadRoadmap = async (roadmapId) => {
    try {
      setLoadingSelectedRoadmap(true);

      const data = await getRoadmapById(roadmapId);

      console.log("SELECTED ROADMAP:", data);

      if (data) {
        setRoadmap(data.roadmap || null);

        setCompletedPhases(
          data.completed_phases || []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load roadmap:",
        error
      );
    } finally {
      setLoadingSelectedRoadmap(false);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const initialize = async () => {
      try {
        const savedRoadmaps = await loadRoadmaps();

        // Automatically open latest roadmap
        if (savedRoadmaps.length > 0) {
          const latestRoadmap = savedRoadmaps[0];

          setSelectedRoadmapId(
            latestRoadmap.id
          );

          await loadRoadmap(
            latestRoadmap.id
          );
        }
      } finally {
        setLoadingRoadmaps(false);
      }
    };

    initialize();
  }, []);


  // ============================================================
  // SELECT ROADMAP
  // ============================================================

  const handleSelectRoadmap = async (roadmapId) => {
    setSelectedRoadmapId(roadmapId);

    await loadRoadmap(roadmapId);
  };


  // ============================================================
  // NEW ROADMAP GENERATED
  // ============================================================

  const handleRoadmapGenerated = async (newRoadmap) => {
    console.log(
      "NEW ROADMAP GENERATED:",
      newRoadmap
    );

    const roadmapId =
      newRoadmap?.roadmap_id ||
      newRoadmap?.id;

    setRoadmap(newRoadmap);

    setCompletedPhases([]);

    if (!roadmapId) {
      console.error(
        "Roadmap ID missing from generated roadmap."
      );

      // Still refresh the list
      await loadRoadmaps();

      return;
    }

    setSelectedRoadmapId(roadmapId);

    // Refresh saved roadmap list
    await loadRoadmaps();
  };


  // ============================================================
  // UPDATE COMPLETED PHASES
  // ============================================================

  const handleSetCompletedPhases = (phases) => {
    setCompletedPhases(phases);

    // Update the selected roadmap's progress
    // in the local roadmap list immediately
    setRoadmaps((previous) =>
      previous.map((item) =>
        item.id === selectedRoadmapId
          ? {
              ...item,
              completed_phases: phases,
            }
          : item
      )
    );
  };


  // ============================================================
  // CALCULATE PROGRESS
  // ============================================================

  const calculateProgress = (
    completed,
    roadmapData
  ) => {
    if (
      !roadmapData?.roadmap ||
      roadmapData.roadmap.length === 0
    ) {
      return 0;
    }

    return Math.round(
      (completed.length /
        roadmapData.roadmap.length) *
        100
    );
  };


  // ============================================================
  // DELETE ROADMAP
  // ============================================================

  const handleDelete = async (roadmapId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this roadmap?"
    );

    if (!confirmed) return;

    try {
      await deleteRoadmap(roadmapId);

      console.log(
        "Roadmap deleted:",
        roadmapId
      );

      // Check whether deleted roadmap
      // was currently selected
      const wasSelected =
        selectedRoadmapId === roadmapId;

      // Refresh roadmap list
      const updatedRoadmaps =
        await loadRoadmaps();

      if (wasSelected) {
        if (updatedRoadmaps.length > 0) {
          // Open newest remaining roadmap
          const nextRoadmap =
            updatedRoadmaps[0];

          setSelectedRoadmapId(
            nextRoadmap.id
          );

          await loadRoadmap(
            nextRoadmap.id
          );
        } else {
          // No roadmaps left
          setSelectedRoadmapId(null);
          setRoadmap(null);
          setCompletedPhases([]);
        }
      }

    } catch (error) {
      console.error(
        "Failed to delete roadmap:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete roadmap."
      );
    }
  };


  return (
    <DashboardLayout>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <p
          className="text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Career Intelligence
        </p>

        <h1
          className="mt-1 text-3xl font-semibold tracking-tight"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Career Roadmap
        </h1>

        <p
          className="mt-2 max-w-2xl text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Build personalized AI roadmaps for
          different career goals and track your
          progress independently.
        </p>
      </div>


      {/* =====================================================
          LOADING
      ====================================================== */}

      {loadingRoadmaps && (
        <div
          className="mt-8 rounded-2xl border p-6 text-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
        >
          Loading your saved roadmaps...
        </div>
      )}


      {!loadingRoadmaps && (
        <>

          {/* =================================================
              CREATE NEW ROADMAP
          ================================================== */}

          <RoadmapForm
            setRoadmap={
              handleRoadmapGenerated
            }
          />


          {/* =================================================
              SAVED ROADMAPS
          ================================================== */}

          {roadmaps.length > 0 && (
            <section
              className="mt-8 rounded-2xl border p-6"
              style={{
                backgroundColor:
                  "var(--bg-card)",
                borderColor:
                  "var(--border-primary)",
              }}
            >

              {/* Header */}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{
                      color:
                        "var(--text-primary)",
                    }}
                  >
                    My Saved Roadmaps
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    Choose a roadmap to continue
                    where you left off.
                  </p>
                </div>

                <span
                  className="w-fit rounded-full px-3 py-1 text-xs"
                  style={{
                    backgroundColor:
                      "var(--bg-hover)",
                    color:
                      "var(--accent)",
                  }}
                >
                  {roadmaps.length}{" "}
                  {roadmaps.length === 1
                    ? "Roadmap"
                    : "Roadmaps"}
                </span>

              </div>


              {/* =================================================
                  ROADMAP CARDS
              ================================================== */}

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {roadmaps.map(
                  (savedRoadmap) => {

                    const isSelected =
                      selectedRoadmapId ===
                      savedRoadmap.id;

                    const totalPhases =
                      isSelected
                        ? roadmap?.roadmap
                            ?.length || 0
                        : 0;

                    const completed =
                      savedRoadmap
                        .completed_phases
                        ?.length || 0;

                    const progress =
                      isSelected &&
                      totalPhases > 0
                        ? calculateProgress(
                            completedPhases,
                            roadmap
                          )
                        : 0;


                    return (
                      <div
                        key={
                          savedRoadmap.id
                        }
                        className="rounded-xl border p-5 transition"
                        style={{
                          backgroundColor:
                            "var(--bg-secondary)",

                          borderColor:
                            isSelected
                              ? "var(--accent)"
                              : "var(--border-primary)",
                        }}
                      >

                        {/* Card Header */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0 flex-1">

                            <p
                              className="text-xs uppercase tracking-wider"
                              style={{
                                color:
                                  "var(--text-muted)",
                              }}
                            >
                              Career Goal
                            </p>

                            <h3
                              className="mt-2 truncate text-lg font-semibold"
                              style={{
                                color:
                                  "var(--text-primary)",
                              }}
                            >
                              {savedRoadmap.goal}
                            </h3>

                          </div>


                          {isSelected && (
                            <span
                              className="rounded-full px-2 py-1 text-xs"
                              style={{
                                backgroundColor:
                                  "var(--bg-hover)",
                                color:
                                  "var(--accent)",
                              }}
                            >
                              Active
                            </span>
                          )}

                        </div>


                        {/* Progress */}

                        <div className="mt-5">

                          <div className="flex items-center justify-between text-xs">

                            <span
                              style={{
                                color:
                                  "var(--text-secondary)",
                              }}
                            >
                              Progress
                            </span>

                            <span
                              style={{
                                color:
                                  "var(--accent)",
                              }}
                            >
                              {isSelected
                                ? progress
                                : 0}
                              %
                            </span>

                          </div>


                          <div
                            className="mt-2 h-2 overflow-hidden rounded-full"
                            style={{
                              backgroundColor:
                                "var(--bg-hover)",
                            }}
                          >

                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${
                                  isSelected
                                    ? progress
                                    : 0
                                }%`,
                                backgroundColor:
                                  "var(--accent)",
                              }}
                            />

                          </div>

                        </div>


                        {/* Created Date */}

                        <p
                          className="mt-4 text-xs"
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          Created{" "}
                          {savedRoadmap.created_at
                            ? new Date(
                                savedRoadmap.created_at
                              ).toLocaleDateString()
                            : "Recently"}
                        </p>


                        {/* ACTIONS */}

                        <div className="mt-5 flex gap-2">

                          {/* Open */}

                          <button
                            type="button"
                            onClick={() =>
                              handleSelectRoadmap(
                                savedRoadmap.id
                              )
                            }
                            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition"
                            style={{
                              backgroundColor:
                                "var(--bg-hover)",
                              color:
                                "var(--accent)",
                            }}
                          >
                            {isSelected
                              ? "Opened"
                              : "Open Roadmap"}
                          </button>


                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                savedRoadmap.id
                              )
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium transition"
                            style={{
                              backgroundColor:
                                "var(--danger-bg)",
                              color:
                                "var(--danger)",
                              border:
                                "1px solid var(--danger)",
                            }}
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>
          )}


          {/* =================================================
              SELECTED ROADMAP
          ================================================== */}

          {loadingSelectedRoadmap && (
            <div
              className="mt-8 rounded-2xl border p-6 text-sm"
              style={{
                backgroundColor:
                  "var(--bg-card)",
                borderColor:
                  "var(--border-primary)",
                color:
                  "var(--text-secondary)",
              }}
            >
              Loading selected roadmap...
            </div>
          )}


          {!loadingSelectedRoadmap &&
            roadmap && (
              <RoadmapResult
                roadmap={roadmap}
                roadmapId={
                  selectedRoadmapId
                }
                completedPhases={
                  completedPhases
                }
                onSetCompletedPhases={
                  handleSetCompletedPhases
                }
              />
            )}

        </>
      )}

    </DashboardLayout>
  );
}


export default CareerRoadmap;