import axios from "axios";

const service = axios.create({
  timeout: 20000, // request timeout
});

const toData = (d) => d.data;

function ApiClient(isAuth = true) {
  service.interceptors.request.use(
    (config) => {
      if (isAuth) config.headers["Authorization"] = "Bearer mysecrettoken";
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  return {
    getTime: () => {
      return service.get("/time").then(toData);
    },
    getMetrics: () => {
      return service.get("/metrics").then(toData);
    },
  };
}

export default ApiClient(!window.location.search.includes("auth=false"));
