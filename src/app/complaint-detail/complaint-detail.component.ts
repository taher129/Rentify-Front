
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ComplaintDetailComponent implements OnInit {
  complaintId!: number;
  complaint?: ComplaintDTO;
  isLoading = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.complaintId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchComplaint();
  }

  fetchComplaint(): void {
    this.isLoading = true;
    this.complaintService.getComplaintById(this.complaintId).subscribe({
      next: (data) => {
        this.complaint = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load complaint details.';
        this.isLoading = false;
      }
    });
  }


  downloadPdf(id: number): void {
      this.complaintService.downloadComplaintPdf(id);
    }
    
}
