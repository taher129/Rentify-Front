// stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8087/api/stats';

  constructor(private http: HttpClient) { }

  getQuestionStats(questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${questionId}`);
  }

  submitResponse(questionId: number, chosenOption: number): Observable<any> {
    return this.http.post(this.apiUrl, null, {
      params: {
        questionId: questionId.toString(),
        chosenOption: chosenOption.toString()
      }
    });
  }
}
