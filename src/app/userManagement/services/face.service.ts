import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  private baseUrl = 'http://localhost:8082/api/face'; // Update for prod env if needed

  constructor(private http: HttpClient) {}

  registerFace(userId: string, images: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, {
      userId,
      base64Images: images
    });
  }

  verifyFace(userId: string, image: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify`, {
      userId,
      base64Image: image
    });
  }

  extractFaceFeatures(image: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/extract-features`, {
      image
    });
  }
}
