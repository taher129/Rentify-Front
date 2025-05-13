import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-image-to-text',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './image-to-text.component.html',
  styleUrls: ['./image-to-text.component.scss']
})
export class ImageToTextComponent {
  imageUrl: string = '';
  extractedText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isSuccess: boolean = false;

  constructor(private http: HttpClient) {}

  extractTextFromImage(): void {
    if (!this.imageUrl.trim()) {
      this.errorMessage = 'Veuillez entrer une URL d\'image valide.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.extractedText = '';
    this.isSuccess = false;

    const payload = { imageUrl: this.imageUrl };

    this.http.post('http://www.rentify.duckdns.org:8083/ImageToTextComplaints/from-url', payload, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.extractedText = response;
          this.isSuccess = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `Erreur : ${error.error || error.message || 'Une erreur est survenue.'}`;
          this.isLoading = false;
          this.isSuccess = false;
        }
      });
  }

  clearAll(): void {
    this.imageUrl = '';
    this.extractedText = '';
    this.errorMessage = '';
    this.isSuccess = false;
    this.isLoading = false;
  }
}
