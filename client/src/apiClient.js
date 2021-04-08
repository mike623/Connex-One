import axios from "axios";

const service = axios.create({
  timeout: 20000, // request timeout
});

const toData = (d) => d.data;

// eslint-disable-next-line import/no-anonymous-default-export
export default (isAuth = true) => {
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
};
