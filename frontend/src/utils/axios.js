import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-backend-ashy.vercel.app/",
});

export default customFetch;
