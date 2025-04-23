import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Blog, BlogFormData} from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8087/api/blogs';

  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
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

}
