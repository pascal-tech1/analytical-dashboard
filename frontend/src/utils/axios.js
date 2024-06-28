import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://analytical-dashboard-backend-po0ozwlho.vercel.app/",
});

export default customFetch;
