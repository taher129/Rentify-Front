// src/app/services/complaint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { ComplaintDTO } from '../models/ComplaintDTO';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8083/complaints';

  constructor(private http: HttpClient) {}

  createComplaint(complaintDTO: ComplaintDTO): Observable<ComplaintDTO> {
    return this.http.post<ComplaintDTO>('http://localhost:8083/complaints/create', complaintDTO);
  }
  
  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/list`);
  }

  // getComplaintById(complaintId: number): Observable<Complaint> {
  //   return this.http.get<Complaint>(`${this.apiUrl}/details/${complaintId}`);
  // }

  // updateComplaint(complaintId: number, complaint: Complaint): Observable<Complaint> {
  //   return this.http.put<Complaint>(`${this.apiUrl}/update/${complaintId}`, complaint);
  // }

  getComplaintById(id: number): Observable<ComplaintDTO> {
    return this.http.get<ComplaintDTO>(`${this.apiUrl}/details/${id}`);
  }

  updateComplaint(id: number, complaintDTO: ComplaintDTO): Observable<ComplaintDTO> {
    return this.http.put<ComplaintDTO>(`${this.apiUrl}/update/${id}`, complaintDTO);
  }


  deleteComplaint(complaintId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${complaintId}`);
  }
}
