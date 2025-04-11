
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ComplaintService } from '../services/complaint.service';
// import { ComplaintDTO } from '../models/ComplaintDTO';
// import { ActivatedRoute } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-complaint-add',
//   templateUrl: './complaint-add.component.html',
//   styleUrls: ['./complaint-add.component.css'],
//   imports: [CommonModule, FormsModule],
//   standalone: true,
// })
// export class ComplaintAddComponent implements OnInit {
//   complaintDTO: ComplaintDTO = new ComplaintDTO();
//   isLoading: boolean = false;
//   errorMessage: string = '';
//   isSubmitted: boolean = false;

//   constructor(
//     private route: ActivatedRoute,
//     private complaintService: ComplaintService,
//     public router: Router
//   ) {}

//   ngOnInit(): void {
//    // Get query parameters from the URL to pre-fill form values
// this.route.queryParams.subscribe(params => {
//   console.log('Query Parameters:', params);
//   this.complaintDTO.userId = params['userId'] || 0;
//   this.complaintDTO.reportedUserId = params['reportedUserId'] || 0;
//   this.complaintDTO.description = params['description'] || '';
//   this.complaintDTO.complaintType = params['complaintType'] || '';
//   this.complaintDTO.status = params['status'] || 'PENDING'; // Default status
//   this.complaintDTO.complaintDate = new Date().toISOString(); // Current date in ISO format
//   this.complaintDTO.evidence = params['evidence'] ? params['evidence'].split(',') : []; // If any evidence is passed
//   console.log('Complaint DTO:', this.complaintDTO);
// });

//   }

//   addComplaint(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.complaintService.createComplaint(this.complaintDTO).subscribe(
//       (response: any) => {
//         console.log('Complaint added successfully:', response);
//         this.isLoading = false;
//         this.isSubmitted = true;
//       },
//       (error: HttpErrorResponse) => {
//         console.error('Error adding complaint:', error);
//         this.errorMessage = 'Error: ' + error.message;
//         this.isLoading = false;
//       }
//     );



    
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaint-add',
  templateUrl: './complaint-add.component.html',
  styleUrls: ['./complaint-add.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ComplaintAddComponent implements OnInit {
  complaintDTO: ComplaintDTO = new ComplaintDTO();
  isLoading: boolean = false;
  errorMessage: string = '';
  isSubmitted: boolean = false;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.loadComplaint(this.id);
      } else {
        this.route.queryParams.subscribe(queryParams => {
          this.complaintDTO = {
            ...this.complaintDTO,
            userId: queryParams['userId'] || 0,
            reportedUserId: queryParams['reportedUserId'] || 0,
            description: queryParams['description'] || '',
            complaintType: queryParams['complaintType'] || '',
            status: queryParams['status'] || 'PENDING',
            complaintDate: new Date().toISOString(),
            evidence: queryParams['evidence'] ? queryParams['evidence'].split(',') : []  // Vérification pour evidence
          };
        });
      }
    });
  }

  loadComplaint(id: number): void {
    this.isLoading = true;
    this.complaintService.getComplaintById(id).subscribe(
      (complaint: ComplaintDTO) => {
        this.complaintDTO = complaint;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Error loading complaint: ' + error.message;
        this.isLoading = false;
      }
    );
  }

  save(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Vérification de la validité des champs avant d'envoyer
    if (!this.complaintDTO.userId || !this.complaintDTO.reportedUserId || !this.complaintDTO.description || !this.complaintDTO.complaintType) {
      this.errorMessage = 'Tous les champs obligatoires doivent être remplis!';
      this.isLoading = false;
      return;
    }

    if (this.id) {
      this.complaintService.updateComplaint(this.id, this.complaintDTO).subscribe(
        () => {
          this.isSubmitted = true;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => this.handleError(error)
      );
    } else {
      this.complaintService.createComplaint(this.complaintDTO).subscribe(
        () => {
          this.isSubmitted = true;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => this.handleError(error)
      );
    }
  }

  private handleError(error: HttpErrorResponse): void {
    console.error('Error:', error);
    this.errorMessage = error.error?.message || 'An unexpected error occurred';
    this.isLoading = false;
  }
}
