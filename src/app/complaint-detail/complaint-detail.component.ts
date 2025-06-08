import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintDTO } from '../models/ComplaintDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';

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
  selectedImage: string | null = null;
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private router: Router
  ) {}

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

  goToComplaintList(): void {
    this.router.navigate(['/complaint']);
  }

  // Check if a file is an image
  isImageFile(filePath: string): boolean {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerCasePath = filePath.toLowerCase();
    return imageExtensions.some(ext => lowerCasePath.endsWith(ext));
  }

  // Get filename from path
  getFileName(filePath: string): string {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }

  // Get complete file URL - Updated to work with nginx configuration
  getFileUrl(filePath: string): string {
    if (!filePath) return '';

    // If it's already a complete URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    // Clean and normalize the path
    let cleanPath = filePath;

    // Remove any existing base URLs
    cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');

    // Ensure the path starts with /uploads/
    if (!cleanPath.startsWith('/uploads/')) {
      if (cleanPath.startsWith('/uploads')) {
        // Path starts with /uploads but not /uploads/
        cleanPath = cleanPath;
      } else if (cleanPath.startsWith('uploads/')) {
        // Path starts with uploads/ (no leading slash)
        cleanPath = '/' + cleanPath;
      } else {
        // Just a filename or relative path
        cleanPath = '/uploads/' + cleanPath.replace(/^\/+/, '');
      }
    }

    return cleanPath;
  }

  // Open image in modal
  openImage(filePath: string): void {
    this.selectedImage = this.getFileUrl(filePath);
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }

  // Download file directly (for non-image files)
  downloadFile(filePath: string): void {
    const fileUrl = this.getFileUrl(filePath);
    const fileName = this.getFileName(filePath);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Check if file is downloadable (non-image)
  isDownloadableFile(filePath: string): boolean {
    if (!filePath) return false;
    const downloadableExtensions = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];
    const lowerCasePath = filePath.toLowerCase();
    return downloadableExtensions.some(ext => lowerCasePath.endsWith(ext));
  }

  // Get file type for display
  getFileType(filePath: string): string {
    if (!filePath) return '';
    const extension = filePath.toLowerCase().split('.').pop();

    switch (extension) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'txt': return 'Text File';
      case 'zip': return 'ZIP Archive';
      case 'rar': return 'RAR Archive';
      case 'jpg':
      case 'jpeg': return 'JPEG Image';
      case 'png': return 'PNG Image';
      case 'gif': return 'GIF Image';
      case 'svg': return 'SVG Image';
      default: return 'File';
    }
  }

  downloadPdf(id: number): void {
    console.log('Attempting to download PDF for ID:', id);

    this.complaintService.downloadComplaintPdf(id).subscribe({
      next: (blob) => {
        console.log('Blob received:', blob);
        console.log('Blob type:', blob.type);

        try {
          const file = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(file);

          console.log('URL created:', url);

          const link = document.createElement('a');
          link.href = url;
          link.download = `complaint_${id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
          console.log('Download initiated!');
        } catch (error) {
          console.error('Error creating file:', error);
        }
      },
      error: (error) => {
        console.error('Error fetching PDF:', error);
      }
    });
  }
}
