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

export const getCareerGoal = async () => {
  const response = await API.get("/career-goal", {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const saveCareerGoal = async (goal) => {
  const response = await API.post(
    "/career-goal",
    {
      career_goal: goal,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};