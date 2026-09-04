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

export const startInterview = async (role, level) => {
  const response = await API.post(
    "/interview/start",
    {
      role,
      level,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const submitInterviewAnswer = async (
  sessionId,
  answer
) => {
  const response = await API.post(
    "/interview/answer",
    {
      session_id: sessionId,
      answer,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getInterviewCount = async () => {
  const response = await API.get("/interview/count", {
    headers: getAuthHeaders(),
  });

  return response.data;
};