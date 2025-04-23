import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResponseService } from '../services/response.service';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { ComplaintResponse } from '../models/ComplaintResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslationService } from '../services/translation.service';
import { ChatbotComplaintComponent } from '../chatbot-complaint/chatbot-complaint.component';
import { ChatbotpopupcomplaintService } from '../services/chatbotpopupcomplaint.service';

@Component({
  selector: 'app-response-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatbotComplaintComponent],
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ResponseDetailComponent implements OnInit, OnDestroy {
  responseId!: number;
  complaintId!: number;
  response?: ComplaintResponse;
  complaint?: ComplaintDTO;
  errorMessage = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private responseService: ResponseService,
    private complaintService: ComplaintService,
    private translationService: TranslationService,
    public chatbotPopupService: ChatbotpopupcomplaintService
  ) {}

  ngOnInit(): void {
    this.responseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadResponseDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTranslation(response: ComplaintResponse): void {
    response.description = this.translationService.toggleTranslation(response.description || '');
  }
  
  loadResponseDetails(): void {
    this.isLoading = true;
    this.responseService.getResponseById(this.responseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ComplaintResponse) => {
          this.response = data;
          // Use the correct property name 'id' instead of 'responseId'
          if (data.id) {
            this.responseId = data.id;
          }
          // Use complaintId from the response to load the complaint details
          this.loadComplaintDetails(data.complaintId);
        },
        error: err => {
          this.errorMessage = 'Error loading response details.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  loadComplaintDetails(complaintId: number): void {
    this.complaintService.getComplaintById(complaintId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ComplaintDTO) => {
          this.complaint = data;
          this.isLoading = false;
        },
        error: err => {
          this.errorMessage = 'Error loading complaint details.';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/complaint']);
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openChatbot(): void {
    this.chatbotPopupService.openChatbot();
  }
}