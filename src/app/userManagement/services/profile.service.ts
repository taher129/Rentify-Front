import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserDTO} from "../models/user";


@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = 'http://localhost:8082/user';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserDTO> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserDTO>(`${this.baseUrl}/profile`, { headers });
  }

  updateProfile(data: any, image?: File): Observable<UserDTO> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (image) formData.append('image', image);

    return this.http.put<UserDTO>(`${this.baseUrl}/profile`, formData, { headers });
  }

}
