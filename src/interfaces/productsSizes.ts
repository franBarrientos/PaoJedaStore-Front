import { ProductInterface } from "./product";
import { SizeInterface } from "./size";

export interface productsSizes {
    id?:number,
    quantity?:number,
    size?:SizeInterface,
    product?:ProductInterface
}