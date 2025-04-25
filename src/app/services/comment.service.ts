import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, map } from 'rxjs';
import { BlogComment } from '../models/BlogComment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8087/api/comments'; // Adjust to your real API URL

  constructor(private http: HttpClient) {}

  getCommentsByBlogId(blogId: number): Observable<BlogComment[]> {
    if (!blogId) {
      console.error('Invalid blogId');
      return of([]);  // Return empty if blogId is invalid
    }
    return this.http.get<BlogComment[]>(`${this.apiUrl}/blog/${blogId}`);
  }
}
