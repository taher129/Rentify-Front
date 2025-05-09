import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Assume you have an AuthService for authentication
import { UserService } from '../services/user.service'; // A service for interacting with the backend
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {NgIf, NgOptimizedImage} from "@angular/common";
// Optional: For displaying notifications
import { Gender } from '../models/gender.enum';
import { Role } from '../models/role.enum';
import {environment} from "../../../environment";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ProfileService} from "../services/profile.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgIf,
    NgOptimizedImage,
    MatProgressSpinner
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedImage!: File ;
  profileData: any;
  fullName: string = '';
  showOverlayForm: boolean = false;
  imagePreview: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      })
    });
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.profileData = profile;
        this.fullName = `${profile.firstName} ${profile.lastName}`;
        console.log('Profile data loaded:', profile);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        // Show error notification
      }
    });
  }

  toggleForm(): void {
    this.showOverlayForm = !this.showOverlayForm;

    // Reset image preview when closing the form
    if (!this.showOverlayForm) {
      this.imagePreview = null;
      // this.selectedImage = null;
    }
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.toggleForm();
    }
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  getInitials(): string {
    if (!this.profileData) return '';

    // Fallback to form values if profileData is incomplete
    const firstName = this.profileData.firstName || this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileData.lastName || this.profileForm.get('lastName')?.value || '';

    // Handle empty names
    if (!firstName && !lastName) return '?';

    // Get initials (first letter of each name)
    return (
      (firstName ? firstName.charAt(0) : '') +
      (lastName ? lastName.charAt(0) : '')
    ).toUpperCase();
  }

  getJoinDate(): string {
    // This is a placeholder - you would typically get this from your profile data
    return 'May 2023';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const profileData = this.profileForm.value;

    this.profileService.updateProfile(profileData, this.selectedImage).subscribe({
      next: (response) => {
        // Success notification
        this.toggleForm();
        this.loadUserProfile();
        console.log('Profile updated successfully', response);
      },
      error: (error) => {
        // Error notification
        console.error('Error updating profile:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resolveAvatarPath(userImage: string): string {
    if (!userImage) return '';

    // Remove any leading/trailing slashes
    const cleanPath = userImage.replace(/^\/|\/$/g, '');

    // Handle different possible path formats
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('avatar/')) {
      return `${environment.apiUrl}/${cleanPath}`;
    }

    // Handle full paths that might come from different versions
    if (cleanPath.includes('avatars/') || cleanPath.includes('avatar/')) {
      return `${environment.apiUrl}/${cleanPath.startsWith('images/') ? '' : 'images/'}${cleanPath}`;
    }

    // Default case - assume it's a direct path
    return `${environment.apiUrl}/images/avatars/${cleanPath}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('Failed to load avatar:', imgElement.src);
    imgElement.style.display = 'none';
    this.profileData.userImage = null; // Fallback to initials
  }

  getAvatarUrl(userImage: string): string {
    if (!userImage) return '';

    // Case 1: Already complete URL
    if (userImage.startsWith('http://') || userImage.startsWith('https://')) {
      return userImage;
    }

    // Case 2: Starts with /images/ (common case)
    if (userImage.startsWith('/images/')) {
      return 'http://localhost:8082' + userImage;
    }

    // Case 3: Starts with images/ (no leading slash)
    if (userImage.startsWith('images/')) {
      return 'http://localhost:8082/' + userImage;
    }

    // Case 4: Just a filename (UUID.png)
    if (userImage.match(/^[a-f0-9-]+\.(png|jpg|jpeg)$/i)) {
      return 'http://localhost:8082/images/' + userImage;
    }

    // Case 5: avatars/female/ or avatars/male/ paths
    if (userImage.includes('avatars/')) {
      return 'http://localhost:8082/images/' +
        (userImage.startsWith('/') ? userImage.substring(1) : userImage);
    }

    // Default case
    return 'http://localhost:8082/images/' + userImage;
  }


}
