import request from "../utils/request";

export const getCardKeys = () => {
  return request.get("/cardkeys");
};

export const createCardKey = (data: any) => {
  return request.post("/cardkeys", data);
};

export const updateCardKey = (id: string) => {
  return request.patch(`/cardkeys/${id}`);
};
