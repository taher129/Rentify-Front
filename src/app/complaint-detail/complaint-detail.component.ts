// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ComplaintService } from '../services/complaint.service';
// import { Complaint } from '../models/complaint';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-complaint-detail',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './complaint-detail.component.html',
//   styleUrls: ['./complaint-detail.component.css']  // Correction du styleUrl
// })
// export class ComplaintDetailComponent implements OnInit {
//   complaint: Complaint | undefined;

//   constructor(
//     private route: ActivatedRoute,
//     private complaintService: ComplaintService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const complaintId = this.route.snapshot.paramMap.get('id');
//     if (complaintId) {
//       this.loadComplaintDetails(+complaintId);  // Chargement des détails de la plainte
//     }
//   }

//   loadComplaintDetails(complaintId: number): void {
//     this.complaintService.getComplaintById(complaintId).subscribe({
//       next: (complaintDTO) => {
//         // Conversion de complaintDate en Date
//         const complaint: Complaint = {
//           ...complaintDTO,
//           complaintDate: complaintDTO.complaintDate ? new Date(complaintDTO.complaintDate) : undefined
//         };
//         this.complaint = complaint;
//       },
//       error: (err) => console.error('Error loading complaint details', err)
//     });
//   }

//   editComplaint(id: number | undefined): void {
//     if (id) {
//       this.router.navigate(['/complaint-add', id]);  // Navigation vers l'édition de la plainte
//     }
//   }

//   deleteComplaint(id: number | undefined): void {
//     if (id) {
//       this.complaintService.deleteComplaint(id).subscribe({
//         next: () => this.router.navigate(['/complaint']),  // Redirection vers la liste des plaintes
//         error: (err) => console.error('Error deleting complaint', err)
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ComplaintDetailComponent implements OnInit {
  complaint: ComplaintDTO | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.complaintService.getComplaintById(id).subscribe({
        next: (data) => {
          this.complaint = data;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Error fetching complaint: ' + error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Invalid complaint ID.';
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/complaint']);
  }
}
