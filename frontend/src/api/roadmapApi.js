import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};


// ============================================================
// GENERATE + SAVE ROADMAP
// ============================================================

export const generateRoadmap = async (
  goal,
  level,
  industry
) => {
  const response = await API.post(
    "/roadmap",
    {
      goal,
      level,
      industry,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// GET ALL SAVED ROADMAPS
// ============================================================

export const getAllRoadmaps = async () => {
  const response = await API.get(
    "/roadmaps",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// GET ONE ROADMAP BY ID
// ============================================================

export const getRoadmapById = async (roadmapId) => {
  if (!roadmapId) {
    throw new Error("Roadmap ID is required.");
  }

  const response = await API.get(
    `/roadmap/${roadmapId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// GET CURRENT / LATEST ROADMAP
// ============================================================

export const getCurrentRoadmap = async () => {
  const response = await API.get(
    "/roadmap/current",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// GET ROADMAP PROGRESS
// ============================================================

export const getRoadmapProgress = async (
  roadmapId = null
) => {
  const headers = getAuthHeaders();

  let response;

  if (roadmapId) {
    response = await API.get(
      `/roadmap/progress?roadmap_id=${roadmapId}`,
      {
        headers,
      }
    );
  } else {
    response = await API.get(
      "/roadmap/progress",
      {
        headers,
      }
    );
  }

  return response.data;
};


// ============================================================
// SAVE ROADMAP PROGRESS
// ============================================================

export const updateRoadmapProgress = async (
  roadmapId,
  completedPhases
) => {
  if (!roadmapId) {
    throw new Error("Roadmap ID is required.");
  }

  const response = await API.post(
    `/roadmap/${roadmapId}/progress`,
    {
      completed_phases: completedPhases,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


// ============================================================
// DELETE ROADMAP
// ============================================================

export const deleteRoadmap = async (
  roadmapId
) => {
  if (!roadmapId) {
    throw new Error("Roadmap ID is required.");
  }

  const response = await API.delete(
    `/roadmap/${roadmapId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};