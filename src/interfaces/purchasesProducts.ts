import { ProductInterface } from "./product";
import { PurchaseInterface } from "./purchase";
import { SizeInterface } from "./size";

export interface PurchasesProductsInterface {
  id?: number;
  quantity: number;
  purchase: PurchaseInterface | number;
  product: ProductInterface | number;
  size?: SizeInterface | number;
}
