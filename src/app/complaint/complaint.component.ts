import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { map, catchError, throwError } from 'rxjs';
import { Complaint } from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';
import { ResponseService } from '../services/response.service';
import { TranslationService } from '../services/translation.service';
import { ComplaintResponse } from '../models/ComplaintResponse';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit {
  response?: ComplaintResponse;
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  selectedStatus: string = '';
  statusList: string[] = ['PENDING', 'RESOLVED', 'UNDERREVIEW', 'REJECTED'];
  isLoading = false;
  selectedType: string = '';
  typeList: string[] = ['Fraud', 'Billing Issues', 'Product Issues', 'Reservation Problems'];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
   // Search functionality
   searchTerm: string = '';
  
  // Base URL for image paths
  apiBaseUrl = 'http://localhost:8083';
  baseFileUrl = 'http://localhost:8083/files/';
  
  // Modal properties
  showModal = false;
  selectedImage: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25];
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private complaintService: ComplaintService,
    private responseService : ResponseService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  toggleTranslation(complaint: Complaint): void {
    complaint.description = this.translationService.toggleTranslation(complaint.description || '');
  }

  
  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;

         // Tri par date décroissante par défaut
      this.sortField = 'date';
      this.sortDirection = 'desc'; 
      
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading complaints', error);
        this.isLoading = false;
      }
    });
  }
// Modifier la méthode applyFilters pour inclure le tri
applyFilters(): void {
  const status = this.selectedStatus;
  const type = this.selectedType;
  const search = this.searchTerm.toLowerCase().trim();
  
  // Apply filters to the full dataset
  this.filteredComplaints = this.complaints.filter(complaint => {
    const statusMatch = status ? complaint.status === status : true;
    const typeMatch = type ? complaint.complaintType === type : true;

 // Search term matching
 let searchMatch = true;
 if (search) {
   searchMatch = 
     (complaint.description?.toLowerCase().includes(search) || false) ||
     (complaint.complaintType?.toLowerCase().includes(search) || false) ||
     (complaint.complaintId?.toString().includes(search) || false) ||
     (complaint.status?.toLowerCase().includes(search) || false);
 }


 return statusMatch && typeMatch && searchMatch;
});
  
  // Appliquer le tri si un champ de tri est défini
  if (this.sortField) {
    this.applySort();
  }
  
  // Update pagination
  this.totalItems = this.filteredComplaints.length;
  this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  
  // Reset to first page when filters change
  if (this.currentPage > this.totalPages) {
    this.currentPage = 1;
  } else if (this.totalPages === 0) {
    this.currentPage = 1;
  }
}


  filterComplaints(): void {
    this.isLoading = true;
    
    // Small delay for loading animation
    setTimeout(() => {
      this.applyFilters();
      this.isLoading = false;
    }, 300);
  }

  // Search method
  searchComplaints(): void {
    this.filterComplaints();
  }
  
  // Clear search
  clearSearch(): void {
    if (this.searchTerm) {
      this.searchTerm = '';
      this.filterComplaints();
    }
  }


  // Pagination methods
  get paginatedComplaints(): Complaint[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredComplaints.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      // Add smooth scrolling to top of table
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        // Use HTMLElement type which has offsetTop property
        const tableTop = (tableContainer as HTMLElement).offsetTop;
        window.scrollTo({ top: tableTop - 120, behavior: 'smooth' });
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value, 10);
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1; // Reset to first page
  }

  // Generate page numbers for pagination display
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < this.totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }
  


  deleteComplaint(complaintId: number): void {
    if (complaintId && confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.complaintService.deleteComplaint(complaintId).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(c => c.complaintId !== complaintId);
        },
        error: (error) => console.error('Erreur lors de la suppression', error)
      });
    }
  }



  downloadPdf(id: number): void {
    if (!id) return;
    
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
          document.body.appendChild(link); // Add to DOM for compatibility
          link.click();
          document.body.removeChild(link); // Clean up
          
          window.URL.revokeObjectURL(url);
          console.log('Download started!');
        } catch (error) {
          console.error('Error creating file:', error);
        }
      },
      error: (error) => {
        console.error('Error retrieving PDF:', error);
      }
    });
  }

  // Helper method to get status styling
  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING':
        return 'status-pending';
      case 'RESOLVED':
        return 'status-resolved';
      case 'UNDERREVIEW':
        return 'status-review';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
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

  // Get complete file URL
  getFileUrl(filePath: string): string {
    if (!filePath) return '';
    if (filePath.startsWith('http')) {
      return filePath;
    }
    return this.baseFileUrl + this.getFileName(filePath);
  }

  // Open image in large format
  openImage(filePath: string): void {
    if (!filePath) return;
    this.selectedImage = this.getFileUrl(filePath);
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }

// Nouvelle méthode pour le tri
sortComplaints(field: string): void {
  // Si on clique sur le même champ, on inverse la direction du tri
  if (this.sortField === field) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // Sinon, on définit le nouveau champ et on commence par un tri ascendant
    this.sortField = field;
    this.sortDirection = 'asc';
  }
  
  // Appliquer le tri
  this.applySort();
}

// Méthode pour appliquer le tri
applySort(): void {
  if (!this.sortField) return;
  
  this.filteredComplaints.sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    // Extraction des valeurs selon le champ de tri
    switch (this.sortField) {
      case 'date':
        valueA = new Date(a.complaintDate || '').getTime();
        valueB = new Date(b.complaintDate || '').getTime();
        break;
      // Vous pouvez ajouter d'autres cas pour trier par d'autres colonnes
      default:
        valueA = a[this.sortField as keyof Complaint];
        valueB = b[this.sortField as keyof Complaint];
    }
    
    // Comparaison selon la direction du tri
    if (this.sortDirection === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
}

 // Navigate to add complaint page
 goToAddComplaint(): void {
  this.router.navigate(['/complaint-add']);
}




// This would be a method in your component
showResponse(complaintId: number): void {
  this.responseService.getResponseByComplaintId(complaintId).subscribe(response => {
    if (response) {
      this.router.navigate(['/complaintresponse', response.id]);
    }
  });
}




}