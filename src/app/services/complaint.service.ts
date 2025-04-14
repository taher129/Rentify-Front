// src/app/services/complaint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { saveAs } from 'file-saver';


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

  downloadComplaintPdf(id: number): void {
    const url = `${this.apiUrl}/complaints/pdf/${id}`;
    this.http.get(url, { responseType: 'blob', observe: 'response' }).subscribe(response => {
      const blob = response.body!;
      const file = new Blob([blob], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      
      // Ouvre le PDF dans un nouvel onglet
      window.open(fileURL, '_blank');
  
      // Crée un lien pour le téléchargement et clique sur le lien (pour déclencher le téléchargement)
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `complaint_${id}.pdf`; // Nom du fichier téléchargé
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Libère l'URL de l'objet
      window.URL.revokeObjectURL(fileURL);
    });
  }

  // downloadComplaintPdf(id: number): void {
  //   const url = `${this.apiUrl}/pdf/${id}`;
  //   this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
  //     saveAs(blob, `complaint_${id}.pdf`);
  //   }, error => {
  //     console.error('Erreur lors du téléchargement du PDF', error);
  //   });
  // }
}
