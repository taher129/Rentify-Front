import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaint-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './complaint-update.component.html',
  styleUrl: './complaint-update.component.css'
  
})
export class ComplaintUpdateComponent implements OnInit {
complaintDTO: ComplaintDTO = new ComplaintDTO();
  evidenceInput: string = '';
  isLoading = false;
  errorMessage = '';
  isSubmitted = false;
  complaintId !: number;

  complaintTypes: string[] = ['HARASSMENT', 'SPAM', 'ABUSE', 'OTHER'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.complaintId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.complaintService.getComplaintById(this.complaintId).subscribe({
      next: (data) => {
        this.complaintDTO = data;
        this.evidenceInput = data.evidence.join(', ');
      },
      error: (err) => {
        this.errorMessage = 'Failed to load complaint data.';
      }
    });
  }

  update(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.complaintDTO.complaintType || !this.complaintDTO.description) {
      this.errorMessage = 'Please fill in all required fields.';
      this.isLoading = false;
      return;
    }

    this.complaintDTO.evidence = this.evidenceInput
      ? this.evidenceInput.split(',').map((e) => e.trim()).filter((e) => e !== '')
      : [];

    this.complaintService.updateComplaint(this.complaintId, this.complaintDTO).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Update failed.';
        this.isLoading = false;
      }
    });
  }

  goToComplaintList(): void {
    this.router.navigate(['/complaint']);
  }
}