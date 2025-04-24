import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  private apiUrl = `${environment.apiUrl}/api/face`;

  constructor(private http: HttpClient) {
  }


  registerFace(userId: number, images: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      userId,
      base64Images: images
    }).pipe(
      catchError(error => {
        console.error('Face registration error:', error);
        return throwError(() => new Error('Failed to register face. Please try again.'));
      })
    );
  }

  verifyFace(userId: string, image: string): Observable<{ matched: boolean }> {
    return this.http.post<{ matched: boolean }>(`${this.apiUrl}/verify`, {
      userId,
      base64Image: image
    }).pipe(
      catchError(error => {
        console.error('Face verification error:', error);
        return throwError(() => new Error('Face verification failed. Please try again.'));
      })
    );
  }
}
