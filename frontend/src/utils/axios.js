import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-coral.vercel.app/",
});

export default customFetch;
