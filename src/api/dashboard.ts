import request from "../utils/request";

export const getStarts = () => {
  return request.get("/dashboard/stats");
};
