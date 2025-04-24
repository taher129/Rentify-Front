import { Injectable } from '@angular/core';
import {environment} from "../../../../../environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userImage: string;
  phoneNumber: number;
  address: {
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  trustScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl, {
      headers: this.getAuthHeader()
    });
  }

  updateProfile(profileData: any): Observable<Profile> {
    return this.http.put<Profile>(this.apiUrl, profileData, {
      headers: this.getAuthHeader()
    });
  }

  updateProfileImage(image: File): Observable<Profile> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put<Profile>(`${this.apiUrl}/image`, formData, {
      headers: this.getAuthHeader()
    });
  }

  private getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
