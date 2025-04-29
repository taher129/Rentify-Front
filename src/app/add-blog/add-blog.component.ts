import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BlogService} from "../services/blog.service";
import { Router } from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent {
  blogForm: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      description: ['', [Validators.maxLength(255)]],
      content: ['', [
        Validators.required,
        Validators.minLength(20)
      ]]
    });
  }

  // Easy access to form controls
  get formControls() {
    return this.blogForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.previewImage = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.value = '';
  }

  onSubmit(): void {
    console.log('Submit button clicked'); // Debug 1
    console.log('Form validity:', this.blogForm.valid); // Debug 2

    if (this.blogForm.invalid) {
      console.log('Form is invalid, errors:', this.blogForm.errors); // Debug 3
      this.blogForm.markAllAsTouched();
      return;
    }

    console.log('Form is valid, proceeding with submission'); // Debug 4
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description || '');
    formData.append('content', this.blogForm.value.content);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log('FormData being sent:', formData); // Debug 5

    this.blogService.createBlog(formData).subscribe({
      next: (response) => {
        console.log('Blog created successfully', response); // Debug 6
        this.isSubmitting = false;
        this.router.navigate(['/blog']);
      },
      error: (error) => {
        console.error('Error creating blog:', error); // Debug 7
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/blog']);
  }
}
