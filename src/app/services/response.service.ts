import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComplaintResponse } from '../models/ComplaintResponse';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private apiUrl = '/responses';

  constructor(private http: HttpClient) { }

  getAllResponses(): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(this.apiUrl);
  }

  getResponseById(id: number): Observable<ComplaintResponse> {
    return this.http.get<ComplaintResponse>(`${this.apiUrl}/${id}`);
  }

  getResponseByComplaintId(complaintId: number): Observable<ComplaintResponse> {
    return this.http.get<ComplaintResponse>(`${this.apiUrl}/complaint/${complaintId}`);
  }
}
