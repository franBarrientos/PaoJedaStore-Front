import { AxiosResponse } from "axios";
import apiClient from "../config/axiosClient";
import { PurchasesProductsInterface } from "../interfaces/purchasesProducts";

const prefix = "/purchasesProducts";

export const createPurchasesProducts = (
  purchaseP: PurchasesProductsInterface
): Promise<AxiosResponse<any, any>> => {
  return apiClient.post(prefix, purchaseP, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
