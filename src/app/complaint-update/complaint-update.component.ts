import { Component, OnInit } from '@angular/core';  
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; 
import { ComplaintService } from '../services/complaint.service'; 
import { ComplaintDTO } from '../models/ComplaintDTO'; 
import { HttpErrorResponse } from '@angular/common/http'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { trigger, transition, style, animate } from '@angular/animations';

@Component({ 
  selector: 'app-complaint-update', 
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './complaint-update.component.html', 
  styleUrl: './complaint-update.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
}) 
export class ComplaintUpdateComponent implements OnInit {
  complaintDTO: ComplaintDTO = new ComplaintDTO(); 
  evidenceInput: string = ''; 
  isLoading = false; 
  errorMessage = ''; 
  isSubmitted = false; 
  complaintId!: number; 
  selectedFiles: File[] = []; // ✅ Déclaré pour éviter l'erreur
  isUpdated = false; // ✅ Déclaré pour éviter l'erreur

  complaintTypes: string[] = ['Fraud', 'Billing Issues', 'Product Issues', 'Reservation Problems']; 
  
  constructor( 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private complaintService: ComplaintService 
  ) {} 
  
  ngOnInit(): void { 
    this.complaintId = +this.activatedRoute.snapshot.paramMap.get('id')!; 
    this.loadComplaintData();
  } 
  
  loadComplaintData(): void {
    this.complaintService.getComplaintById(this.complaintId).subscribe({ 
      next: (data) => { 
        this.complaintDTO = data; 
        this.evidenceInput = data.evidence?.join(', ') || '';
      }, 
      error: (err: HttpErrorResponse) => { 
        this.errorMessage = err.error?.message || 'Failed to load complaint data.'; 
      } 
    }); 
  }

  // onFileSelected(event: any): void {
  //   this.selectedFiles = Array.from(event.target.files); // ✅ Assure que les fichiers sont bien récupérés
  // }
  
  update(): void { 
    this.errorMessage = ''; 
    this.isLoading = true; 
    
    if (!this.complaintDTO.complaintType || !this.complaintDTO.description) { 
      this.errorMessage = 'Please fill in all required fields.'; 
      this.isLoading = false; 
      return; 
    } 
    
    this.complaintService.updateComplaintWithFiles(this.complaintId, this.complaintDTO, this.selectedFiles).subscribe({
      next: () => {
        this.isLoading = false;
        // Set isSubmitted to true to show the success message
        this.isSubmitted = true;
        // Don't navigate away immediately to allow the user to see the success message
        // this.router.navigate(['/complaint']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Update failed.';
        this.isLoading = false;
      }
    });
  }
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    
    // Update the file info text
    const fileInput = event.target;
    const fileInfoElement = fileInput.parentElement.querySelector('.file-info');
    
    if (this.selectedFiles.length > 0) {
      fileInfoElement.textContent = `${this.selectedFiles.length} file(s) selected`;
    } else {
      fileInfoElement.textContent = 'No files selected';
    }
  }

  goToComplaintList(): void {
    this.router.navigate(['/complaint']);
  }
}
