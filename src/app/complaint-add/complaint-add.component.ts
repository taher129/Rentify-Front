import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { HttpErrorResponse, HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatbotpopupcomplaintService } from '../services/chatbotpopupcomplaint.service';
import { ChatbotComplaintComponent } from '../chatbot-complaint/chatbot-complaint.component';

@Component({
  selector: 'app-complaint-add',
  templateUrl: './complaint-add.component.html',
  styleUrls: ['./complaint-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule,ChatbotComplaintComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ComplaintAddComponent implements OnInit {
  complaintDTO: ComplaintDTO = new ComplaintDTO();
  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage = '';
  isSubmitted = false;

  // Image to text properties
  showImageToText = false;
  imageUrl: string = '';
  isImageProcessing = false;
  imageProcessingError = '';

  complaintTypes: string[] =['Fraud', 'Billing Issues', 'Product Issues', 'Reservation Problems'];

  constructor(
    public router: Router,
    private complaintService: ComplaintService,
    private http: HttpClient,
    public chatbotPopupService: ChatbotpopupcomplaintService

  ) {}

  ngOnInit(): void {
    this.complaintDTO.userId = 77;
    this.complaintDTO.reportedUserId = 77;
    this.complaintDTO.status = 'PENDING';
    this.complaintDTO.complaintDate = new Date().toISOString();
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    // Show file names for better UX
    const fileInput = document.getElementById('evidence') as HTMLInputElement;
    if (fileInput && this.selectedFiles.length > 0) {
      const fileNames = Array.from(this.selectedFiles).map(file => file.name).join(', ');
      const fileInfoEl = document.querySelector('.file-info');
      if (fileInfoEl) {
        fileInfoEl.textContent = fileNames;
      }
    }
  }

  toggleImageToText(): void {
    this.showImageToText = !this.showImageToText;
    if (!this.showImageToText) {
      this.resetImageToText();
    }
  }

  resetImageToText(): void {
    this.imageUrl = '';
    this.imageProcessingError = '';
    this.isImageProcessing = false;
  }

  extractTextFromImage(): void {
    if (!this.imageUrl.trim()) {
      this.imageProcessingError = 'Please enter a valid image URL';
      return;
    }

    this.isImageProcessing = true;
    this.imageProcessingError = '';

    const payload = { imageUrl: this.imageUrl };

    // Updated URL to go through Nginx proxy - uses relative path
    this.http.post('/api/complaints/ImageToTextComplaints/from-url', payload, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.complaintDTO.description = response;
          this.isImageProcessing = false;
          this.showImageToText = false; // Hide the image extraction section after success
          // Show success notification
          this.showNotification('Text extracted successfully!', 'success');
        },
        error: (error) => {
          this.imageProcessingError = `Error: ${error.error || error.message || 'An error occurred'}`;
          this.isImageProcessing = false;
          // Show error notification
          this.showNotification('Failed to extract text', 'error');
        }
      });
  }

  save(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.complaintDTO.complaintType || !this.complaintDTO.description) {
      this.errorMessage = 'Please fill in all required fields.';
      this.isLoading = false;
      // Scroll to error message
      setTimeout(() => {
        const errorEl = document.querySelector('.error-message');
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    this.complaintService.createComplaintWithFiles(this.complaintDTO, this.selectedFiles).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Submission failed. Please try again later.';
        this.isLoading = false;
        // Show error notification
        this.showNotification('Submission failed', 'error');
      }
    });
  }

  goToComplaintList(): void {
    this.router.navigate(['/complaint']);
  }

  // Helper method to show notifications
  private notificationTimeout: any;
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Clear any existing notification
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    // Create notification element if it doesn't exist
    let notificationEl = document.querySelector('.notification');
    if (!notificationEl) {
      notificationEl = document.createElement('div');
      notificationEl.className = 'notification';
      document.body.appendChild(notificationEl);
    }

    // Set notification content and style
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type}`;
    (notificationEl as HTMLElement).style.display = 'block';

    // Show the notification with animation
    setTimeout(() => {
      notificationEl?.classList.add('show');
    }, 10);

    // Hide the notification after 3 seconds
    this.notificationTimeout = setTimeout(() => {
      notificationEl?.classList.remove('show');
      setTimeout(() => {
        (notificationEl as HTMLElement).style.display = 'none';
      }, 300);
    }, 3000);
  }

  openChatbot(): void {
    this.chatbotPopupService.openChatbot();
  }
}
