import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-phi.vercel.app/",
});

export default customFetch;
