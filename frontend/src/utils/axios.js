import axios from "axios";

// const customFetch = axios.create({
// 	 baseURL: "https://blogvana-backend.onrender.com/api",

// 	// baseURL: "https://blogvana-deploy-production.up.railway.app/api",

// });

// export default customFetch;
// just for local hist development
const customFetch = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export default customFetch;
