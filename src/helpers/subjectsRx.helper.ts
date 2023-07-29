import { productsSizes } from "../interfaces/productsSizes";
import { SubscribeManagerRx } from "../utils/subscribeManagerRx";

export const modalesRX = new SubscribeManagerRx<[string, boolean]>() 
export const sizesForm = new SubscribeManagerRx<[string, boolean, number, productsSizes[]?]>() 

export const updateCategoriesRX = new SubscribeManagerRx<boolean>() 
export const updatePurchasesRX = new SubscribeManagerRx<boolean>() 
export const updateProductsRX = new SubscribeManagerRx<boolean>() 
export const updatePurchasesAdminRx = new SubscribeManagerRx<boolean>() 
