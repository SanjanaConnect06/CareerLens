import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export const loginUser = async (email, password) => {
  const response = await API.post("/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await API.post("/register", {
    name,
    email,
    password,
  });

  return response.data;
};