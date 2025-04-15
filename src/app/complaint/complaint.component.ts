
import { Component, OnInit } from '@angular/core';
import { Complaint } from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { map, catchError, throwError } from 'rxjs';

@Component({
    selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule, FormsModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  complaints: Complaint[] = [];
  selectedStatus: string = '';
  statusList: string[] = ['PENDING', 'RESOLVED', 'UNDERREVIEW', 'REJECTED'];
  isLoading = false;
  selectedType: string = '';
  typeList: string[] = ['Fraud', 'Billing Issues', 'Product Issues', 'Reservation Problems'];

  constructor(
    private complaintService: ComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations', error);
        this.isLoading = false;
      }
    });
  }

  // filterComplaints(): void {
  //   this.isLoading = true;
  //   if (this.selectedStatus) {
  //     this.complaintService.filterComplaintsByStatus(this.selectedStatus).subscribe({
  //       next: (data) => {
  //         this.complaints = data;
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Erreur lors du filtrage', error);
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.loadComplaints();
  //   }
  // }
  // filterByType(): void {
  //   this.isLoading = true;
  //   if (this.selectedType) {
  //     this.complaintService.filterComplaintsByType(this.selectedType).subscribe({
  //       next: (data: Complaint[]) => this.complaints = data,
  //       error: (err: any) => console.error('Erreur de filtrage par type', err)
  //     });
  //   } else {
  //     this.loadComplaints();
  //   }
  // }

  filterComplaints(): void {
    this.isLoading = true;
    const status = this.selectedStatus;
    const type = this.selectedType;
  
    // Si aucun filtre n'est sélectionné
    if (!status && !type) {
      this.loadComplaints();
      return;
    }
  
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data.filter(complaint => {
          const statusMatch = status ? complaint.status === status : true;
          const typeMatch = type ? complaint.complaintType === type : true;
          return statusMatch && typeMatch;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du filtrage combiné', error);
        this.isLoading = false;
      }
    });
  }

  deleteComplaint(complaintId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.complaintService.deleteComplaint(complaintId).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(c => c.complaintId !== complaintId);
        },
        error: (error) => console.error('Erreur lors de la suppression', error)
      });
    }
  }

  
  downloadPdf(id: number) {
    console.log('Tentative de téléchargement du PDF pour ID:', id);
    
    this.complaintService.downloadComplaintPdf(id).subscribe({
      next: (blob) => {
        console.log('Blob reçu:', blob);
        console.log('Type du blob:', blob.type);
        
        try {
          const file = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(file);
          
          console.log('URL créée:', url);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `complaint_${id}.pdf`;
          document.body.appendChild(link); // Ajouter au DOM pour compatibilité
          link.click();
          document.body.removeChild(link); // Nettoyer
          
          window.URL.revokeObjectURL(url);
          console.log('Téléchargement lancé!');
        } catch (error) {
          console.error('Erreur lors de la création du fichier:', error);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du PDF:', error);
      }
    });
  }






}