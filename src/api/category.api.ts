import { AxiosResponse } from "axios";
import apiClient from "../config/axiosClient";

const prefix = "/category";

export const getAllCategories = (isAdmin = false): Promise<AxiosResponse<any, any>> => {
  if(isAdmin){
    return apiClient.get("/category?isAdmin=true")
  }else{
    return apiClient.get(prefix);
  }
};

export const createNewCategory = (
  formData: FormData
): Promise<AxiosResponse<any, any>> => {
  return apiClient.post(prefix, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const updateCategory = (
  formData: FormData,
  id:number
): Promise<AxiosResponse<any, any>> => {
  return apiClient.put(`/category/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
