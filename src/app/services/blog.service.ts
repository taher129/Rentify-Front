import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Blog, BlogFormData} from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = '/api/blogs';
  private uploadsUrl = 'http://blog-service:8087/uploads';
  constructor(private http: HttpClient) { }
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a full URL (from backend), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Remove any leading slashes or uploads/ prefix that might be duplicated
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/^uploads\//, '');

    // Return the proper API path
    return `${this.uploadsUrl}/${cleanPath}`;
  }
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogById(id: number): Observable<Blog> {  // Change parameter type to number
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  getBlogsByUserId(userId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/user/${userId}`);
  }

  createBlog(formData: FormData): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, formData);
  }

  private questions: Array<Object> = [];
  private answers: Array<any> = [];

  setQuestions(questions: Array<Object>) {
    this.questions = [...questions];
  }
  getQuestions() {
    return this.questions;
  }
  setAnswers(answers: Array<any>) {
    this.answers = [...answers];
  }
  getAnswers() {
    return this.answers;
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // blog.service.ts
  updateBlog(id: number, formData: FormData): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, formData);
  }

  searchBlogs(title: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/search?title=${encodeURIComponent(title)}`);
  }

}
