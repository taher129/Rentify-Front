
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterModule,Router } from '@angular/router';
// import { ComplaintService } from '../services/complaint.service';
// import { ComplaintDTO } from '../models/ComplaintDTO';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { saveAs } from 'file-saver';


// @Component({
//   selector: 'app-complaint-detail',
//   templateUrl: './complaint-detail.component.html',
//   styleUrls: ['./complaint-detail.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule]
// })
// export class ComplaintDetailComponent implements OnInit {
//   complaintId!: number;
//   complaint?: ComplaintDTO;
//   isLoading = false;
//   errorMessage = '';

//   constructor(private route: ActivatedRoute, private complaintService: ComplaintService, private router: Router) {}

//   ngOnInit(): void {
//     this.complaintId = Number(this.route.snapshot.paramMap.get('id'));
//     this.fetchComplaint();
//   }

//   fetchComplaint(): void {
//     this.isLoading = true;
//     this.complaintService.getComplaintById(this.complaintId).subscribe({
//       next: (data) => {
//         this.complaint = data;
//         this.isLoading = false;
//       },
//       error: () => {
//         this.errorMessage = 'Failed to load complaint details.';
//         this.isLoading = false;
//       }
//     });
//   }
//   goToComplaintList(): void {
//     this.router.navigate(['/complaint']);
//   }

//   downloadPdf(id: number) {
//     console.log('Tentative de téléchargement du PDF pour ID:', id);
    
//     this.complaintService.downloadComplaintPdf(id).subscribe({
//       next: (blob) => {
//         console.log('Blob reçu:', blob);
//         console.log('Type du blob:', blob.type);
        
//         try {
//           const file = new Blob([blob], { type: 'application/pdf' });
//           const url = window.URL.createObjectURL(file);
          
//           console.log('URL créée:', url);
          
//           const link = document.createElement('a');
//           link.href = url;
//           link.download = `complaint_${id}.pdf`;
//           document.body.appendChild(link); // Ajouter au DOM pour compatibilité
//           link.click();
//           document.body.removeChild(link); // Nettoyer
          
//           window.URL.revokeObjectURL(url);
//           console.log('Téléchargement lancé!');
//         } catch (error) {
//           console.error('Erreur lors de la création du fichier:', error);
//         }
//       },
//       error: (error) => {
//         console.error('Erreur lors de la récupération du PDF:', error);
//       }
//     });
//   }

//   // downloadPdf(id: number): void {
//   //     this.complaintService.downloadComplaintPdf(id);
//   //   }
    

  
//   // openChatbot() {
//   //   const dfMessenger = document.querySelector('df-messenger') as any;
//   //   if (dfMessenger) {
//   //     // Ouvre la fenêtre du chatbot
//   //     dfMessenger.openChat();
//   //   }
//   // }
  


// }


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
  baseFileUrl: string = 'http://localhost:8083/files/'; // URL de base pour les fichiers
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

  // Vérifier si un fichier est une image
  isImageFile(filePath: string): boolean {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerCasePath = filePath.toLowerCase();
    return imageExtensions.some(ext => lowerCasePath.endsWith(ext));
  }

  // Obtenir le nom du fichier à partir du chemin
  getFileName(filePath: string): string {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }

  // Obtenir l'URL complète d'un fichier
  getFileUrl(filePath: string): string {
    if (filePath.startsWith('http')) {
      return filePath;
    }
    return this.baseFileUrl + this.getFileName(filePath);
  }

  // Ouvrir l'image en grand format
  openImage(filePath: string): void {
    this.selectedImage = this.getFileUrl(filePath);
    this.showModal = true;
  }

  // Fermer la modale
  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
  }

  downloadPdf(id: number) {
    console.log('Tentative de téléchargement du PDF pour ID:', id);
    
    this.complaintService.downloadComplaintPdf(id).subscribe({
      next: (blob) => {
        console.log('Blob reçu:', blob);
        console.log('Type du blob:', blob.type);
        
        try {
          const file = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(file);
          
          console.log('URL créée:', url);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `complaint_${id}.pdf`;
          document.body.appendChild(link); // Ajouter au DOM pour compatibilité
          link.click();
          document.body.removeChild(link); // Nettoyer
          
          window.URL.revokeObjectURL(url);
          console.log('Téléchargement lancé!');
        } catch (error) {
          console.error('Erreur lors de la création du fichier:', error);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du PDF:', error);
      }
    });
  }
}