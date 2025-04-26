export interface UserDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  userImage: string | null;
  phoneNumber: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  role: string;
}

export interface ProfileUpdateRequestDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  phoneNumber: string | null;
  address: AddressDTO;

}

export interface PasswordUpdateRequestDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  role: string;
  userImage?: string;
  trustScore?: number;
  phoneNumber?: number;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  emailVerified: boolean;
  faceImages?: string[];
  authProvider?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  role: string;
  userDetails?: UserDetails;
}
export interface AddressDTO {
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
