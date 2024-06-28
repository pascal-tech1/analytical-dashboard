import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-backend-ojkc3r02g.vercel.app/",
});

export default customFetch;
