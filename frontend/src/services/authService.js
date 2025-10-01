import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
};

// --- YEH NAYA FUNCTION ADD KAREIN ---
const register = (name, email, password) => {
  const role = "CITIZEN"; // Hardcoding the role for now
  return axios.post(API_URL + 'register', {
    name,
    email,
    password,
    role,
  });
};
// --- END ---

const authService = {
  login,
  register, // Export the new function
};

export default authService;