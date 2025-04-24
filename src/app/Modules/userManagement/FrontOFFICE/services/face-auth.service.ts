import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FaceAuthService {
  private baseUrl = 'http://localhost:8082/api/face'; // Update for prod env if needed

  constructor(private http: HttpClient) {}

  registerFace(userId: number, base64Images: string[]) {
    return this.http.post(`${this.baseUrl}/register`, {
      userId,
      base64Images
    });
  }

  loginWithFace(userId: number, base64Image: string) {
    return this.http.post(`${this.baseUrl}/login`, {
      userId,
      base64Image
    });
  }
}
