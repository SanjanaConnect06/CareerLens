import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export const uploadResume = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("resume", file);

  const response = await API.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get the latest resume analysis
export const getLatestResumeScore = async () => {
  const history = await getHistory();

  if (!history || history.length === 0) {
    return null;
  }

  const latest = history[0];

  return latest.ats_score ?? latest.atsScore ?? null;
};

// ============================================================
// OPEN RESUME FROM HISTORY
// ============================================================

export const openResumeFromHistory = async (resumeId) => {
  const token = localStorage.getItem("token");

  const response = await API.get(
    `/history/${resumeId}/file`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};