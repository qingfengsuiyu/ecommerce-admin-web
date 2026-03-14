import request from "../utils/request";

export const getUsers = async () => {
  return request.get("/users");
};

export const updateUserRole = async (id: string, role: string) => {
  return request.put(`/users/${id}/role`, { role });
};
