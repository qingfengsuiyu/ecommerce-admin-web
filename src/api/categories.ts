import request from "../utils/request";

export const getCategories = () => {
  return request.get("/categories");
};

export const createCategory = (data: { name: string }) => {
  return request.post("/categories", data);
};

export const deleteCategory = (id: string) => {
  return request.delete(`/categories/${id}`);
};
