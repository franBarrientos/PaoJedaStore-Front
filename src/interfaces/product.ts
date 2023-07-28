import { CategoryInterface } from "./category";
import { productsSizes } from "./productsSizes";
import { SizeInterface } from "./size";

export interface ProductInterface {
  id: number;

  name: string;

  description: string;

  img: string;

  price: number;

  quantity?: number;

  stock?: boolean;

  productsSizes?: productsSizes[];

  category: CategoryInterface;
  size?: SizeInterface;
}
