import { UserDto } from "./user";

export interface CustomerInterface {
  id?: number;
  addres: string;
  dni: number;
  phone: string;
  user: UserDto;
}
