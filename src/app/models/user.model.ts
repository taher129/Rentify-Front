import { Address } from './address.model';

export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE' ;
  phoneNumber: number;
  address: Address;
}
