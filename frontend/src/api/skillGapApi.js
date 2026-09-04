import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export const analyzeSkillGap = async (goal, skills) => {
  const token = localStorage.getItem("token");

  const response = await API.post(
    "/skill-gap",
    {
      goal,
      skills,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getLatestSkillMatch = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/skill-gap/latest", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};