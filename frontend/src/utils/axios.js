import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-git-main-pascals-projects-4016dc21.vercel.app",
});

export default customFetch;
