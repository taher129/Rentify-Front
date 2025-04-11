import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Complaint } from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  complaints: Complaint[] = [];

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => this.complaints = data,
      error: (error) => console.error('Erreur lors du chargement des réclamations', error)
    });
  }

  deleteComplaint(complaintId: number): void {
    this.complaintService.deleteComplaint(complaintId).subscribe({
      next: () => {
        console.log('Réclamation supprimée avec succès');
        this.loadComplaints();
      },
      error: (error) => console.error('Erreur lors de la suppression', error)
    });
  }

  updateComplaint(complaintId: number): void {
    this.router.navigate([`/update-complaint/${complaintId}`]);
  }
}
