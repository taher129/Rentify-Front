// src/app/services/quiz.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8087/api/blogs'; // <--- adapt if needed

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<question[]> {
    return this.http.post<question[]>(`${this.apiUrl}/generate-quiz`, {});
  }

  submitQuiz(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-quiz`, data, { responseType: 'text' });
  }

}
