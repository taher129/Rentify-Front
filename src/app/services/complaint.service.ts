import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { saveAs } from 'file-saver';
import { map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = '/complaints';

  constructor(private http: HttpClient) {}

  createComplaint(complaintDTO: ComplaintDTO): Observable<ComplaintDTO> {
    // Fixed: Use relative path through nginx proxy
    return this.http.post<ComplaintDTO>(`${this.apiUrl}/create`, complaintDTO);
  }

  // Nouvelle méthode pour l'upload de fichiers
  createComplaintWithFiles(complaint: ComplaintDTO, files: File[]): Observable<ComplaintDTO> {
    const formData = new FormData();

    // Ajout des données JSON de la plainte
    formData.append('complaintDTO', new Blob([JSON.stringify(complaint)], {
      type: 'application/json'
    }));

    // Ajout des fichiers
    if (files && files.length > 0) {
      for (const file of files) {
        formData.append('evidence', file);
      }
    }

    // Fixed: Use relative path through nginx proxy
    return this.http.post<ComplaintDTO>(`${this.apiUrl}/create`, formData);
  }

  updateComplaintWithFiles(id: number, complaint: ComplaintDTO, files: File[]): Observable<ComplaintDTO> {
    const formData = new FormData();

    // Ajout du corps de la plainte en JSON
    formData.append('complaintDTO', new Blob([JSON.stringify(complaint)], {
      type: 'application/json'
    }));

    // Ajout des fichiers si présents
    if (files && files.length > 0) {
      for (const file of files) {
        formData.append('evidence', file);
      }
    }

    // Fixed: Use relative path through nginx proxy
    return this.http.put<ComplaintDTO>(`${this.apiUrl}/update/${id}`, formData);
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/list`);
  }

  filterComplaintsByStatus(status: string): Observable<Complaint[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Complaint[]>(`${this.apiUrl}/filtercomplaint`, { params })
      .pipe(
        catchError(error => {
          console.error('Error filtering complaints:', error);
          return throwError(() => new Error('Failed to filter complaints'));
        })
      );
  }

  filterComplaintsByType(type: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/filterByType?type=${type}`);
  }

  getComplaintById(id: number): Observable<ComplaintDTO> {
    return this.http.get<ComplaintDTO>(`${this.apiUrl}/details/${id}`);
  }

  updateComplaint(id: number, complaintDTO: ComplaintDTO): Observable<ComplaintDTO> {
    return this.http.put<ComplaintDTO>(`${this.apiUrl}/update/${id}`, complaintDTO);
  }

  downloadComplaintPdf(id: number): Observable<Blob> {
    console.log(`Appel API: ${this.apiUrl}/pdf/${id}`);
    return this.http.get(`${this.apiUrl}/pdf/${id}`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map(response => {
        console.log('Headers reçus:', response.headers);
        return response.body as Blob;
      }),
      catchError(error => {
        console.error('Erreur HTTP:', error);
        return throwError(() => error);
      })
    );
  }

  deleteComplaint(complaintId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${complaintId}`);
  }
}
