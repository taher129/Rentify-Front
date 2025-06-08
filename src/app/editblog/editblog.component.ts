import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-blog',
  templateUrl: './editblog.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./editblog.component.css']
})
export class EditBlogComponent implements OnInit {
  blogForm: FormGroup;
  blogId!: number;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;
  existingImageUrl: string | null = null;
  originalBlogData: Partial<Blog> | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(255)],
      content: ['', [Validators.required, Validators.minLength(20)]],
      image: [null]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.router.navigate(['/error']);
      return;
    }
    this.blogId = +idParam;
    this.loadBlogData();
  }

  loadBlogData(): void {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
        this.originalBlogData = {
          title: blog.title,
          description: blog.description,
          content: blog.content,
          image: blog.image
        };

        this.blogForm.patchValue({
          title: blog.title,
          description: blog.description,
          content: blog.content
        });

        if (blog.image) {
          // Updated to use relative path through Nginx proxy
          // Assuming your blog images are served through the uploads directory
          this.existingImageUrl = blog.image.startsWith('/uploads/') ? blog.image : '/uploads/' + blog.image;
        }
      },
      error: (err) => {
        console.error('Failed to load blog data:', err);
        this.router.navigate(['/error']);
      }
    });
  }

  get formControls() {
    return this.blogForm.controls;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG)');
        return;
      }
      if (file.size > 5_000_000) { // 5MB limit
        alert('Image must be less than 5MB');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewImage = null;
    this.existingImageUrl = null;
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // Only append changed fields
    if (this.blogForm.value.title !== this.originalBlogData?.title) {
      formData.append('title', this.blogForm.value.title);
    }

    if (this.blogForm.value.description !== this.originalBlogData?.description) {
      formData.append('description', this.blogForm.value.description || '');
    }

    if (this.blogForm.value.content !== this.originalBlogData?.content) {
      formData.append('content', this.blogForm.value.content);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.existingImageUrl === null && this.originalBlogData?.image) {
      // If image was removed
      formData.append('image', '');
    }

    this.blogService.updateBlog(this.blogId, formData).subscribe({
      next: () => {
        this.router.navigate(['/myblogs']);
      },
      error: (error) => {
        console.error('Error updating blog:', error);
        this.isSubmitting = false;
        alert('Failed to update blog. Please try again.');
      }
    });
  }

  onCancel(): void {
    if (confirm('Are you sure you want to discard your changes?')) {
      this.router.navigate(['/my-blogs']);
    }
  }
}
